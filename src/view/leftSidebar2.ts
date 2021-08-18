import { css, div, dom, span, style, svg } from "../browser";
import { ClassMap } from "../browser/dom";
import { anim, colors, icons, timings, zIndexes } from "../designSystem";
import { AppEvents } from "../events";
import { dispatcher, itemsStore, uiState } from "../globals";

export const viewLeftSidebar = (events: AppEvents) => {
  let sidebarShown = false;

  const result = div({ className: "left-sidebar" });

  const assignSidebarVisibility = () =>
    dom.toggleClass(result, "left-sidebar-hidden", !sidebarShown);

  assignSidebarVisibility();

  events.on("toggleSidebar", () => {
    sidebarShown = !sidebarShown;
    assignSidebarVisibility();
  });
  return result;
};

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
