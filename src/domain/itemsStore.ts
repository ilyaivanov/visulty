import { assignParents, randomItems } from "../api/dummyUserState";
import * as youtubeApi from "../api/youtubeApi";
import * as itemsQueries from "./itemQueries";
import { findLocalItems } from "./localSearch";

export class ItemsStore {
  root: MyItem = {
    id: "HOME",
    type: "folder",
    title: "Home",
  };

  searchRoot: MyItem = {
    id: "SEARCH",
    type: "folder",
    title: "Search",
    children: randomItems(20),
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

  toggleItemOnSidebar = (item: MyItem) => {
    item.isOpenInSidebar = !item.isOpenInSidebar;
    this.dispatchCommand({ type: "item-toggled-in-sidebar", item });
  };

  findVideos = (term: string) => {
    this.dispatchCommand({ type: "searching-start" });

    this.searchVideos(term).then((items) => {
      itemsQueries.assignChildrenTo(this.searchRoot, items);
      this.dispatchCommand({ type: "searching-end" });
    });
  };

  searchForLocalItems = (term: string) => {
    const results = findLocalItems(this.root, term);
    this.dispatchCommand({ type: "searching-local-end", results });
  };

  searchVideos = (term: string): Promise<MyItem[]> => {
    return youtubeApi
      .loadSearchResults(term)
      .then((response) => response.items.map(mapResponseItem));
  };

  loadItem = (item: MyItem): Promise<MyItem[]> => {
    if (this.isPlaylist(item)) {
      return youtubeApi
        .loadPlaylistItems(item.playlistId)
        .then((response) => response.items.map(mapResponseItem));
    }
    if (this.isChannel(item)) {
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
        return [uploadsPlaytlist].concat(response.items).map(mapResponseItem);
      });
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
