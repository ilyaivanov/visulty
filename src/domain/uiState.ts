export class UIState {
  isSearchVisible = false;

  theme: AppTheme = "light";

  mainTabItemSelected?: MyItem;
  searchTabItemSelected?: MyItem;

  constructor(private dispatchCommand: Action<DomainCommand>) {}

  toggleSearchVisibility = () => {
    this.isSearchVisible = !this.isSearchVisible;
    this.dispatchCommand({ type: "search-visibility-toggled" });
  };

  toggleTheme = () => {
    this.theme = this.theme === "dark" ? "light" : "dark";
    this.dispatchCommand({ type: "theme-changed" });
  };

  select = (item: MyItem) => {
    if (this.mainTabItemSelected)
      this.dispatchCommand({
        type: "item-unselected",
        item: this.mainTabItemSelected,
      });
    this.mainTabItemSelected = item;
    this.dispatchCommand({ type: "item-selected", item });
  };

  private getRoot = (item: MyItem): MyItem => {
    let parent = item;
    while (parent.parent) {
      parent = parent.parent;
    }
    return parent;
  };
}
