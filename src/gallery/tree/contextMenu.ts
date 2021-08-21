import { css, div, dom, style } from "../../browser";
import { colors, icons } from "../../designSystem";
import { AppEvents } from "../../events";
import { ItemView } from "./itemView";

export const viewItemContextMenu = (
  element: HTMLElement,
  events: AppEvents,
  itemView: ItemView
) => {
  const renderInto = dom.fintParentElementWithClass(element, "tab")!;

  const item = itemView.item;

  type ContextMenuItemProps = {
    icon: icons.IconFunc;
    onClick: EmptyAction;
    title: string;
    shortcut: string;
    titleClass?: ClassName;
  };
  const contextMenuItem = (props: ContextMenuItemProps) => {
    const { icon, onClick, title, shortcut, titleClass } = props;
    const titleClasses: ClassName[] = [
      "context-menu-item-title" as ClassName,
    ].concat(titleClass || []);

    return div(
      {
        className: "context-menu-item",
        onClick: () => {
          dismiss();
          onClick();
        },
      },
      [
        icon({ className: "context-menu-item-icon" }),
        div({ classNames: titleClasses, textContent: title }),
        div({ className: "context-menu-item-shortcut", textContent: shortcut }),
      ]
    );
  };

  const menu = div({ className: "context-menu" }, [
    contextMenuItem({
      icon: icons.play,
      onClick: () => events.trigger("item.play", item),
      title: "Play",
      shortcut: "CTRL+D",
    }),
    contextMenuItem({
      icon: icons.zoom,
      onClick: () => events.trigger("focusItem", item),
      title: "Focus",
      shortcut: "CTRL+Y",
    }),
    contextMenuItem({
      icon: icons.edit,
      onClick: () => itemView.enterRenameMode(),
      title: "Rename",
      shortcut: "CTRL+D",
    }),
    //arrow is not placed at the end because of last-of-type and first-of-type css rules
    div({ className: "context-menu-arrow" }),
    contextMenuItem({
      icon: icons.trash,
      onClick: () => item.remove({ playAnimation: true }),
      title: "Delete",
      shortcut: "CTRL+CLT+Backspace",
      titleClass: "context-menu-item-danger",
    }),
  ]);

  const rect = element.getBoundingClientRect();
  const y = renderInto.scrollTop + rect.top;
  const x = rect.left - rect.width / 2 - 12;

  menu.style.top = y + "px";
  menu.style.left = x + "px";

  menu.animate(
    [
      { opacity: 0, transform: "translate3d(0, -10px, 0)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
    ],
    { duration: 200 }
  );
  renderInto!.appendChild(menu);
  itemView.highlightContextMenu();
  menu.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });
  const dismiss = () => {
    itemView.unhighlightContextMenu();
    menu
      .animate(
        [
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
          { opacity: 0, transform: "translate3d(0, -10px, 0)" },
        ],
        { duration: 200 }
      )
      .addEventListener("finish", () => menu.remove());

    document.removeEventListener("mousedown", dismiss);
  };
  document.addEventListener("mousedown", dismiss);
};

style.class("context-menu", {
  width: 240,
  borderRadius: 8,
  backgroundColor: colors.header,
  boxShadow: "0 0 12px 0 rgba(0,0,0,0.25)",

  //coordinates are set dynamically in code via inline styles
  position: "absolute",
});

const CONTEXT_MENU_GAP = 5;
style.class("context-menu-arrow", {
  position: "absolute",
  left: 18,
  top: -10,

  //arrow-up styles from https://css-tricks.com/snippets/css/css-triangle/
  width: 0,
  height: 0,
  borderBottom: `10px solid ${colors.header}`,
  borderRight: `10px solid transparent`,
  borderLeft: `10px solid transparent`,
});

style.class("context-menu-item", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  padding: css.padding(CONTEXT_MENU_GAP, CONTEXT_MENU_GAP * 2.5),
});

style.firstChild("context-menu-item", {
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  paddingTop: CONTEXT_MENU_GAP * 1.2,
});

style.lastChild("context-menu-item", {
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  paddingBottom: CONTEXT_MENU_GAP * 1.2,
});

style.classHover("context-menu-item", {
  backgroundColor: colors.headerMenuHover,
  cursor: "pointer",
});

style.class("context-menu-item-icon", {
  width: 12,
  height: 12,
});

style.class("context-menu-item-title", {
  fontSize: 13,
  marginRight: "auto",
  marginLeft: CONTEXT_MENU_GAP,
});
style.class("context-menu-item-shortcut", {
  color: colors.disabledTextColor,
  fontSize: 13,
});

style.class("context-menu-item-danger", {
  color: colors.textDanger,
});
