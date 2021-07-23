import { div, span, anim, style, dom } from "../browser";
import { spacings, levels } from "../designSystem";
import { Item } from "../domain/item";
import { viewItemIcon } from "./itemIcon";
import { itemsStore } from "./stores";

const viewItem = (item: Item, level: number): HTMLElement => {
  const row = div(
    { classNames: ["item-row", levels.rowForLevel(level)] },
    viewItemIcon(item, { onChevronClick: () => itemsStore.toggleItem(item) }),
    span({
      className: "item-row-title",
      classMap: { "item-container-row-title": item.isContainer },
      text: item.title,
    })
  );
  const childrenArea = div(
    { className: "item-row-children" },
    ...viewChildren(item, level + 1)
  );

  //TODO: this is probably better to handle via state machines
  itemsStore.itemReaction(
    item,
    () => ({ isOpen: item.isOpen, isLoading: item.isLoading }),
    ({ isOpen, isLoading }) => {
      if (isOpen && item.children) {
        dom.setChildren(childrenArea, viewChildren(item, level + 1));
        if (!childrenArea.isConnected) container.appendChild(childrenArea);
        anim.expand(childrenArea);
      } else if (isOpen && isLoading) {
        dom.setChild(
          childrenArea,
          dom.div({ text: "Loading...", className: levels.rowForLevel(level) })
        );
        if (!childrenArea.isConnected) container.appendChild(childrenArea);
        anim.expand(childrenArea);
      } else {
        anim
          .collapse(childrenArea)
          .addEventListener("finish", () => childrenArea.remove());
      }
    }
  );
  const container = div({}, row, item.isOpen && item.children && childrenArea);
  return container;
};

const viewChildren = (item: Item, level: number): HTMLElement[] =>
  item.children
    ? item.children
        .map((item) => viewItem(item, level))
        .concat(level != 0 ? childrenBorder(level - 1) : [])
    : [];

const childrenBorder = (level: number) =>
  div({
    classNames: ["item-children-border", levels.childrenBorderForLevel(level)],
  });

export const viewTree = (item: Item): Node =>
  dom.fragment(item.children!.map((child) => viewItem(child, 0)));

style.class("item-row", {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  color: "#DDDDDD",
  paddingTop: spacings.rowVecticalPadding,
  paddingBottom: spacings.rowVecticalPadding,
  onHover: {
    backgroundColor: "rgb(42,45,46)",
  },
});

style.class2("item-row", "item-row_selected", {
  backgroundColor: "#37373D",
});
style.class("item-row-title", {
  marginBottom: 2,
});

style.class("item-container-row-title", { fontWeight: "bold" });

style.class("item-row-children", {
  overflow: "hidden",
  position: "relative",
});
style.class("item-children-border", {
  position: "absolute",
  width: 2,
  top: 0,
  bottom: 0,
  backgroundColor: "#4C5155",
});

style.class("item-titleInput", { width: "100%" });
