import { button, div, dom, span } from "./browser";
import { AppEvents } from "./events";
import { Item } from "./items/item";
import { ItemsTree } from "./tree";

export class App {
  root?: Item;

  appEvents = new AppEvents();
  mainTree = new ItemsTree(this.appEvents);

  constructor(private parent: HTMLElement) {}

  renderInto(container: Element, root: MyItem) {
    this.root = new Item(root, this.appEvents);
    const tree = div(
      { classNames: ["app", "app-light"] },
      this.mainTree.viewChildrenFor(this.root)
    );
    tree && dom.appendChild(container, tree);
  }

  rootItemLoaded = (item: Item) => {
    this.root = item;
  };
}
