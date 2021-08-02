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
    // item({ title: "Always Loading", isLoading: true, isOpen: true }),
    folder("Third"),
    folder("Fourth"),
    folder("Five"),
    folder("Six", randomItems(6)),
    folder("Seven"),
  ]);

  searchRoot: MyItem = folder("SEARCH", randomItems(12));

  isSearchVisible = false;

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

  //ACTIONS
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
    if (item.isOpen && !item.children) {
      item.isLoading = true;
      setTimeout(() => {
        item.children = randomItems(10);
        item.isLoading = false;
        this.dispatchCommand({ type: "item-loaded", itemId: item.id });
      }, 2000);
    }
    this.dispatchCommand({ type: "item-toggled", itemId: item.id });
  };

  toggleSearchVisibility = () => {
    this.isSearchVisible = !this.isSearchVisible;
    this.dispatchCommand({ type: "search-visibility-toggled" });
  };

  findVideos = (term: string) => {
    this.dispatchCommand({ type: "searching-start" });
    setTimeout(() => {
      this.searchRoot = folder("SEARCH", randomItems(12));
      this.dispatchCommand({ type: "searching-end" });
    }, 2000);
  };
}

export type DomainCommand =
  | { type: "item-removed"; itemId: string }
  | { type: "item-toggled"; itemId: string }
  | { type: "item-loaded"; itemId: string }
  | { type: "searching-start" }
  | { type: "searching-end" }
  | { type: "search-visibility-toggled" };
