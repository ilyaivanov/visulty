import { anim, dom, style } from "../src/browser";

const randomItems = (count: number): MyItem[] =>
  Array.from(new Array(count)).map(() =>
    item("Item " + Math.floor(Math.random() * 100))
  );

//DOMAIN
type MyItem = {
  id: string;
  title: string;
  isOpen?: boolean;
  children?: MyItem[];
  parent?: MyItem;
  counter: number;
};

const item = (title: string, children?: MyItem[]): MyItem => ({
  title,
  children,
  counter: 0,
  isOpen: children ? true : false,
  id: Math.random() + ` (${title})`,
});

class Store {
  root: MyItem = item("HOME", [
    item("First", randomItems(12)),
    item("Second"),
    item("Third"),
    item("Fourth"),
    item("Five"),
    item("Six", randomItems(6)),
    item("Seven"),
  ]);

  constructor(private dispatchCommand: Action<DomainCommand>) {
    this.assignParents(this.root, this.root.children!);
  }

  assignParents = (parent: MyItem, children: MyItem[]) => {
    children.forEach((child) => {
      child.parent = parent;
      if (child.children) this.assignParents(child, child.children);
    });
  };

  removeItem = (item: MyItem) => {
    const parent = item.parent;
    if (parent && parent.children)
      parent.children = parent.children.filter((sibling) => item != sibling);
  };

  increment = (item: MyItem) => {
    item.counter += 1;
    this.dispatchCommand({ type: "item-incremented", itemId: item.id });
  };

  toggleItem = (item: MyItem) => {
    item.isOpen = !item.isOpen;
    this.dispatchCommand({ type: "item-toggled", itemId: item.id });
  };
}

type DomainCommand =
  | { type: "item-removed"; itemId: string }
  | { type: "item-toggled"; itemId: string }
  | { type: "item-incremented"; itemId: string };

class CommandsDispatcher {
  private itemViews: WeakMap<Element, ItemView> = new WeakMap();

  itemViewed = (view: ItemView) => {
    if (view.el.id) {
      throw new Error(
        `CommandDispatcher expects HTML element not to have id. Check el property for ${view.item.title}`
      );
    }
    view.el.id = view.item.id;
    this.itemViews.set(view.el, view);
  };

  dispatchCommand = (command: DomainCommand) => {
    if (command.type === "item-incremented")
      this.viewAction(command.itemId, (view) => view.updateCounter());

    if (command.type === "item-toggled")
      this.viewAction(command.itemId, (view) =>
        view.updateItemChildrenVisibility(true)
      );
  };
  viewAction = (itemId: string, action: Action<ItemView>) => {
    const elem = document.getElementById(itemId);
    if (elem) {
      const view = this.itemViews.get(elem);
      if (view) action(view);
    }
  };
}

const dispatcher = new CommandsDispatcher();
const store = new Store(dispatcher.dispatchCommand);

class ItemView {
  counterElem = dom.createRef("span");
  childrenElem = dom.createRef("ol");
  chevronElem = dom.createRef("button");
  el: HTMLElement;
  constructor(public item: MyItem) {
    this.el = dom.elem("li", {}, [
      dom.elem("button", {
        textContent: ">",
        ref: this.chevronElem,
        onClick: () => store.toggleItem(item),
      }),
      dom.elem("span", { textContent: item.title }),
      dom.elem("span", { className: "counter" as any, ref: this.counterElem }),
      dom.button({ text: "+", onClick: () => store.increment(this.item) }),
      dom.button({ text: "X" }),
    ]);
    this.updateCounter(true);
    this.updateItemChildrenVisibility();
    dispatcher.itemViewed(this);
  }

  updateCounter = (ignoreAnimations?: boolean) => {
    const { elem } = this.counterElem;
    if (!ignoreAnimations) {
      elem
        .animate(
          [
            { transform: "translate(0,0)", opacity: 1 },
            { transform: "translate(0,-10px)", opacity: 0 },
          ],
          { duration: 200, easing: "ease-in" }
        )
        .addEventListener("finish", () => {
          elem.textContent = `(${this.item.counter})`;
          elem.animate(
            [
              { transform: "translate(0,10px)", opacity: 0 },
              { transform: "translate(0,0)", opacity: 1 },
            ],
            { duration: 200, easing: "ease-out" }
          );
        });
    } else {
      elem.textContent = ` (${this.item.counter})`;
    }
  };

  updateItemChildrenVisibility = (animate?: boolean) => {
    if (this.item.isOpen) this.open(animate);
    else this.close(animate);
  };

  private close = (animate?: boolean) => {
    this.chevronElem.elem.textContent = "ᐳ";
    if (animate) {
      //TODO: UGLY
      anim.collapse(this.childrenElem.elem).addEventListener("finish", () => {
        this.childrenElem.elem.remove();
        //@ts-expect-error
        this.childrenElem.elem = undefined;
      });
    } else if (this.childrenElem.elem) {
      this.childrenElem.elem.remove();
      //@ts-expect-error
      this.childrenElem.elem = undefined;
    }
  };
  private open = (animate?: boolean) => {
    this.chevronElem.elem.textContent = "ᐯ";
    this.el.appendChild(this.viewChildren());
    if (animate) anim.expand(this.childrenElem.elem);
  };

  private viewChildren = () =>
    dom.elem(
      "ol",
      { ref: this.childrenElem },
      this.item.children && this.item.children.map(ItemView.view)
    );

  static view = (item: MyItem) => new ItemView(item).el;
}
//VIEW

document.body.appendChild(
  dom.elem("ol", {}, store.root.children!.map(ItemView.view))
);

style.tag("li", {
  fontSize: 18,
});

style.tag("button", {
  border: "none",
  cursor: "pointer",
});

style.class("counter" as any, {
  display: "inline-block",
  marginLeft: 10,
  marginRight: 10,
});

style.selector("button:hover", {
  backgroundColor: "#CCCCCC",
});

style.selector("button:active", {
  backgroundColor: "#DDDDDD",
});
