export const randomItems = (count: number): MyItem[] =>
  Array.from(new Array(count)).map(() =>
    folder("Item " + Math.floor(Math.random() * 100))
  );

export const folder = (
  props: string | Partial<Folder>,
  children?: MyItem[]
) => {
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

export const dummyRoot = folder("HOME", [
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

export const assignParents = (parent: MyItem, children: MyItem[]) => {
  children.forEach((child) => {
    child.parent = parent;
    if (child.children) assignParents(child, child.children);
  });
};

assignParents(dummyRoot, dummyRoot.children!);
