import { DomainCommand } from "./domain";
import { AppView } from "./view/app";
import { Header } from "./view/header";
import { ItemView } from "./view/itemView";
import { SearchTab } from "./view/searchTab";

export class CommandsDispatcher {
  private itemViews: WeakMap<Element, ItemView> = new WeakMap();
  public searchTab?: SearchTab;
  public header?: Header;
  public appView?: AppView;
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
      this.viewAction(command.itemId, (view) => view.remove(command.instant));

    if (command.type === "item-loaded")
      this.viewAction(command.itemId, (view) =>
        view.updateItemChildrenVisibility()
      );
    if (command.type === "item-added") {
      const parent = command.item.parent!;
      const context = parent.children!;
      const index = context.indexOf(command.item);
      if (!parent.parent && index === 0) {
        this.viewAction(context[index + 1]!.id, (view) =>
          view.insertItemBefore(command.item)
        );
      } else if (index == 0) {
        this.viewAction(parent.id, (view) =>
          view.insertItemAsFirstChild(command.item)
        );
      } else {
        const prevItem = context[index - 1];
        this.viewAction(prevItem.id, (view) =>
          view.insertItemAfter(command.item)
        );
      }
      this.viewAction(parent.id, (view) => view.updateIcons());
    }
    if (command.type === "search-visibility-toggled")
      this.searchTab?.onSearchVisibilityChange();
    if (command.type === "searching-start") this.searchTab?.startSearching();
    if (command.type === "searching-end") this.searchTab?.stopSearching();
    if (command.type === "theme-changed") {
      this.header?.assignThemeButtonText();
      this.appView?.assignTheme();
    }
  };

  viewAction = (itemId: string, action: Action<ItemView>) => {
    const elem = document.getElementById(itemId);
    if (elem) {
      const view = this.itemViews.get(elem);
      if (view) action(view);
    }
  };
}
