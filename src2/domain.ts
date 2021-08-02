import * as youtubeApi from "./api/youtube";
import { store } from "./globals";

const randomItems = (count: number): MyItem[] =>
  Array.from(new Array(count)).map(() =>
    folder("Item " + Math.floor(Math.random() * 100))
  );

const folder = (props: string | Partial<Folder>, children?: MyItem[]) => {
  const title = typeof props === "object" ? props.title || "" : props;
  const item: MyItem = {
    title,
    children,
    type: "folder",
    isOpen: children ? true : false,
    id: Math.random() + ` (${title})`,
  };
  if (typeof props === "object") Object.assign(item, props);
  return item;
};

const video = (title: string, videoId: string) => {
  const item: YoutubeVideo = {
    id: Math.random() + ` (${title})`,
    title,
    videoId,
    type: "YTvideo",
  };
  return item;
};
const playlist = (title: string, image: string) => {
  const item: YoutubePlaylist = {
    id: Math.random() + ` (${title})`,
    title,
    playlistId: "Dummy playlist ID",
    image,
    isOpen: false,
    type: "YTplaylist",
  };
  return item;
};
const channel = (title: string, image: string) => {
  const item: YoutubeChannel = {
    id: Math.random() + ` (${title})`,
    title,
    channelId: "Dummy channel ID",
    image,
    isOpen: false,
    type: "YTchannel",
  };
  return item;
};

export class Store {
  root: MyItem = folder("HOME", [
    folder({ title: "First", isOpen: false }, randomItems(12)),
    folder({ title: "Second" }, [
      video("Miss Monique - Live @ Radio Intense 27.12.2016", "423_yEqLGvQ"),
      video("@Miss Monique - Live @ Radio Intense 09.08.2016", "HZsbVra-McI"),
      video(
        "@Miss Monique - Live @ Radio Intense 03.05.2018 // Progressive House, Techno Mix",
        "jz1aO9bfJCE"
      ),
      video(
        "Miss Monique - Live @ Radio Intense 11.06.2021 [Progressive House / Melodic Techno DJ Mix] 4K",
        "MdcxWieOSME"
      ),

      channel(
        "Miss Monique",
        "https://yt3.ggpht.com/ytc/AKedOLTqbZr-DIvWn3-5WSr5tOFSS7OUY3D5lv6x8TsnNZo=s176-c-k-c0x00ffffff-no-rj-mo"
      ),
      playlist(
        "Miss Monique @ Radio Intense // Progressive House, Melodic Techno Mix 2021",
        "https://i.ytimg.com/vi/mNF9eMOuSUk/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDjbMzSolSufM4I6qWbwKNBEs8hZg"
      ),
    ]),
    folder({ title: "Always Loading", isLoading: true, isOpen: true }),
    folder("Third"),
    folder("Fourth"),
    folder("Five"),
    folder("Six", randomItems(6)),
    folder("Seven"),
  ]);

  searchRoot: MyItem = folder("SEARCH", randomItems(12));

  isSearchVisible = false;

  theme: AppTheme = "light";

  constructor(private dispatchCommand: Action<DomainCommand>) {
    this.assignParents(this.root, this.root.children!);
  }

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
  assignParents = (parent: MyItem, children: MyItem[]) => {
    children.forEach((child) => {
      child.parent = parent;
      if (child.children) this.assignParents(child, child.children);
    });
  };

  removeItem = (item: MyItem) => {
    const parent = item.parent;
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
  | { type: "searching-start" }
  | { type: "searching-end" }
  | { type: "search-visibility-toggled" };
