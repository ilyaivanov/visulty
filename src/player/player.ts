import * as youtubePlayer from "../api/youtubePlayer";
import { AppEvents } from "../events";
import { Item } from "../items";
import { Footer } from "./footer";
import { RightSidebar } from "./rightSidebar";

type PlayerResults = {
  footer: HTMLElement;
  rightSidebar: HTMLElement;
};

export const viewPlayer = (events: AppEvents): PlayerResults => {
  const state = new PlayerState(events);
  return {
    footer: state.footer.el,
    rightSidebar: state.rightSidebar.el,
  };
};

export class PlayerState {
  isRightSidebarVisible = false;
  isVideoFrameShown = true;
  itemBeingPlayed?: Item;
  currentItemPlayed?: Item;
  queue?: Item[];

  footer: Footer;
  rightSidebar: RightSidebar;

  constructor(private events: AppEvents) {
    this.footer = new Footer({
      playlistIconClicked: this.toggleRightSidebar,
      focusOn: () => 42,
      playNext: this.playNextItemInQueue,
      playPrevious: this.playPreviousItemInQueue,
      toggleVideoVisibility: this.toggleVideoFrameVisibility,
    });
    this.rightSidebar = new RightSidebar({
      onItemClicked: this.playItemInQueue,
    });

    this.rightSidebar.toggleVisibility(this.isRightSidebarVisible);

    events.on("itemPlay", this.playItem);
    youtubePlayer.addEventListener("videoEnd", () =>
      this.playNextItemInQueue()
    );
  }

  playItem = (item: Item) => {
    this.itemBeingPlayed = item;
    if (item.isVideo()) this.setQueue([item]);
    else {
      const queue = item.traverseChildrenDFS((item) => item.isVideo());
      this.setQueue(queue);
    }
  };

  setQueue = (items: Item[]) => {
    this.queue = items;
    this.rightSidebar.viewQueue(this.itemBeingPlayed!, this.queue);
    this.playItemInQueue(items[0]);
  };

  playItemInQueue = (item: Item) => {
    this.currentItemPlayed = item;
    const videoId = item.getVideoId();
    videoId && youtubePlayer.play(videoId);
    this.footer.itemPlayed(item);
    this.rightSidebar.playItemInQueue(item);
  };

  canPlayNextItem(): boolean {
    if (this.queue && this.currentItemPlayed) {
      const index = this.queue.indexOf(this.currentItemPlayed);
      return index != this.queue.length - 1;
    }
    return false;
  }

  playNextItemInQueue = () => {
    if (this.canPlayNextItem()) {
      if (this.queue && this.currentItemPlayed) {
        const index = this.queue.indexOf(this.currentItemPlayed);
        this.playItemInQueue(this.queue[index + 1]);
      }
    }
  };

  canPlayPreviousItem(): boolean {
    if (this.queue && this.currentItemPlayed) {
      const index = this.queue.indexOf(this.currentItemPlayed);
      return index != 0;
    }
    return false;
  }

  playPreviousItemInQueue = () => {
    if (this.canPlayPreviousItem()) {
      if (this.queue && this.currentItemPlayed) {
        const index = this.queue.indexOf(this.currentItemPlayed);
        this.playItemInQueue(this.queue[index - 1]);
      }
    }
  };

  toggleVideoFrameVisibility = () => {
    this.isVideoFrameShown = !this.isVideoFrameShown;
    this.footer.onVideoFrameVisibilityChanged(this.isVideoFrameShown);
  };

  toggleRightSidebar = () => {
    this.isRightSidebarVisible = !this.isRightSidebarVisible;
    this.rightSidebar.toggleVisibility(this.isRightSidebarVisible);
  };
}
