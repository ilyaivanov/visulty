type Action<TIn> = (arg: TIn) => void;
type Func1<TIn, TOut> = (arg: TIn) => TOut;

//TODO: this screams for BEM. I need to consider using BEM to organize my classes

type ClassName =
  | "app"
  | "tab"
  | "main-tab"
  | "search-tab"
  | "search-tab_hidden"
  | "search-tab-input"
  | "item-title"
  | "item-titleInput"
  | "item-done"
  | "item-row"
  | "item-row-title"
  | "item-row-container"
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
  | "item-children"
  //DND
  | "item-dragAvatar"
  | "item-dragDestinationLine"
  | "item-dragDestinationBulp"

  //
  | "player";

type ElementId = string;

type Item = {
  id: string;
  title: string;
  children?: Item[];
  isOpen?: boolean;
};
