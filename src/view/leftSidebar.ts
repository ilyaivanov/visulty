import { button, css, div, dom, span, style } from "../browser";
import { colors } from "../designSystem";
import { dispatcher, itemsStore, uiState } from "../globals";

export class LeftSidebar {
  el: HTMLElement;

  constructor() {
    this.el = div(
      { className: "left-sidebar" },
      itemsStore.root.children!.map(this.item)
    );
    dispatcher.leftSidebar = this;
  }

  render() {
    dom.setChildren(this.el, itemsStore.root.children!.map(this.item));
  }

  item = (item: MyItem) =>
    div(
      { className: "left-sidebar-item-children" },
      [
        div(
          {
            className: "left-sidebar-item",
            onClickStopPropagation: () => uiState.focusOnItem(item),
          },
          [
            button({
              textContent: item.isOpenInSidebar ? "-" : "+",
              onClickStopPropagation: () =>
                itemsStore.toggleItemOnSidebar(item),
            }),
            span({ textContent: item.title }),
          ]
        ),
      ].concat(item.isOpenInSidebar ? this.childrenFor(item) : [])
    );

  childrenFor = (item: MyItem): HTMLDivElement[] => {
    return item.children ? item.children.map(this.item) : [];
  };
}

style.class("left-sidebar", {
  position: "absolute",
  top: 48,
  bottom: 49,
  left: 0,
  backgroundColor: colors.header,
  boxShadow: "rgb(0 0 0 / 20%) 2px 0px 2px",
  overflowX: "hidden",
  overflowY: "overlay",
  paddingTop: 10,
  paddingBottom: 10,
  width: 20,
  transition: "width 200ms ease 0s",
  zIndex: 250,
});

style.classHover("left-sidebar", { width: 250 });
style.class("left-sidebar-item", {
  whiteSpace: "nowrap",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0px 10px",
  cursor: "pointer",
});

style.classHover("left-sidebar-item", {
  backgroundColor: colors.headerMenuHover,
});

style.class("left-sidebar-item-children", { marginLeft: 20 });

css.createScrollStyles("left-sidebar", {
  scrollbar: {
    width: 8,
  },
  thumb: {
    backgroundColor: colors.scrollThumb,
  },
});
