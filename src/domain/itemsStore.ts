import { makeAutoObservable } from "mobx";
import { Item } from "./item";
import { ItemReactions } from "./itemAutorun";

export class ItemsStore {
  root!: Item;

  constructor() {
    makeAutoObservable(this, {
      //root is never changed once assigned
      root: false,
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
