import { anim, dom, style } from "../../src/browser";
import { levels, spacings } from "../../src/designSystem";
import { store, dispatcher } from "../globals";
import { ItemIcon } from "./itemIcon";

export class ItemView {
  childrenElem = dom.createRef("div");
  icon: ItemIcon;
  el: HTMLElement;
  constructor(public item: MyItem, public level: number) {
    this.icon = new ItemIcon(item, {
      onChevronClick: () => store.toggleItem(item),
    });
    this.el = dom.elem("div", {}, [
      dom.elem("div", { classNames: ["item-row", levels.rowForLevel(level)] }, [
        this.icon.el,
        dom.elem("span", {
          className: "item-row-title",
          textContent: item.title,
        }),
      ]),
    ]);
    this.updateItemChildrenVisibility();
    dispatcher.itemViewed(this);
  }

  updateItemChildrenVisibility = (animate?: boolean) => {
    if (this.item.isOpen) this.open(animate);
    else this.close(animate);
    this.icon.updateChevron();
  };

  public remove = () =>
    anim
      .flyAwayAndCollapse(this.el)
      .addEventListener("finish", () => this.el.remove());

  private close = (animate?: boolean) => {
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
    this.el.appendChild(this.viewChildren());
    if (animate) anim.expand(this.childrenElem.elem);
  };

  private viewChildren = () =>
    dom.elem(
      "div",
      { className: "item-row-children", ref: this.childrenElem },
      this.item.children &&
        this.item.children.map((item) => ItemView.view(item, this.level + 1))
    );

  private static view = (item: MyItem, level: number) =>
    new ItemView(item, level).el;

  static viewChildrenFor = (item: MyItem) =>
    dom.fragment(
      item.children ? item.children.map((item) => ItemView.view(item, 0)) : []
    );
}

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
