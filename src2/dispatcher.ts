import { DomainCommand } from "./domain";
import { ItemView } from "./view/itemView";

export class CommandsDispatcher {
  private itemViews: WeakMap<Element, ItemView> = new WeakMap();

  itemViewed = (view: ItemView) => {
    if (view.el.id) {
      throw new Error(
        `CommandDispatcher expects HTML element not to have id. Check el property for ${view.item.title}`
      );
    }
    view.el.id = view.item.id;
    this.itemViews.set(view.el, view);
  };

  dispatchCommand = (command: DomainCommand) => {
    if (command.type === "item-toggled")
      this.viewAction(command.itemId, (view) =>
        view.updateItemChildrenVisibility(true)
      );
    if (command.type === "item-removed")
      this.viewAction(command.itemId, (view) => view.remove());

    if (command.type === "item-loaded")
      this.viewAction(command.itemId, (view) =>
        view.updateItemChildrenVisibility()
      );
  };
  viewAction = (itemId: string, action: Action<ItemView>) => {
    const elem = document.getElementById(itemId);
    if (elem) {
      const view = this.itemViews.get(elem);
      if (view) action(view);
    }
  };
}
