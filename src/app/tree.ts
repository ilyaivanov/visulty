import { dom, anim } from "../browser";
import { itemsStore } from "./stores";

const viewItem = (item: Item): HTMLElement => {
  const li = dom.li({
    children: [
      dom.span({
        text: item.title,
        onClick: () => itemsStore.toggleItem(item),
      }),
    ].concat(item.isOpen && item.children ? viewChildren(item.children) : []),
  });

  itemsStore.itemReaction(
    item,
    () => item.isOpen,
    () => {
      if (item.isOpen && item.children) {
        const children = viewChildren(item.children);
        li.appendChild(children);
        anim.expand(children);
      } else {
        const children = li.childNodes.item(1) as HTMLElement;
        if (children)
          anim
            .collapse(children)
            .addEventListener("finish", () => children.remove());
      }
    }
  );
  return li;
};

const viewChildren = (items: Item[]): HTMLElement => {
  return dom.ul({ children: items.map(viewItem) });
};

export const viewTree = () => viewChildren(itemsStore.root.children!);
