import { itemsStore } from "../globals";
import * as items from "./itemQueries";

type TabName = "main" | "search";

export class UIState {
  isSearchVisible = false;

  theme: AppTheme = "light";

  tabFocused: TabName = "main" as TabName;
  mainTabItemSelected?: MyItem;
  searchTabItemSelected?: MyItem;

  constructor(private dispatchCommand: Action<DomainCommand>) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "2" && e.ctrlKey) {
        e.preventDefault();
        this.focusOnTab("search");
      }
      if (e.key === "1" && e.ctrlKey) {
        e.preventDefault();
        this.focusOnTab("main");
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const currentlySelected = this.getCurrentlySelectedItem();
        if (currentlySelected) {
          const itemBelow = items.getItemBelow(currentlySelected);
          if (itemBelow) this.select(itemBelow);
        }
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const currentlySelected = this.getCurrentlySelectedItem();
        if (currentlySelected) {
          const itemBelow = items.getItemAbove(currentlySelected);
          if (itemBelow) this.select(itemBelow);
        }
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const currentlySelected = this.getCurrentlySelectedItem();
        if (currentlySelected) {
          if (!currentlySelected.isOpen && currentlySelected.children) {
            itemsStore.toggleItem(currentlySelected);
          } else {
            const firstChild = items.getFirstChild(currentlySelected);
            if (firstChild) this.select(firstChild);
          }
        }
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const currentlySelected = this.getCurrentlySelectedItem();
        if (currentlySelected) {
          if (currentlySelected.isOpen) {
            itemsStore.toggleItem(currentlySelected);
          } else {
            const parent = currentlySelected.parent;
            if (parent && !items.isRoot(parent)) this.select(parent);
          }
        }
      }
    });
  }

  getCurrentlySelectedItem = () => {
    if (this.tabFocused === "main") return this.mainTabItemSelected;
    if (this.tabFocused === "search") return this.searchTabItemSelected;
  };

  toggleSearchVisibility = () => {
    this.isSearchVisible = !this.isSearchVisible;
    this.dispatchCommand({ type: "search-visibility-toggled" });
  };

  toggleTheme = () => {
    this.theme = this.theme === "dark" ? "light" : "dark";
    this.dispatchCommand({ type: "theme-changed" });
  };

  select = (item: MyItem) => {
    const root = items.getRoot(item);
    const targetTabName: TabName = root.id === "SEARCH" ? "search" : "main";

    //unselecting currently selected
    if (this.tabFocused === "main" && this.mainTabItemSelected)
      this.unSelectCommand(this.mainTabItemSelected);
    if (this.tabFocused === "search" && this.searchTabItemSelected)
      this.unSelectCommand(this.searchTabItemSelected);

    this.tabFocused = targetTabName;

    if (this.tabFocused === "main") {
      this.mainTabItemSelected = item;
    } else if (this.tabFocused === "search") {
      this.searchTabItemSelected = item;
    }
    this.selectCommand(item);
  };

  focusOnTab = (tabName: TabName) => {
    if (tabName === "main" && this.mainTabItemSelected) {
      this.select(this.mainTabItemSelected);
    } else if (tabName === "search" && this.searchTabItemSelected)
      this.select(this.searchTabItemSelected);
  };

  private unSelectCommand = (item: MyItem) =>
    this.dispatchCommand({ type: "item-unselected", item });

  private selectCommand = (item: MyItem) =>
    this.dispatchCommand({ type: "item-selected", item });
}
