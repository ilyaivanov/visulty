import { dom, div, button, style } from "../browser";
import { spacings, colors, icons, zIndexes } from "../designSystem";
import { dispatcher, itemsStore, uiState } from "../globals";
import * as itemsQueires from "../domain/itemQueries";

export class Header {
  el: HTMLElement;
  themeButton = dom.createRef("button");

  constructor() {
    this.el = div({ className: "header" });
    dispatcher.header = this;
  }

  focusOn = (item: MyItem) => {
    const path = itemsQueires.getItemPath(item);
    console.log(path.map((i) => i.title));
    const pathElements = [
      this.separator(itemsStore.root, path[0]),
      ...path
        .map((item, index, items) => [
          this.pathItemElement(item),
          this.separator(item, items[index + 1]),
        ])
        .flat(),
    ];
    dom.setChildren(this.el, [
      div(
        {
          className: "header-icon",
          onClick: () => uiState.toggleLeftSidebarVisibility(),
        },
        [icons.bars({ className: "header-icon-svg" })]
      ),

      div(
        {
          className: "header-icon",
          classMap: { "header-icon-disabled": true },
        },
        [
          icons.chevron({
            classNames: ["header-icon-svg", "header-icon-svg-rotated"],
          }),
        ]
      ),
      div(
        {
          className: "header-icon",
          classMap: { "header-icon-disabled": true },
        },
        [icons.chevron({ className: "header-icon-svg" })]
      ),
      div(
        {
          className: "header-icon",
          onClick: () => uiState.focusOnItem(itemsStore.root),
        },
        [icons.home({ className: "header-icon-svg" })]
      ),
      ...pathElements,
      button({
        style: { marginLeft: "auto" },
        textContent: "save",
        onClick: () => itemsStore.save(),
      }),
      button({
        textContent: "search",
        onClick: () => uiState.toggleSearchVisibility(),
      }),
      button({
        onClick: () => uiState.toggleTheme(),
        ref: this.themeButton,
      }),
    ]);
    this.assignThemeButtonText();
  };

  assignThemeButtonText = () => {
    this.themeButton.elem.textContent =
      uiState.theme == "dark" ? "Switch to light" : "Switch to dark";
  };

  separator = (parentItem: MyItem, nextChildInPath: MyItem | undefined) => {
    const menu = this.contextMenu(parentItem, nextChildInPath);
    return div(
      {
        className: "header-icon-separator",
        onMouseEnter: () => dom.addClass(menu, "header-context-menu-visible"),
        onMouseLeave: () =>
          dom.removeClass(menu, "header-context-menu-visible"),
      },
      [icons.lightChevron({ className: "header-icon-separator-svg" }), menu]
    );
  };

  pathItemElement = (item: MyItem) =>
    div({
      className: "header-icon-text",
      textContent: item.title,
      onClick: () => uiState.focusOnItem(item),
    });

  contextMenu = (parentItem: MyItem, nextChildInPath: MyItem | undefined) =>
    div(
      { className: "header-context-menu" },
      parentItem.children!.map((item) =>
        this.contextMenuItem(item, item === nextChildInPath)
      )
    );

  contextMenuItem = (item: MyItem, isActive: boolean) =>
    div({
      className: "header-context-menu-item",
      classMap: { "header-context-menu-item-active": isActive },
      textContent: item.title,
      onClick: () => uiState.focusOnItem(item),
    });
}

style.class("header", {
  //relative positioning for youtube iframe player
  position: "relative",
  gridArea: "header",
  height: spacings.headerHeight,
  backgroundColor: colors.header,
  boxShadow: `0 0 6px 2px ${colors.menuShadow}`,
  display: "flex",
  alignItems: "center",
  zIndex: zIndexes.header,
});

style.class("header-icon", {
  marginLeft: 5,
  width: 36,
  height: 36,
  borderRadius: 18,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  color: colors.mainTextColor,
});

style.classHover("header-icon", {
  backgroundColor: colors.headerMenuHover,
});

style.classActive("header-icon", {
  backgroundColor: colors.headerMenuClick,
});

style.class2("header-icon", "header-icon-disabled", {
  color: colors.disabledTextColor,
  backgroundColor: "transparent",
  cursor: "default",
});

style.class("header-icon-separator", {
  width: 20,
  paddingTop: 2,
  alignSelf: "stretch",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  color: colors.mainTextColor,
  cursor: "pointer",
});

style.classHover("header-icon-separator", {
  backgroundColor: colors.headerMenuHover,
});

style.class("header-icon-separator-svg", {
  height: 8,
  width: 8,
  transition: "transform 200ms ease 0s",
});

style.directParentHover("header-icon-separator", "header-icon-separator-svg", {
  transform: "rotateZ(90deg)",
});

style.class("header-icon-svg", {
  height: 22,
  width: 22,
});
style.class("header-icon-svg-rotated", {
  transform: "rotateZ(180deg)",
});

style.class("header-icon-text", {
  fontSize: 14,
  padding: "0px 4px",
  cursor: "pointer",
  alignSelf: "stretch",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: colors.mainTextColor,
});

style.classHover("header-icon-text", {
  backgroundColor: colors.headerMenuHover,
});

style.classActive("header-icon-text", {
  backgroundColor: colors.headerMenuClick,
});

style.class("header-context-menu", {
  pointerEvents: "none",
  opacity: 0,
  transition: "opacity 0.2s ease 0s, transform 0.2s ease 0s",
  transform: "translate3d(0px, 6px, 0px)",
  position: "absolute",
  top: 48,
  left: -20,
  minWidth: 200,
  zIndex: 10,
  boxShadow: "rgb(0 0 0 / 25%) 0px 2px 2px",
  backgroundColor: colors.header,
  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4,
  fontSize: 14,
});

style.class("header-context-menu-visible", {
  pointerEvents: "all",
  opacity: 1,
  transform: "translateZ(0px)",
});

style.class("header-context-menu-item", {
  cursor: "pointer",
  padding: "2px 5px",
});

style.classHover("header-context-menu-item", {
  backgroundColor: colors.headerMenuHover,
});
style.classActive("header-context-menu-item", {
  backgroundColor: colors.headerMenuClick,
});

style.class("header-context-menu-item-active", {
  fontWeight: "bold",
});
