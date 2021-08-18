import { AppEvents } from "../events";

export class Item {
  parent?: Item;
  children?: Item[];
  isLoading = false;
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
  get isOpen() {
    return this.props.isOpen;
  }
  get isOpenInSidebar() {
    return this.props.isOpenInSidebar;
  }

  toggleRightSidebarVisibility() {
    this.props.isOpenInSidebar = !this.props.isOpenInSidebar;
    this.events.trigger("item.rightSidebarVisibilityChanged", this);
  }

  isRoot = () => !this.parent;

  isVideo = () => this.props.type === "YTvideo";
  isPlaylist = () => this.props.type === "YTplaylist";
  isChannel = () => this.props.type === "YTchannel";
  isSearch = () => this.props.type === "search";

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

  getVideoId = () =>
    this.props.type === "YTvideo" ? this.props.videoId : undefined;

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

  setNextPageToken = (token: string | undefined) => {
    if (
      this.props.type === "YTchannel" ||
      this.props.type === "YTplaylist" ||
      this.props.type === "search"
    )
      this.props.nextPageToken = token;
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

  getRoot = (): Item => {
    let parent: Item = this;
    while (parent.parent) {
      parent = parent.parent;
    }
    return parent;
  };

  toggleVisibility() {
    //sending message from here
    this.props.isOpen = !this.props.isOpen;
    if (this.isNeededToBeFetched()) {
      this.isLoading = true;
      this.events.trigger("item.loadChildren", this);
    }
    this.events.trigger("itemToggled", this);
  }

  loadNextPage() {
    this.events.trigger("item.loadChildrenNextPage", this);
  }

  pageLoaded(children: MyItem[], nextPageToken: string | undefined) {
    const page = children.map((child) => new Item(child, this.events));
    this.children = (this.children || []).concat(page);

    this.isLoading = false;
    this.children.forEach((child) => (child.parent = this));
    this.setNextPageToken(nextPageToken);
    this.events.trigger("item.childrenNextPageLoaded", { item: this, page });
  }

  childrenLoaded(children: MyItem[], nextPageToken: string | undefined) {
    this.children = children.map((child) => new Item(child, this.events));

    this.isLoading = false;
    this.children.forEach((child) => (child.parent = this));
    this.setNextPageToken(nextPageToken);
    this.events.trigger("item.childrenLoaded", this);
  }

  getItemDistanceFromRoot() {
    return this.getItemPath().length;
  }

  getItemPath = () => {
    const path: Item[] = [];

    let parent: Item = this;
    while (parent.parent) {
      path.push(parent);
      parent = parent.parent;
    }
    return path.reverse();
  };

  createNewItemAsLastChild = () => {
    const newFolder = new Item(
      {
        title: "New Folder",
        id: Math.random() + "",
        type: "folder",
      },
      this.events
    );
    newFolder.parent = this;
    this.children = (this.children || []).concat(newFolder);
    this.events.trigger("itemAdded", newFolder);
  };

  traverseChildrenDFS = (filter?: (item: Item) => boolean): Item[] => {
    const results: Item[] = [];
    const traverseChildren = (item: Item) => {
      if (!filter || filter(item)) results.push(item);

      if (item.children) item.children.forEach(traverseChildren);
    };
    traverseChildren(this);
    return results;
  };

  traverseChildrenBFS = <T>(
    filterMap: (item: Item) => T | undefined,
    maxResults: number
  ): T[] => {
    const results: T[] = [];
    const queue: Item[] = [];
    const traverse = () => {
      const item = queue.shift();

      if (!item || results.length >= maxResults) return queue;

      const resultingItem = filterMap(item);

      if (resultingItem) results.push(resultingItem);
      if (item.children)
        item.children.forEach((subitem) => queue.push(subitem));
      traverse();
    };

    queue.push(this);
    traverse();
    return results;
  };
}
