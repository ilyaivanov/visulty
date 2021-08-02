import { DomainCommand } from "./domain";
import { ItemView } from "./view/itemView";
import { SearchTab } from "./view/searchTab";

export class CommandsDispatcher {
  private itemViews: WeakMap<Element, ItemView> = new WeakMap();
  public searchTab?: SearchTab;
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
    console.log(command);
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
    if (command.type === "search-visibility-toggled")
      this.searchTab?.onSearchVisibilityChange();
    if (command.type === "searching-start") this.searchTab?.startSearching();
    if (command.type === "searching-end") this.searchTab?.stopSearching();
  };
  viewAction = (itemId: string, action: Action<ItemView>) => {
    const elem = document.getElementById(itemId);
    if (elem) {
      const view = this.itemViews.get(elem);
      if (view) action(view);
    }
  };
}
