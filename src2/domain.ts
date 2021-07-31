const randomItems = (count: number): MyItem[] =>
  Array.from(new Array(count)).map(() =>
    item("Item " + Math.floor(Math.random() * 100))
  );

//DOMAIN

const item = (props: string | Partial<MyItem>, children?: MyItem[]): MyItem => {
  const title = typeof props === "object" ? props.title || "" : props;
  return Object.assign(
    {
      title,
      children,
      isOpen: children ? true : false,
      id: Math.random() + ` (${title})`,
    },
    props || {}
  );
};

export class Store {
  root: MyItem = item("HOME", [
    item({ title: "First", isOpen: false }, randomItems(12)),
    item({ title: "Second", isLoading: true, isOpen: true }),
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
    if (parent && parent.children) {
      parent.children = parent.children.filter((sibling) => item != sibling);
      this.dispatchCommand({ type: "item-removed", itemId: item.id });
    }
  };

  toggleItem = (item: MyItem) => {
    item.isOpen = !item.isOpen;
    if (item.isOpen && !item.children) {
      item.isLoading = true;
      setTimeout(() => {
        item.children = randomItems(10);
        item.isLoading = false;
        this.dispatchCommand({ type: "item-loaded", itemId: item.id });
      }, 2000);
    }
    this.dispatchCommand({ type: "item-toggled", itemId: item.id });
  };
}

export type DomainCommand =
  | { type: "item-removed"; itemId: string }
  | { type: "item-toggled"; itemId: string }
  | { type: "item-loaded"; itemId: string };
