import { AppEvents } from "../../events";
import { Item } from "../../items";
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
    events.on("item.added", ({ item, playAnimation }) => {
      const parent = item.parent!;
      const context = parent.children!;
      const index = context.indexOf(item);
      if (!parent.parent && index === 0) {
        this.actionOnItem(context[index + 1], (view) =>
          view.insertItemBefore(item)
        );
      } else if (index == 0) {
        this.actionOnItem(parent, (view) => view.insertItemAsFirstChild(item));
      } else {
        const prevItem = context[index - 1];
        this.actionOnItem(prevItem, (view) => view.insertItemAfter(item));
      }
    });

    events.on("item.removed", ({ item, playAnimation }) =>
      this.actionOnItem(item, (view) => view.remove({ playAnimation }))
    );
    events.on("item.isOpenInGalleryChanged", (item) =>
      this.actionOnItem(item, (view) => view.updateItemChildrenVisibility(true))
    );

    events.on("item.childrenLoaded", (item) =>
      this.actionOnItem(item, (view) =>
        view.updateItemChildrenVisibility(false)
      )
    );

    //TODO: all children are being rerendered now. Improve this by appending items
    events.on("item.childrenNextPageLoaded", ({ item, page }) =>
      this.actionOnItem(item, (view) =>
        view.updateItemChildrenVisibility(false)
      )
    );
  }

  public rowShown = (row: ItemView) => {
    this.rowsShown.set(row.item, row);
  };

  viewChildrenFor = (item: Item): Node => {
    console.log(item.title, item);
    return ItemView.viewChildrenFor(item, this.rowShown, this.events);
  };

  private actionOnItem = (item: Item, action: Action<ItemView>) => {
    const view = this.rowsShown.get(item);
    if (view) action(view);
  };
}
