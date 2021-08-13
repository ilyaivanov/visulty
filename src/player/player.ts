import { play, addEventListener } from "../api/youtubePlayer";
import { CommandsDispatcher } from "../dispatcher";
import { traverseChildrenDFS } from "../domain/itemQueries";

export class PlayerState {
  isVideoFrameShown = true;
  itemBeingPlayed?: MyItem;
  currentItemPlayed?: YoutubeVideo;
  queue?: YoutubeVideo[];

  constructor(private dispatcher: CommandsDispatcher) {
    addEventListener("videoEnd", () => this.playNextItemInQueue());
  }

  playItem = (item: MyItem) => {
    this.itemBeingPlayed = item;
    if (item.type == "YTvideo") this.setQueue([item]);
    else {
      const queue = traverseChildrenDFS(
        item,
        (item) => item.type === "YTvideo"
      ) as YoutubeVideo[];
      this.setQueue(queue);
    }
  };

  setQueue = (items: YoutubeVideo[]) => {
    this.queue = items;
    this.dispatcher.rightSidebar?.viewQueue(this.itemBeingPlayed!, this.queue);
    this.playItemInQueue(items[0]);
  };

  playItemInQueue(item: YoutubeVideo) {
    this.currentItemPlayed = item;
    play(item.videoId);
    this.dispatcher.footer?.itemPlayed(item);
    this.dispatcher.rightSidebar?.playItemInQueue(item);
  }

  canPlayNextItem(): boolean {
    if (this.queue && this.currentItemPlayed) {
      const index = this.queue.indexOf(this.currentItemPlayed);
      return index != this.queue.length - 1;
    }
    return false;
  }

  playNextItemInQueue() {
    if (this.canPlayNextItem()) {
      if (this.queue && this.currentItemPlayed) {
        const index = this.queue.indexOf(this.currentItemPlayed);
        this.playItemInQueue(this.queue[index + 1]);
      }
    }
  }

  canPlayPreviousItem(): boolean {
    if (this.queue && this.currentItemPlayed) {
      const index = this.queue.indexOf(this.currentItemPlayed);
      return index != 0;
    }
    return false;
  }

  playPreviousItemInQueue() {
    if (this.canPlayPreviousItem()) {
      if (this.queue && this.currentItemPlayed) {
        const index = this.queue.indexOf(this.currentItemPlayed);
        this.playItemInQueue(this.queue[index - 1]);
      }
    }
  }

  toggleVideoFrameVisibility = () => {
    this.isVideoFrameShown = !this.isVideoFrameShown;
    this.dispatcher.footer?.onVideoFrameVisibilityChanged();
  };
}
