import { anim, dom, style } from "../../src/browser";
import { levels, spacings } from "../../src/designSystem";
import { colorsVars } from "../designSystem/colorVars";
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
          classMap: { "item-container-row-title": store.isContainer(item) },
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
  color: colorsVars.mainTextColor,
  paddingTop: spacings.rowVecticalPadding,
  paddingBottom: spacings.rowVecticalPadding,
  fontSize: 15,
  lineHeight: 1,
  onHover: {
    backgroundColor: colorsVars.itemHover,
  },
});

style.class2("item-row", "item-row_selected", {
  backgroundColor: "#37373D",
});

style.class("item-container-row-title", {
  fontWeight: "bold",
  fontSize: 16,
});

style.class("item-row-children", {
  overflow: "hidden",
  position: "relative",
});

style.class("item-children-border", {
  position: "absolute",
  width: 2,
  top: 0,
  bottom: 0,
  backgroundColor: colorsVars.itemChildrenLine,
});

style.class("item-titleInput", { width: "100%" });

//SKELETON

export const showSkeletons = (count: number, level = 0) =>
  Array.from(new Array(count)).map((_, index) => itemSkeleton(index, level));

export const itemSkeleton = (index: number, level: number) => {
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
    background-color: ${colorsVars.itemSkeletonBackground};
    }
  20%{
      background-color: ${colorsVars.itemSkeletonGradientCenter};
  }
  80%, 100% {
      background-color: ${colorsVars.itemSkeletonBackground};
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
  minWidth: 32,
  width: 32,
  height: 32,
  backgroundColor: colorsVars.itemSkeletonBackground,
  animation: `opacity ${time}ms infinite linear`,
});

style.class("text-avatar" as any, {
  height: 16,
  width: 300,
  marginLeft: 10,
  borderRadius: 4,
  backgroundColor: colorsVars.itemSkeletonBackground,
  animation: `opacity ${time}ms infinite linear`,
});
