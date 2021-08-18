import { AppEvents } from "../events";
import { Item } from "../items";
import { ItemIcon } from "./itemIcon";
import { itemSkeleton } from "./itemSkeleton";
import { ItemView } from "./itemView";
export { ItemView } from "./itemView";

//used by search (will be removed)
export const showSkeletons = (count: number, level = 0) =>
  Array.from(new Array(count)).map((_, index) => itemSkeleton(index, level));

//used by Dnd and local search
export const viewIconFor = (item: Item) => ItemIcon.viewIcon(item);

export class ItemsTree {
  private rowsShown: WeakMap<Item, ItemView> = new WeakMap();

  constructor(private events: AppEvents) {
    events.on("itemRemoved", ({ item, isInstant }) =>
      this.actionOnItem(item, (view) => view.remove(isInstant))
    );
    events.on("itemToggled", (item) =>
      this.actionOnItem(item, (view) => view.updateItemChildrenVisibility(true))
    );
  }

  public rowShown = (row: ItemView) => {
    this.rowsShown.set(row.item, row);
  };

  viewChildrenFor = (item: Item): Node[] | undefined =>
    item.children &&
    item.children.map(
      (item) => new ItemView(item, 0, this.rowShown, this.events).el
    );

  private actionOnItem = (item: Item, action: Action<ItemView>) => {
    const view = this.rowsShown.get(item);
    if (view) action(view);
  };
}
