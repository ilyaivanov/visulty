export class UIState {
  isSearchVisible = false;

  theme: AppTheme = "light";

  constructor(private dispatchCommand: Action<DomainCommand>) {}

  toggleSearchVisibility = () => {
    this.isSearchVisible = !this.isSearchVisible;
    this.dispatchCommand({ type: "search-visibility-toggled" });
  };

  toggleTheme = () => {
    this.theme = this.theme === "dark" ? "light" : "dark";
    this.dispatchCommand({ type: "theme-changed" });
  };
}
