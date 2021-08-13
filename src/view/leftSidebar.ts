import { css, div, dom, span, style, svg } from "../browser";
import { ClassMap } from "../browser/dom";
import { anim, colors, icons, timings, zIndexes } from "../designSystem";
import { dispatcher, itemsStore, uiState } from "../globals";

export class LeftSidebar {
  el: HTMLElement;

  constructor() {
    this.el = div({ className: "left-sidebar" }, this.viewChildren());
    this.assignVisibility();
    dispatcher.leftSidebar = this;
  }

  render() {
    dom.setChildren(this.el, this.viewChildren());
  }

  assignVisibility = () =>
    dom.toggleClass(
      this.el,
      "left-sidebar-hidden",
      !uiState.isLeftSidebarVisible
    );

  viewChildren = () =>
    itemsStore.root.children!.map((item) => LeaftSidebarItem.view(item, 0));
}

export class LeaftSidebarItem {
  el: HTMLDivElement;
  childrenElement = dom.createRef("div");
  chevron: SVGElement;
  constructor(public item: MyItem, private level: number) {
    this.chevron = icons.chevron({
      className: "left-sidebar-item-chevron",
      classMap: this.chevronClasses(),
      onClick: (e) => {
        e.stopPropagation();
        itemsStore.toggleItemOnSidebar(item);
      },
    });
    this.el = div({}, [
      div(
        {
          className: "left-sidebar-item",
          style: { paddingLeft: 4 + level * 15 },
          onClickStopPropagation: () => uiState.focusOnItem(item),
        },
        [
          this.chevron,
          svg.svg({
            className: "left-sidebar-item-circle",
            viewBox: `0 0 ${CIRCLE_RADIUS * 2} ${CIRCLE_RADIUS * 2}`,
            children: [
              svg.circle({
                cx: CIRCLE_RADIUS,
                cy: CIRCLE_RADIUS,
                r: CIRCLE_RADIUS,
                fill: colors.itemChevron,
              }),
            ],
          }),
          span({ textContent: item.title }),
        ]
      ),
      div(
        { ref: this.childrenElement, className: "left-sidebar-item-children" },
        item.isOpenInSidebar ? this.childrenFor(item, level) : []
      ),
    ]);

    dispatcher.leftSidebarItemViewed(this);
  }

  updateItemChildrenVisibility = () => {
    dom.assignClassMap(this.chevron, this.chevronClasses());
    if (this.item.isOpenInSidebar) {
      dom.setChildren(
        this.childrenElement.elem,
        this.childrenFor(this.item, this.level)
      );
      anim.expand(this.childrenElement.elem);
    } else {
      anim
        .collapse(this.childrenElement.elem)
        .addEventListener("finish", () =>
          dom.removeAllChildren(this.childrenElement.elem)
        );
    }
  };

  static view = (item: MyItem, level: number) =>
    new LeaftSidebarItem(item, level).el;

  childrenFor = (item: MyItem, level: number): HTMLDivElement[] => {
    return item.children
      ? item.children.map((item) => LeaftSidebarItem.view(item, level + 1))
      : [];
  };

  chevronClasses = (): ClassMap => ({
    "left-sidebar-item-chevron-rotated": this.item.isOpenInSidebar,
  });
}

style.class("left-sidebar", {
  gridArea: "sidebar",
  backgroundColor: colors.leftSidebar,
  boxShadow: "rgb(0 0 0 / 20%) 2px 0px 2px",
  overflowX: "hidden",
  overflowY: "overlay",
  paddingTop: 10,
  paddingBottom: 10,
  width: 250,
  transition: css.transition({ width: timings.sidebarCollapse }),
  zIndex: zIndexes.leftSidebar,
});

style.class("left-sidebar-hidden", { width: 0 });

style.class("left-sidebar-item", {
  whiteSpace: "nowrap",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0px 10px",
  cursor: "pointer",
  color: colors.mainTextColor,
  fontSize: 15,
});

style.classHover("left-sidebar-item", {
  backgroundColor: colors.headerMenuHover,
});

style.class("left-sidebar-item-chevron", {
  width: 13,
  minWidth: 13,
  height: 13,
  marginLeft: 6,
  transition: css.transition({
    opacity: { duration: 400, easing: "ease-out" },
    color: { duration: 200, easing: "ease-out" },
    transform: { duration: 200, easing: "ease-out" },
  }),
  opacity: 0,
  color: colors.itemChevron,
});

style.class("left-sidebar-item-chevron-rotated", {
  transform: "rotateZ(90deg)",
});

style.parentHover("left-sidebar", "left-sidebar-item-chevron", {
  opacity: 1,
});

style.classHover("left-sidebar-item-chevron", {
  transform: "scale(1.2)",
  color: colors.itemChevronHover,
});

style.class("left-sidebar-item-children", {
  overflow: "hidden",
});

const CIRCLE_RADIUS = 4.5;

style.class("left-sidebar-item-circle", {
  width: CIRCLE_RADIUS * 2,
  height: CIRCLE_RADIUS * 2,
  minWidth: CIRCLE_RADIUS * 2,
  marginLeft: 5,
  marginRight: 5,
});

style.classHover("left-sidebar-item-chevron-rotated", {
  transform: "rotateZ(90deg) scale(1.2)",
});

css.createScrollStyles("left-sidebar", {
  scrollbar: {
    width: 8,
  },
  thumb: {
    backgroundColor: colors.scrollThumb,
  },
});
