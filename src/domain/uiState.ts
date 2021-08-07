import * as items from "./itemQueries";
import { ItemsStore } from "./itemsStore";

type TabName = "main" | "search";

export class UIState {
  isSearchVisible = false;
  isModalShown = false;

  theme: AppTheme = "light";

  tabFocused: TabName = "main" as TabName;
  mainTabItemSelected?: MyItem;
  searchTabItemSelected?: MyItem;

  mainTabItemFocused?: MyItem;

  constructor(
    private dispatchCommand: Action<DomainCommand>,
    private itemsStore: ItemsStore
  ) {}

  moveSelectionDown = () => {
    const currentlySelected = this.getCurrentlySelectedItem();
    if (currentlySelected) {
      const itemBelow = items.getItemBelow(currentlySelected);
      if (itemBelow) this.select(itemBelow);
    } else if (this.tabFocused === "search" && !currentlySelected) {
      this.select(this.itemsStore.searchRoot.children![0]);
      this.blurOnSearchInput();
    }
  };

  moveSelectionUp = () => {
    const currentlySelected = this.getCurrentlySelectedItem();
    if (currentlySelected) {
      const itemAbove = items.getItemAbove(currentlySelected);
      if (itemAbove) this.select(itemAbove);
      else if (this.tabFocused === "search") {
        this.unSelectCommand(currentlySelected);
        this.searchTabItemSelected = undefined;
        this.focusOnSearchInput();
      }
    }
  };

  moveSelectionLeft = () => {
    const currentlySelected = this.getCurrentlySelectedItem();
    if (currentlySelected) {
      if (currentlySelected.isOpen) {
        this.itemsStore.toggleItem(currentlySelected);
      } else {
        const parent = currentlySelected.parent;
        if (parent && !items.isRoot(parent)) this.select(parent);
      }
    }
  };

  moveSelectionRight = () => {
    const currentlySelected = this.getCurrentlySelectedItem();
    if (currentlySelected) {
      if (!currentlySelected.isOpen && currentlySelected.children) {
        this.itemsStore.toggleItem(currentlySelected);
      } else {
        const firstChild = items.getFirstChild(currentlySelected);
        if (firstChild) this.select(firstChild);
      }
    }
  };

  getCurrentlySelectedItem = (): MyItem | undefined => {
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
      if (!this.searchTabItemSelected) this.blurOnSearchInput();
    } else if (tabName === "search") {
      if (!this.isSearchVisible) this.toggleSearchVisibility();

      if (this.mainTabItemSelected)
        this.unSelectCommand(this.mainTabItemSelected);
      if (this.searchTabItemSelected) {
        this.select(this.searchTabItemSelected);
      } else {
        this.tabFocused = "search";
        this.focusOnSearchInput();
      }
    }
  };

  focusOnItem = (item: MyItem) => {
    this.mainTabItemFocused = item;
    this.dispatchCommand({
      type: "item-focused",
      item,
    });
  };

  showQuickFindModal = () => {
    this.isModalShown = true;
    this.dispatchCommand({ type: "show-quick-find-modal" });
  };

  private unSelectCommand = (item: MyItem) =>
    this.dispatchCommand({ type: "item-unselected", item });

  private selectCommand = (item: MyItem) =>
    this.dispatchCommand({ type: "item-selected", item });

  private focusOnSearchInput = () =>
    this.dispatchCommand({ type: "search-input-focus" });
  private blurOnSearchInput = () =>
    this.dispatchCommand({ type: "search-input-blur" });
}
