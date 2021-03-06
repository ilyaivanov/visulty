import * as youtubePlayer from "../api/youtubePlayer";
import { AppEvents } from "../events";
import { Item } from "../items";
import { time } from "../lodash";
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
  isDragging = false;
  isVideoFrameShown = true;
  isPlaying = false;
  itemBeingPlayed?: Item;
  currentItemPlayed?: Item;
  queue?: Item[];

  footer: Footer;
  rightSidebar: RightSidebar;

  constructor(private events: AppEvents) {
    this.footer = new Footer({
      playlistIconClicked: this.toggleRightSidebar,
      focusOn: (item) => events.trigger("focusItem", item),
      playNext: this.playNextItemInQueue,
      playPrevious: this.playPreviousItemInQueue,
      toggleVideoVisibility: this.toggleVideoFrameVisibility,
      mouseMoveAlongTrack: this.handleMouseMove,
      mouseDownAtTrack: this.startMoving,
    });
    this.rightSidebar = new RightSidebar({
      onItemClicked: this.playItemInQueue,
    });

    this.rightSidebar.toggleVisibility(this.isRightSidebarVisible);

    events.on("item.play", this.playItem);
    youtubePlayer.addEventListener("videoEnd", this.playNextItemInQueue);

    youtubePlayer.addEventListener("progress", this.updateProgress);
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

  private updateProgress = () => {
    console.log("update progres", this.isDragging);
    if (!this.isDragging)
      this.footer.updateProgress(youtubePlayer.getPlayerProgressState());
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) this.updateTextLabelPosition(e);
  };

  startMoving = (e: MouseEvent) => {
    if (youtubePlayer.hasVideo()) {
      this.isDragging = true;
      this.updateTextLabelPosition(e);
      this.footer.alwaysShowCurrentPosition();

      const seekToMousePosition = (e: MouseEvent, allowAhead: boolean) =>
        youtubePlayer.seek(
          (e.clientX / this.footer.getPlayerWidth()) *
            youtubePlayer.getDuration(),
          allowAhead
        );

      youtubePlayer.pause();
      seekToMousePosition(e, false);
      this.footer.placeBulpAt(e.clientX);

      const onMouseMove = (e: MouseEvent) => {
        seekToMousePosition(e, false);
        this.updateTextLabelPosition(e);
        this.footer.placeBulpAt(e.clientX);
      };
      const onMouseUp = (e: MouseEvent) => {
        this.isDragging = false;
        seekToMousePosition(e, true);
        youtubePlayer.resume();
        this.footer.stopAlwaysShowingCurrentPosition();
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  };

  private updateTextLabelPosition = (e: MouseEvent) => {
    if (youtubePlayer.hasVideo()) {
      const assumedDuration = youtubePlayer.getDuration();
      this.footer.setDestinationLabel(
        time.formatTime(
          (e.clientX / this.footer.getPlayerWidth()) * assumedDuration
        ),
        e.clientX
      );
    }
  };
}
