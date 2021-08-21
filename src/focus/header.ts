import { dom, div, button, style } from "../browser";
import { spacings, colors, icons, zIndexes } from "../designSystem";
import { AppEvents } from "../events";
import { Item } from "../items";

type HeaderProps = {
  theme: AppTheme;
  events: AppEvents;
  root: Item;
};

export const viewHeader = ({ theme, events, root }: HeaderProps) => {
  const actions = {
    toggleSidebar: () => events.trigger("toggleSidebar"),
    focus: (item: Item) => events.trigger("focusItem", item),
  };
  const themeButton = dom.createRef("button");
  const pathElemenet = dom.createRef("div");

  const assignthemeButtonText = (theme: AppTheme) =>
    (themeButton.elem.textContent =
      theme == "dark" ? "Switch to light" : "Switch to dark");

  const result = div({ className: "header" }, [
    div(
      {
        className: "header-icon",
        onClick: actions.toggleSidebar,
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
        onClick: () => actions.focus(root),
      },
      [icons.home({ className: "header-icon-svg" })]
    ),
    div({ className: "header-path", ref: pathElemenet }),
    button({
      style: { marginLeft: "auto" },
      textContent: "save",
      onClick: () => events.trigger("saveState"),
    }),
    button({
      textContent: "search",
      onClick: () => events.trigger("search.toggleVisibilty"),
    }),
    button({
      onClick: () => events.trigger("toggleTheme"),
      ref: themeButton,
    }),
  ]);

  assignthemeButtonText(theme);

  events.on("themeToggled", assignthemeButtonText);
  events.on("focusItem", (item) =>
    dom.setChildren(pathElemenet.elem, createPathForElemet(item, actions.focus))
  );

  return result;
};

const createPathForElemet = (item: Item, focus: Action<Item>) => {
  const root = item.getRoot();
  const path = item.getItemPath();
  return [
    separator(root, path[0], focus),
    ...path
      .map((item, index, items) => [
        pathItemElement(item, focus),
        separator(item, items[index + 1], focus),
      ])
      .flat(),
  ];
};

const separator = (
  parentItem: Item,
  nextChildInPath: Item | undefined,
  focus: Action<Item>
) => {
  const menu = contextMenu(parentItem, nextChildInPath, focus);
  return div(
    {
      className: "header-icon-separator",
      onMouseEnter: () => dom.addClass(menu, "header-context-menu-visible"),
      onMouseLeave: () => dom.removeClass(menu, "header-context-menu-visible"),
    },
    [icons.lightChevron({ className: "header-icon-separator-svg" }), menu]
  );
};

const pathItemElement = (item: Item, focus: Action<Item>) =>
  div({
    className: "header-icon-text",
    textContent: item.title,
    onClick: () => focus(item),
  });

const contextMenu = (
  parentItem: Item,
  nextChildInPath: Item | undefined,
  focus: Action<Item>
) =>
  div(
    { className: "header-context-menu" },
    parentItem.children!.map((item) =>
      contextMenuItem(item, item === nextChildInPath, focus)
    )
  );

const contextMenuItem = (item: Item, isActive: boolean, focus: Action<Item>) =>
  div({
    className: "header-context-menu-item",
    classMap: { "header-context-menu-item-active": isActive },
    textContent: item.title,
    onClick: () => focus(item),
  });

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

style.class("header-path", {
  height: "100%",
  flex: 1,
  display: "flex",
  alignItems: "center",
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
