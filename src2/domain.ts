import * as youtubeApi from "./api/youtube";
import { store } from "./globals";

export class Store {
  root: MyItem = {
    id: "HOME",
    type: "folder",
    title: "Home",
  };

  searchRoot: MyItem = {
    id: "SEARCH",
    type: "folder",
    title: "Search",
  };

  isSearchVisible = false;

  theme: AppTheme = "light";

  constructor(private dispatchCommand: Action<DomainCommand>) {}

  //QUERIES

  hasItemImage = (item: MyItem) => "image" in item || "videoId" in item;

  getPreviewImage = (item: MyItem): string => {
    if ("videoId" in item)
      return `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
    else if ("image" in item) return item.image;
    else return "";
  };

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

  toggleTheme = () => {
    this.theme = this.theme === "dark" ? "light" : "dark";
    this.dispatchCommand({ type: "theme-changed" });
  };

  removeItem = (item: MyItem) => {
    const parent = item.parent;
    console.log(parent);
    if (parent && parent.children) {
      parent.children = parent.children.filter((sibling) => item != sibling);
      this.dispatchCommand({ type: "item-removed", itemId: item.id });
    }
  };

  toggleItem = (item: MyItem) => {
    item.isOpen = !item.isOpen;
    if (store.isNeededToBeFetched(item)) {
      item.isLoading = true;
      this.loadItem(item).then((children) => {
        item.children = children;
        item.isLoading = false;
        this.dispatchCommand({ type: "item-loaded", itemId: item.id });
      });
    }
    this.dispatchCommand({ type: "item-toggled", itemId: item.id });
  };

  toggleSearchVisibility = () => {
    this.isSearchVisible = !this.isSearchVisible;
    this.dispatchCommand({ type: "search-visibility-toggled" });
  };

  findVideos = (term: string) => {
    this.dispatchCommand({ type: "searching-start" });

    this.searchVideos(term).then((searchRoot) => {
      this.searchRoot = searchRoot;
      this.dispatchCommand({ type: "searching-end" });
    });
  };

  searchVideos = (term: string): Promise<MyItem> => {
    return youtubeApi.loadSearchResults(term).then(
      (response) =>
        ({
          id: "SEARCH",
          title: "Search",
          type: "folder",
          children: response.items.map(mapResponseItem),
        } as MyItem)
    );
  };

  loadItem = (item: MyItem): Promise<MyItem[]> => {
    if (store.isPlaylist(item)) {
      return youtubeApi
        .loadPlaylistItems(item.playlistId)
        .then((response) => response.items.map(mapResponseItem));
    }
    if (store.isChannel(item)) {
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

export type DomainCommand =
  | { type: "theme-changed" }
  | { type: "item-removed"; itemId: string }
  | { type: "item-toggled"; itemId: string }
  | { type: "item-loaded"; itemId: string }
  | { type: "item-added"; item: MyItem }
  | { type: "searching-start" }
  | { type: "searching-end" }
  | { type: "search-visibility-toggled" };
