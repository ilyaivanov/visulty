import { sampleUserName } from "../api/config";
import { saveUserSettings, serializeRootItem } from "../api/userState";
import * as youtubeApi from "../api/youtubeApi";
import * as items from "../items";

export class ItemsStore {
  root: MyItem = {
    id: "HOME",
    type: "folder",
    title: "Home",
  };

  searchRoot: SearchRoot = {
    id: "SEARCH",
    type: "search",
    title: "Search",
    term: "",
  };

  constructor(private dispatchCommand: Action<DomainCommand>) {}

  //ACTIONS
  removeItem = (item: MyItem, props?: { instant?: boolean }) => {
    items.removeItem(item);
    this.dispatchCommand({
      type: "item-removed",
      itemId: item.id,
      instant: props?.instant,
    });
  };

  toggleItem = (item: MyItem) => {
    item.isOpen = !item.isOpen;
    if (items.isNeededToBeFetched(item)) {
      item.isLoading = true;
      this.loadItem(item).then((children) => {
        items.assignChildrenTo(item, children);
        item.isLoading = false;
        this.dispatchCommand({ type: "item-loaded", itemId: item.id });
      });
    }
    this.dispatchCommand({ type: "item-toggled", itemId: item.id });
  };

  loadNextPage = (item: MyItem) => {
    if (!item.isLoading) {
      item.isLoading = true;
      this.loadItem(item, items.getNextPageToken(item)).then((nextChildren) => {
        items.appendChildrenTo(item, nextChildren);

        item.isLoading = false;
        if (items.isSearch(item))
          this.dispatchCommand({ type: "searching-end" });
        else this.dispatchCommand({ type: "item-loaded", itemId: item.id });
      });
    }
  };

  toggleItemOnSidebar = (item: MyItem) => {
    item.isOpenInSidebar = !item.isOpenInSidebar;
    this.dispatchCommand({ type: "item-toggled-in-sidebar", item });
  };

  findVideos = (term: string) => {
    this.dispatchCommand({ type: "searching-start" });

    this.searchRoot.term = term;
    this.searchRoot.nextPageToken = "";
    this.loadItem(this.searchRoot).then((foundItems) => {
      items.assignChildrenTo(this.searchRoot, foundItems);

      this.dispatchCommand({ type: "searching-end" });
    });
  };

  private loadItem = (item: MyItem, pageToken?: string): Promise<MyItem[]> => {
    let loadingPromise: Promise<youtubeApi.MappedResponse> | undefined =
      undefined;
    if (items.isSearch(item)) {
      loadingPromise = youtubeApi.loadSearchResults(item);
    }
    if (items.isPlaylist(item)) {
      loadingPromise = youtubeApi.loadPlaylistItems(item.playlistId, pageToken);
    }
    if (items.isChannel(item)) {
      loadingPromise = youtubeApi.loadChannelItems(item);
    }

    if (loadingPromise)
      return loadingPromise.then((response) => {
        item.nextPageToken = response.nextPageToken;
        return response.items;
      });
    throw new Error(`Can't load ${item.title} of type ${item.type}`);
  };

  addItemToTheEndOf = (item: MyItem) => {
    const newFolder = items.createNewItemAsLastChild(item);
    this.dispatchCommand({ type: "item-added", item: newFolder });
  };

  moveItem = (props: {
    itemOver: MyItem;
    placement: DropPlacement;
    itemUnder: MyItem;
  }) => {
    const { itemOver, placement, itemUnder } = props;

    this.removeItem(itemOver, { instant: true });

    items.moveItem(itemOver, placement, itemUnder);
    this.dispatchCommand({ type: "item-added", item: itemOver });
  };

  save = () => {
    saveUserSettings(
      { itemsSerialized: serializeRootItem(this.root) },
      sampleUserName
    );
  };
}
