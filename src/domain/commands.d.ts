type DomainCommand =
  | { type: "theme-changed" }
  | { type: "item-removed"; itemId: string; instant?: boolean }
  | { type: "item-toggled"; itemId: string }
  | { type: "item-loaded"; itemId: string }
  | { type: "item-added"; item: MyItem; instant?: boolean }
  | { type: "item-selected"; item: MyItem }
  | { type: "item-unselected"; item: MyItem }
  | { type: "searching-start" }
  | { type: "searching-end" }
  | { type: "search-visibility-toggled" };
