import { Item } from "./items/item";
import { MyEventSource } from "./lodash";

export type ItemEventDefinitions = {
  stateLoaded: Item;

  itemPlay: Item;

  itemToggled: Item;
  toggleSidebar: void;

  themeToggled: AppTheme;
  toggleTheme: void;

  toggleRightSidebar: void;
  rightSidebarToggled: void;

  focusItem: Item;

  saveState: void;

  "search.toggleVisibilty": void;

  "item.added": { item: Item; playAnimation: boolean };
  "item.removed": { item: Item; playAnimation: boolean };

  //dnd
  "item.mouseDownOnIcon": { item: Item; event: MouseEvent };
  "item.mouseMoveOverItem": { item: Item; event: MouseEvent };

  "item.loadChildren": Item;
  "item.childrenLoaded": Item;

  "item.loadChildrenNextPage": Item;
  "item.childrenNextPageLoaded": { item: Item; page: Item[] };

  "item.rightSidebarVisibilityChanged": Item;
};

export type AppEvents = MyEventSource<ItemEventDefinitions>;

export const createAppEvents = () => new MyEventSource<ItemEventDefinitions>();
