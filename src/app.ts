import { button, dom, span } from "./browser";
import { createTitleHighlightsFromFoundTerms } from "./search/localSearch";
import { viewApp } from "./view/app";

const ul = (children: HTMLElement[], ref?: dom.MyRef<HTMLUListElement>) =>
  dom.elem("ul", { ref }, children);

const li = (children?: HTMLElement[]) => dom.elem("li", {}, children);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

export class Item {
  parent?: Item;
  children?: Item[];
  constructor(private props: MyItem, private events: AppEvents) {
    if (props.children)
      this.children = props.children.map((child) => new Item(child, events));
    this.children?.forEach((child) => (child.parent = this));
  }
  get title() {
    return this.props.title;
  }
  get id() {
    return this.props.id;
  }
  get isOpen() {
    return this.props.isOpen;
  }

  remove() {
    const { parent } = this;
    if (parent) {
      parent.children =
        parent.children && parent.children.filter((child) => child != this);
      this.events.trigger("itemRemoved", {
        item: this,
        isInstant: true,
      });
    }
  }
  removeWithoutAnimation() {
    const { parent } = this;
    if (parent) {
      parent.children =
        parent.children && parent.children.filter((child) => child != this);
      this.events.trigger("itemRemoved", {
        item: this,
        isInstant: false,
      });
    }
  }

  toggleVisibility() {
    //sending message from here
    this.props.isOpen = !this.props.isOpen;
    this.events.trigger("itemToggled", this);
  }
}

//I want
// 1. Item to be independent of any views
// 2. No global dependencies (injected at runtime at composition root (page))
// 3. Try to use EventTarget and dispatch events from items
// 4. Events should have custom props

class ItemsTree {
  private rowsShown: WeakMap<Item, ItemRowView> = new WeakMap();

  constructor(private events: AppEvents) {
    events.on("itemRemoved", ({ item, isInstant }) =>
      this.actionOnItem(item, (view) => view.remove(isInstant))
    );
    events.on("itemToggled", (item) =>
      this.actionOnItem(item, (view) => view.onVisibilityChanged())
    );
  }

  public rowShown = (row: ItemRowView) => {
    this.rowsShown.set(row.item, row);
  };

  viewChildrenFor = (item: Item): Node | undefined =>
    item.children &&
    ul(item.children.map((item) => new ItemRowView(item, this.rowShown).el));

  private actionOnItem = (item: Item, action: Action<ItemRowView>) => {
    const view = this.rowsShown.get(item);
    if (view) action(view);
  };
}

class ItemRowView {
  el: HTMLElement;
  children = dom.createRef("ul");
  constructor(public item: Item, private onShown: Action<ItemRowView>) {
    this.el = li([
      button({ textContent: "-", onClick: () => item.toggleVisibility() }),
      span({ textContent: item.title }),
      button({
        textContent: "X",
        onClick: () => item.remove(),
      }),
      button({
        textContent: "x",
        onClick: () => item.removeWithoutAnimation(),
      }),
      ...this.viewChildren(),
    ]);
    onShown(this);
  }

  onVisibilityChanged = () => {
    if (this.item.isOpen) dom.appendChildren(this.el, this.viewChildren());
    else this.children.elem.remove();
  };

  remove(isInstant: boolean) {
    console.log(isInstant);
    if (isInstant) this.el.remove();
    else
      this.el
        .animate(
          [
            { transform: "translate3d(0,0,0)", opacity: 1 },
            { transform: "translate3d(-20px,0,0)", opacity: 0 },
          ],
          { duration: 200 }
        )
        .addEventListener("finish", () => {
          this.el.remove();
        });
  }

  public viewChildren = () =>
    this.item.children && this.item.isOpen
      ? [
          ul(
            this.item.children.map(
              (item) => new ItemRowView(item, this.onShown).el
            ),
            this.children
          ),
        ]
      : [];
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

export class App {
  root?: Item;

  appEvents = new AppEvents();
  mainTree = new ItemsTree(this.appEvents);

  constructor(private parent: HTMLElement) {}

  init() {}

  renderInto(container: Element, root: MyItem) {
    this.root = new Item(root, this.appEvents);
    const tree = this.mainTree.viewChildrenFor(this.root);
    tree && dom.appendChild(container, tree);
  }

  rootItemLoaded = (item: Item) => {
    this.root = item;
  };
}

type ItemEventDefinitions = {
  itemRemoved: { item: Item; isInstant: boolean };
  itemToggled: Item;
  emptyEvent: undefined;
};
class AppEvents {
  private itemCbs: Partial<Record<keyof ItemEventDefinitions, Action<Item>[]>> =
    {};

  on = <T extends keyof ItemEventDefinitions>(
    event: T,
    cb: Action<ItemEventDefinitions[T]>
  ) => {
    if (!this.itemCbs[event]) this.itemCbs[event] = [];
    this.itemCbs[event]!.push(cb as any);
  };

  trigger = <T extends keyof ItemEventDefinitions>(
    event: T,
    data: ItemEventDefinitions[T]
  ) => {
    const cbs = this.itemCbs[event] || [];
    cbs!.forEach((cb) => (cb as any)(data));
  };
}
