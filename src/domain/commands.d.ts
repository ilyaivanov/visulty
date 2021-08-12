type DomainCommand =
  | { type: "theme-changed" }
  | { type: "item-removed"; itemId: string; instant?: boolean }
  | { type: "item-toggled"; itemId: string }
  | { type: "item-toggled-in-sidebar"; item: MyItem }
  | { type: "item-loaded"; itemId: string }
  | { type: "item-added"; item: MyItem; instant?: boolean }
  | { type: "item-selected"; item: MyItem }
  | { type: "item-focused"; item: MyItem }
  | { type: "item-unselected"; item: MyItem }
  | { type: "right-sidebar-visibility-changed" }
  | { type: "left-sidebar-visibility-changed" }
  | { type: "search-input-focus" }
  | { type: "search-input-blur" }
  | { type: "show-quick-find-modal" }
  | { type: "searching-start" }
  | { type: "searching-end" }
  | { type: "searching-local-end"; results: LocalSearchResults }
  | { type: "search-visibility-toggled" };
