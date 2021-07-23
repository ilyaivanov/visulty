import { makeAutoObservable } from "mobx";

export type ItemType = "folder" | "YTvideo";

type ItemProps =
  | { type: "folder" }
  | { type: "YTvideo"; videoId: string }
  | { type: "YTplaylist"; playlistId: string; imageUrl: string }
  | { type: "YTchannel"; channelId: string; imageUrl: string };

export class Item {
  id: string;
  isOpen = true;
  constructor(
    public title: string,
    private props: ItemProps,
    public children?: Item[]
  ) {
    this.id = Math.random() + "";
    makeAutoObservable(this);
  }

  get isContainer() {
    return this.props.type !== "YTvideo";
  }
  get isEmpty() {
    return !this.children;
  }

  get isNeededToBeFetched() {
    return this.isEmpty && this.props.type === "YTplaylist";
  }

  get hasImage() {
    return this.props.type === "YTvideo";
  }

  get imageUrl() {
    if (this.props.type === "YTvideo")
      return `https://i.ytimg.com/vi/${this.props.videoId}/mqdefault.jpg`;
    if (this.props.type === "YTplaylist") return this.props.imageUrl;
    if (this.props.type === "YTchannel") return this.props.imageUrl;
  }

  get isChannel() {
    return this.props.type === "YTchannel";
  }
  get isVideo() {
    return this.props.type === "YTvideo";
  }
  get isPlaylist() {
    return this.props.type === "YTplaylist";
  }
}

export const createFolder = (title: string, children?: Item[]): Item =>
  new Item(title, { type: "folder" }, children);

export const createVideo = (title: string, videoId: string): Item =>
  new Item(title, { type: "YTvideo", videoId });

export const createPlaylist = (title: string, imageUrl: string): Item =>
  new Item(title, { type: "YTplaylist", imageUrl, playlistId: "someDummyId" });

export const createChannel = (title: string, imageUrl: string): Item =>
  new Item(title, { type: "YTchannel", imageUrl, channelId: "someDummyId" });
