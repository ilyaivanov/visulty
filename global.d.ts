type Action<TIn> = (arg: TIn) => void;
type Func1<TIn, TOut> = (arg: TIn) => TOut;

//TODO: this screams for BEM. I need to consider using BEM to organize my classes

type ClassName =
  | "app"
  | "app-light"
  | "app-dark"
  | "header"
  | "player"
  | "gallery"
  | "tab"
  | "main-tab"
  | "search-tab"
  | "search-tab_hidden"
  | "item-title"
  | "item-titleInput"
  | "item-row"
  | "item-row-title"
  | "item-container-row-title"
  | "item-row_selected"
  | "item-children-border"
  | "item-row-children"
  | "item-icon-svg"
  | "item-icon-circle"
  | "item-icon-chevron"
  | "item-icon-chevron_open"
  | "item-icon-chevron_visible"
  | "item-icon-chevron_active"
  | "item-icon-circle_hidden"
  | "item-icon-image_square"
  | "item-icon-image_circle"
  | "item-icon-video"
  | "item-icon-image_closed"
  //DND
  | "item-dragAvatar"
  | "item-dragDestinationLine"
  | "item-dragDestinationBulp";

type ElementId = string;

type AppTheme = "dark" | "light";
type DropPlacement = "after" | "before" | "inside";
