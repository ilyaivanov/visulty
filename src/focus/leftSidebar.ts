import { css, div, dom, span, style, svg } from "../browser";
import { anim, colors, icons, timings, zIndexes } from "../designSystem";
import { AppEvents } from "../events";
import { Item } from "../items/item";

export const viewLeftSidebar = (root: Item, events: AppEvents) => {
  let sidebarShown = false;

  const rowsShown: WeakMap<Item, LeaftSidebarItem> = new WeakMap();

  const onShown = (row: LeaftSidebarItem) => rowsShown.set(row.props.item, row);

  const actions: SidebarItemProps["actions"] = {
    onChevronClick: (item) => item.toggleRightSidebarVisibility(),
    onItemClick: (item) => events.trigger("focusItem", item),
  };

  const result = div(
    { className: "left-sidebar" },
    (root.children || []).map(
      (item) => new LeaftSidebarItem({ item, onShown, actions }, 0).el
    )
  );

  const assignSidebarVisibility = () =>
    dom.toggleClass(result, "left-sidebar-hidden", !sidebarShown);

  assignSidebarVisibility();

  events.on("toggleSidebar", () => {
    sidebarShown = !sidebarShown;
    assignSidebarVisibility();
  });

  events.on("item.rightSidebarVisibilityChanged", (item) =>
    rowsShown.get(item)?.updateItemChildrenVisibility()
  );

  return result;
};

type SidebarItemProps = {
  item: Item;
  actions: {
    onChevronClick: Action<Item>;
    onItemClick: Action<Item>;
  };
  onShown: Action<LeaftSidebarItem>;
};

export class LeaftSidebarItem {
  el: HTMLDivElement;
  private childrenElement = dom.createRef("div");
  private chevron: SVGElement;
  constructor(public props: SidebarItemProps, private level: number) {
    this.chevron = icons.chevron({
      className: "left-sidebar-item-chevron",
      classMap: this.chevronClasses(),
      onClick: (e) => {
        e.stopPropagation();
        props.actions.onChevronClick(props.item);
      },
    });
    this.el = div({}, [
      div(
        {
          className: "left-sidebar-item",
          style: { paddingLeft: 4 + level * 15 },
          onClickStopPropagation: () => props.actions.onItemClick(props.item),
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
          span({ textContent: props.item.title }),
        ]
      ),
      div(
        { ref: this.childrenElement, className: "left-sidebar-item-children" },
        props.item.isOpenInSidebar
          ? this.childrenFor(this.props.item, level)
          : []
      ),
    ]);

    this.props.onShown(this);
  }

  updateItemChildrenVisibility = () => {
    dom.assignClassMap(this.chevron, this.chevronClasses());
    if (this.props.item.isOpenInSidebar) {
      dom.setChildren(
        this.childrenElement.elem,
        this.childrenFor(this.props.item, this.level)
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

  childrenFor = (item: Item, level: number): HTMLDivElement[] => {
    return item.children
      ? item.children.map(
          (item) => new LeaftSidebarItem({ ...this.props, item }, level + 1).el
        )
      : [];
  };

  chevronClasses = (): dom.ClassMap => ({
    "left-sidebar-item-chevron-rotated": this.props.item.isOpenInSidebar,
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
