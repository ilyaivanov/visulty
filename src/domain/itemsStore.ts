import { makeAutoObservable } from "mobx";
import { ItemReactions } from "./itemAutorun";

const item = (title: string, children?: Item[]): Item => ({
  id: title,
  title,
  children,
  isOpen: true,
});

export class ItemsStore {
  root = item("HOME", [
    item("first", [
      item("first 1"),
      item("first 2"),
      item("first 3", [item("first 3,1"), item("first 3.2")]),
    ]),
    item("second"),
    item("third"),
    item("fourth"),
    item("fifth"),
  ]);

  constructor() {
    makeAutoObservable(this);
  }

  toggleItem = (item: Item) => {
    item.isOpen = !item.isOpen;
    this.itemAutoruns.disposeItemReactions(item);
  };

  private itemAutoruns = new ItemReactions();

  itemAutorun = this.itemAutoruns.itemAutorun;
  itemReaction = this.itemAutoruns.itemReaction;
}
