import { action, makeObservable, observable } from "mobx";

export type ItemType = "folder" | "YTvideo" | "YTplaylist" | "YTchannel";

type ItemProps = {
  title: string;
  type: ItemType;
  children?: Item[];
};

export abstract class Item {
  id: string;
  isOpen = true;
  isLoading = false;
  children?: Item[];
  title: string;
  private type: ItemType;
  constructor(props: ItemProps) {
    this.id = Math.random() + "";
    this.type = props.type;
    this.title = props.title;
    this.children = props.children;

    makeObservable(this, {
      isOpen: observable,
      isLoading: observable,
      children: observable,
      startLoading: action,
      stopLoading: action,
    });
  }

  get isContainer() {
    return !this.isVideo();
  }

  get isEmpty() {
    return !this.children || this.children.length == 0;
  }

  get isNeededToBeFetched() {
    return this.isEmpty && (this.isPlaylist() || this.isChannel());
  }

  get imageUrl(): string | undefined {
    if (this.isVideo())
      return `https://i.ytimg.com/vi/${this.videoId}/mqdefault.jpg`;
    if (this.isPlaylist()) return this.playlistImage;
    if (this.isChannel()) return this.channelImage;
  }

  isChannel(): this is ChannelItem {
    return this.type === "YTchannel";
  }
  isVideo(): this is VideoItem {
    return this.type === "YTvideo";
  }
  isPlaylist(): this is PlaylistItem {
    return this.type === "YTplaylist";
  }

  startLoading() {
    this.isLoading = true;
  }
  stopLoading() {
    this.isLoading = false;
  }
}

type PlaylistProps = {
  playlistId: string;
  playlistImage: string;
} & Omit<ItemProps, "type">;
export class PlaylistItem extends Item {
  playlistId: string;
  playlistImage: string;
  constructor(props: PlaylistProps) {
    super({ ...props, type: "YTplaylist" });
    this.playlistId = props.playlistId;
    this.playlistImage = props.playlistImage;
    this.isOpen = false;
  }
}

type VideoProps = {
  videoId: string;
} & Omit<ItemProps, "type">;
export class VideoItem extends Item {
  videoId: string;
  constructor(props: VideoProps) {
    super({ ...props, type: "YTvideo" });
    this.videoId = props.videoId;
    this.isOpen = false;
  }
}

type ChannelProps = {
  channelId: string;
  channelImage: string;
} & Omit<ItemProps, "type">;
export class ChannelItem extends Item {
  channelId: string;
  channelImage: string;
  constructor(props: ChannelProps) {
    super({ ...props, type: "YTchannel" });
    this.channelId = props.channelId;
    this.channelImage = props.channelImage;
    this.isOpen = false;
  }
}

type FolderProps = {} & Omit<ItemProps, "type">;
export class FolderItem extends Item {
  constructor(props: FolderProps) {
    super({ ...props, type: "folder" });
    this.isOpen = true;
  }
}
