import { AppEvents } from "../events";

export class Item {
  parent?: Item;
  children?: Item[];
  constructor(public props: MyItem, private events: AppEvents) {
    if (props.children)
      this.children = props.children.map((child) => new Item(child, events));
    this.children?.forEach((child) => (child.parent = this));
  }
  get title() {
    return this.props.title;
  }

  setTitle(title: string) {
    this.props.title = title;
  }
  get id() {
    return this.props.id;
  }
  get isLoading() {
    return this.props.isLoading;
  }
  get isOpen() {
    return this.props.isOpen;
  }

  isVideo = () => this.props.type === "YTvideo";
  isPlaylist = () => this.props.type === "YTplaylist";
  isChannel = () => this.props.type === "YTchannel";

  isEmpty = () => !this.children || this.children.length == 0;

  hasItemImage = () => "image" in this.props || "videoId" in this.props;

  isContainer = (): this is YoutubePlaylist | YoutubeChannel | Folder =>
    this.props.type != "YTvideo";

  getPreviewImage = (): string => {
    if ("videoId" in this.props)
      return `https://i.ytimg.com/vi/${this.props.videoId}/mqdefault.jpg`;
    else if ("image" in this.props) return this.props.image;
    else return "";
  };

  isNeededToBeFetched = () =>
    this.isEmpty() &&
    !this.isLoading &&
    (this.isPlaylist() || this.isChannel());

  getNextPageToken = (): string | undefined => {
    if (
      this.props.type === "YTchannel" ||
      this.props.type === "YTplaylist" ||
      this.props.type === "search"
    )
      return this.props.nextPageToken;
    return undefined;
  };

  remove() {
    const { parent } = this;
    if (parent) {
      parent.children =
        parent.children && parent.children.filter((child) => child != this);
      this.events.trigger("itemRemoved", {
        item: this,
        isInstant: false,
      });
    }
  }

  toggleVisibility() {
    //sending message from here
    console.log("toggle");
    this.props.isOpen = !this.props.isOpen;
    this.events.trigger("itemToggled", this);
  }
}
