import {
  autorun,
  reaction,
  IReactionPublic,
  IReactionOptions,
  IReactionDisposer,
} from "mobx";
import { Item } from "./item";

//Manage disposal of item reactions and makes sure I don't any have memory leaks for item reactions
//the problem is that I can't simply detect when a node has been removed from the DOM (and thus dispose MobX reactions)
//Using MutationObserver API is not a good option since every DOM change will be tracked and this is very inefficient

export class ItemReactions {
  private itemEffects: Record<string, IReactionDisposer[]> = {};

  itemAutorun = (item: Item, fn: Action<IReactionPublic>) => {
    const dispose = autorun(fn);
    this.addDisposeToItem(item, dispose);
  };

  itemReaction = <T>(
    item: Item,
    expression: (r: IReactionPublic) => T,
    effect: (arg: T, prev: T, r: IReactionPublic) => void,
    opts?: IReactionOptions
  ) => {
    const dispose = reaction(expression, effect, opts);
    this.addDisposeToItem(item, dispose);
  };

  disposeItemChildrenReactions = (item: Item) => {
    this.traverseOpenChildren(item, (child) => {
      this.itemEffects[child.id]?.forEach((dispose) => dispose());
      delete this.itemEffects[child.id];
    });
  };

  private addDisposeToItem = (item: Item, dispose: IReactionDisposer) => {
    if (!this.itemEffects[item.id]) this.itemEffects[item.id] = [];
    this.itemEffects[item.id].push(dispose);
  };

  private traverseOpenChildren = (parent: Item, action: Action<Item>) => {
    const traverseChildren = (children: Item[]) =>
      children.forEach((item) => {
        action(item);
        if (item.isOpen && item.children) {
          traverseChildren(item.children);
        }
      });

    if (parent.children) traverseChildren(parent.children);
  };
}
