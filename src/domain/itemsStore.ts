import { makeAutoObservable } from "mobx";
import {
  getChannelUploadsPlaylistId,
  loadChannelItems,
  loadPlaylistItems,
  ResponseItem,
} from "../api/youtube";
import { mapResponseItem } from "../app/searchTab";
import { FolderItem, Item } from "./item";
import { ItemReactions } from "./itemAutorun";

export class ItemsStore {
  homeRoot!: Item;

  searchRoot: Item = new FolderItem({
    title: "Search",
    children: [
      new FolderItem({ title: "item 1" }),
      new FolderItem({ title: "item 2" }),
      new FolderItem({ title: "item 3" }),
      new FolderItem({ title: "item 4" }),
    ],
  });
  constructor() {
    makeAutoObservable(this, {
      //root is never changed once assigned
      homeRoot: false,
      searchRoot: false,
    });
  }

  toggleItem = (item: Item) => {
    if (item.isNeededToBeFetched) {
      const itemLoaded = (items: ResponseItem[]) => {
        item.children = items.map((item) => mapResponseItem(item));
        item.stopLoading();
      };
      if (item.isPlaylist()) {
        item.startLoading();
        loadPlaylistItems(item.playlistId).then((response) =>
          itemLoaded(response.items)
        );
      }
      if (item.isChannel()) {
        item.startLoading();
        Promise.all([
          getChannelUploadsPlaylistId(item.channelId),
          loadChannelItems(item.channelId),
        ]).then(([uploadsChannelId, response]) => {
          const uploadsPlaytlist: ResponseItem = {
            itemType: "playlist",
            channelId: item.channelId,
            channelTitle: item.title,
            id: Math.random() + "",
            image: item.channelImage,
            itemId: uploadsChannelId,
            name: item.title + " Uploads",
          } as ResponseItem;
          itemLoaded([uploadsPlaytlist].concat(response.items));
        });
      }
    }
    item.isOpen = !item.isOpen;
    this.itemAutoruns.disposeItemChildrenReactions(item);
  };

  private itemAutoruns = new ItemReactions();

  itemAutorun = this.itemAutoruns.itemAutorun;
  itemReaction = this.itemAutoruns.itemReaction;
}
