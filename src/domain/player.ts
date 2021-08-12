import { play } from "../api/youtubePlayer";
import { CommandsDispatcher } from "../dispatcher";
import { traverseChildrenDFS } from "./itemQueries";

export class PlayerState {
  itemBeingPlayed?: MyItem;
  currentItemPlayed?: MyItem;
  queue?: YoutubeVideo[];

  constructor(private dispatcher: CommandsDispatcher) {}

  playItem = (item: MyItem) => {
    this.itemBeingPlayed = item;
    if (item.type == "YTvideo") play(item.videoId);
    else {
      this.queue = traverseChildrenDFS(
        item,
        (item) => item.type === "YTvideo"
      ) as YoutubeVideo[];
      play(this.queue[0].videoId);
    }
  };
}
