const randomItems = (count: number): MyItem[] =>
  Array.from(new Array(count)).map(() =>
    item("Item " + Math.floor(Math.random() * 100))
  );

//DOMAIN

const item = (title: string, children?: MyItem[]): MyItem => ({
  title,
  children,
  counter: 0,
  isOpen: children ? true : false,
  id: Math.random() + ` (${title})`,
});

export class Store {
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

export type DomainCommand =
  | { type: "item-removed"; itemId: string }
  | { type: "item-toggled"; itemId: string }
  | { type: "item-incremented"; itemId: string };
