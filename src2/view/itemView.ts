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
    if (this.item.isOpen) this.open(false);
    else this.close(false);
    dispatcher.itemViewed(this);
  }

  updateItemChildrenVisibility = (animate?: boolean) => {
    if (this.item.isOpen) this.open(animate);
    else this.close(animate);
    this.icon.onVisibilityChange();
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
    if (this.childrenElem.elem) {
      this.childrenElem.elem.remove();
      //@ts-expect-error
      this.childrenElem.elem = undefined;
    }
    this.el.appendChild(this.viewChildren());
    if (animate) anim.expand(this.childrenElem.elem);
  };

  private viewChildren = () =>
    dom.elem(
      "div",
      { className: "item-row-children", ref: this.childrenElem },
      this.item.isLoading
        ? Array.from(new Array(10))
            .map((_, index) => itemSkeleton(index, this.level + 1))
            .concat(childrenBorder(this.level))
        : this.item.children &&
            this.item.children
              .map((item) => ItemView.view(item, this.level + 1))
              .concat(childrenBorder(this.level))
    );

  private static view = (item: MyItem, level: number) =>
    new ItemView(item, level).el;

  static viewChildrenFor = (item: MyItem) =>
    dom.fragment(
      item.children ? item.children.map((item) => ItemView.view(item, 0)) : []
    );
}
const childrenBorder = (level: number) =>
  dom.elem("div", {
    classNames: ["item-children-border", levels.childrenBorderForLevel(level)],
  });
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

//SKELETON

const itemSkeleton = (index: number, level: number) => {
  const elem = dom.elem(
    "div",
    {
      classNames: ["avatar-row" as any, levels.rowForLevel(level)],
    },
    [
      dom.elem("div", {
        className: "avatar" as any,
        style: { animationDelay: 100 * index + "ms" },
      }),
      dom.elem("div", {
        className: "text-avatar" as any,
        style: { animationDelay: 100 * index + "ms" },
      }),
    ]
  );
  return elem;
};

const time = 1500;
style.text(`
@keyframes opacity {
  0%{
    background-color: #4E505A;
    }
  20%{
      background-color: #8D8F95;
  }
  80%, 100% {
      background-color: #4E505A;
  }
}
`);

style.class("avatar-row" as any, {
  height: 32,
  paddingTop: 4,
  paddingBottom: 4,
  display: "flex",
  alignItems: "center",
});

style.class("avatar" as any, {
  marginLeft: spacings.chevronSize,
  borderRadius: 4,
  width: 32,
  height: 32,
  backgroundColor: "#4E505A",
  animation: `opacity ${time}ms infinite linear`,
});

style.class("text-avatar" as any, {
  height: 16,
  width: 300,
  marginLeft: 10,
  borderRadius: 4,
  backgroundColor: "#4E505A",
  animation: `opacity ${time}ms infinite linear`,
});
