import { makeAutoObservable } from "mobx";
import { createFolder, Item } from "./item";
import { ItemReactions } from "./itemAutorun";

export class ItemsStore {
  homeRoot!: Item;

  searchRoot: Item = createFolder("Search", [
    createFolder("item 1"),
    createFolder("item 2"),
    createFolder("item 3"),
    createFolder("item 4"),
  ]);
  constructor() {
    makeAutoObservable(this, {
      //root is never changed once assigned
      homeRoot: false,
      searchRoot: false,
    });
  }

  toggleItem = (item: Item) => {
    item.isOpen = !item.isOpen;
    this.itemAutoruns.disposeItemChildrenReactions(item);
  };

  private itemAutoruns = new ItemReactions();

  itemAutorun = this.itemAutoruns.itemAutorun;
  itemReaction = this.itemAutoruns.itemReaction;
}
