import { css, div, dom, style } from "../browser";
import { colors, zIndexes } from "../designSystem";
import { dispatcher, uiState } from "../globals";

export class RightSidebar {
  el: HTMLElement;

  constructor() {
    this.el = div({ className: "right-sidebar" }, this.viewChildren());
    this.assignVisibility();
    dispatcher.rightSidebar = this;
  }

  viewChildren = () => [div({ textContent: "right sidebar" })];

  assignVisibility = () =>
    dom.toggleClass(
      this.el,
      "right-sidebar-hidden",
      !uiState.isRightSidebarVisible
    );
}

style.class("right-sidebar", {
  gridArea: "rightSidebar",
  backgroundColor: colors.leftSidebar,
  boxShadow: "rgb(0 0 0 / 20%) -2px 0px 2px",
  overflowX: "hidden",
  overflowY: "overlay",
  paddingTop: 10,
  paddingBottom: 10,
  width: 250,
  transition: "width 200ms ease 0s",
  zIndex: zIndexes.leftSidebar,
});

style.class("right-sidebar-hidden", {
  width: 0,
});

css.createScrollStyles("right-sidebar", {
  scrollbar: {
    width: 8,
  },
  thumb: {
    backgroundColor: colors.scrollThumb,
  },
});
