import { sampleUserName } from "../api/config";
import { assignParents, randomItems } from "../api/dummyUserState";
import { saveUserSettings, serializeRootItem } from "../api/userState";
import * as youtubeApi from "../api/youtubeApi";
import * as itemsQueries from "./itemQueries";

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

  constructor(private dispatchCommand: Action<DomainCommand>) {
    if (this.searchRoot.children)
      assignParents(this.searchRoot, this.searchRoot.children);
  }

  //QUERIES

  hasItemImage = (item: MyItem) => "image" in item || "videoId" in item;

  isVideo = (item: MyItem): item is YoutubeVideo => item.type === "YTvideo";
  isPlaylist = (item: MyItem): item is YoutubePlaylist =>
    item.type === "YTplaylist";
  isChannel = (item: MyItem): item is YoutubeChannel =>
    item.type === "YTchannel";

  isSearch = (item: MyItem): item is SearchRoot => item.type === "search";

  isContainer = (
    item: MyItem
  ): item is YoutubePlaylist | YoutubeChannel | Folder =>
    item.type != "YTvideo";

  isEmpty = (item: MyItem) => !item.children || item.children.length == 0;
  isNeededToBeFetched = (item: MyItem) =>
    this.isEmpty(item) &&
    !item.isLoading &&
    (this.isPlaylist(item) || this.isChannel(item));

  //ACTIONS

  removeItem = (item: MyItem, props?: { instant?: boolean }) => {
    const parent = item.parent;
    if (parent && parent.children) {
      parent.children = parent.children.filter((sibling) => item != sibling);
      this.dispatchCommand({
        type: "item-removed",
        itemId: item.id,
        instant: props?.instant,
      });
    }
  };

  toggleItem = (item: MyItem) => {
    item.isOpen = !item.isOpen;
    if (this.isNeededToBeFetched(item)) {
      item.isLoading = true;
      this.loadItem(item).then((children) => {
        itemsQueries.assignChildrenTo(item, children);
        item.isLoading = false;
        this.dispatchCommand({ type: "item-loaded", itemId: item.id });
      });
    }
    this.dispatchCommand({ type: "item-toggled", itemId: item.id });
  };

  loadNextPage = (item: MyItem) => {
    if (!item.isLoading) {
      item.isLoading = true;
      this.loadItem(item, itemsQueries.getNextPageToken(item)).then(
        (nextChildren) => {
          console.log("Loaded next page for " + item.title, nextChildren);
          itemsQueries.appendChildrenTo(item, nextChildren);

          item.isLoading = false;
          if (this.isSearch(item))
            this.dispatchCommand({ type: "searching-end" });
          else this.dispatchCommand({ type: "item-loaded", itemId: item.id });
        }
      );
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
    this.loadItem(this.searchRoot).then((items) => {
      itemsQueries.assignChildrenTo(this.searchRoot, items);

      this.dispatchCommand({ type: "searching-end" });
    });
  };

  loadItem = (item: MyItem, pageToken?: string): Promise<MyItem[]> => {
    if (this.isSearch(item)) {
      return youtubeApi
        .loadSearchResults(item.term, item.nextPageToken)
        .then((response) => {
          this.searchRoot.nextPageToken = response.nextPageToken;
          return response.items.map(mapResponseItem);
        });
    }
    if (this.isPlaylist(item)) {
      return youtubeApi
        .loadPlaylistItems(item.playlistId, pageToken)
        .then((response) => {
          item.nextPageToken = response.nextPageToken;
          return response.items.map(mapResponseItem);
        });
    }
    if (this.isChannel(item)) {
      if (!pageToken) {
        return Promise.all([
          youtubeApi.getChannelUploadsPlaylistId(item.channelId),
          youtubeApi.loadChannelItems(item.channelId),
        ]).then(([uploadsChannelId, response]) => {
          const uploadsPlaytlist: youtubeApi.ResponseItem = {
            itemType: "playlist",
            channelId: item.channelId,
            channelTitle: item.title,
            id: Math.random() + "",
            image: item.image,
            itemId: uploadsChannelId,
            name: item.title + " Uploads",
          } as youtubeApi.ResponseItem;
          item.nextPageToken = response.nextPageToken;
          return [uploadsPlaytlist].concat(response.items).map(mapResponseItem);
        });
      } else {
        return youtubeApi
          .loadChannelItems(item.channelId, pageToken)
          .then((response) => {
            item.nextPageToken = response.nextPageToken;
            return response.items.map(mapResponseItem);
          });
      }
    }
    throw new Error(`Can't load ${item.title} of type ${item.type}`);
  };

  addItemToTheEndOf = (item: MyItem) => {
    const newFolder: Folder = {
      title: "New Folder",
      id: Math.random() + "",
      type: "folder",
      parent: item,
    };
    item.children = item.children!.concat(newFolder);
    this.dispatchCommand({ type: "item-added", item: newFolder });
  };

  moveItem = (props: {
    itemOver: MyItem;
    placement: DropPlacement;
    itemUnder: MyItem;
  }) => {
    const { itemOver, placement, itemUnder } = props;

    this.removeItem(itemOver, { instant: true });

    if (placement === "after") {
      this.insertItemAfter(itemUnder, itemOver);
      this.dispatchCommand({ type: "item-added", item: itemOver });
    } else if (placement == "before") {
      this.insertItemBefore(itemUnder, itemOver);
      this.dispatchCommand({ type: "item-added", item: itemOver });
    } else if (placement == "inside") {
      this.insertItemInside(itemUnder, itemOver);
      this.dispatchCommand({ type: "item-added", item: itemOver });
    }
  };

  insertItemAfter = (itemRelativeToInsert: MyItem, itemToInsert: MyItem) => {
    const context = itemRelativeToInsert.parent!.children!;
    const index = context.indexOf(itemRelativeToInsert);

    context.splice(index + 1, 0, itemToInsert);
    itemToInsert.parent = itemRelativeToInsert.parent;
  };

  insertItemBefore = (itemRelativeToInsert: MyItem, itemToInsert: MyItem) => {
    const context = itemRelativeToInsert.parent!.children!;
    const index = context.indexOf(itemRelativeToInsert);

    context.splice(index, 0, itemToInsert);
    itemToInsert.parent = itemRelativeToInsert.parent;
  };

  insertItemInside = (parentItem: MyItem, itemToInsert: MyItem) => {
    parentItem.children = [itemToInsert].concat(parentItem.children || []);
    itemToInsert.parent = parentItem;
  };

  save = () => {
    saveUserSettings(
      { itemsSerialized: serializeRootItem(this.root) },
      sampleUserName
    );
  };
}

const mapResponseItem = (item: youtubeApi.ResponseItem): MyItem => {
  if (item.itemType === "video")
    return {
      type: "YTvideo",
      id: item.id,
      title: item.name,
      videoId: item.itemId,
    };
  else if (item.itemType === "channel")
    return {
      type: "YTchannel",
      id: item.id,
      title: item.name,
      channelId: item.itemId,
      image: item.image,
      isOpen: false,
    };
  else
    return {
      type: "YTplaylist",
      id: item.id,
      title: item.name,
      playlistId: item.itemId,
      image: item.image,
      isOpen: false,
    };
};
