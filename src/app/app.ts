import { viewTree } from "./tree";
import { css, div, dom, style } from "../browser";
import { button } from "../browser/dom";
import { uiStore } from "./stores";
import { autorun } from "mobx";

export const viewApp = () => {
  const searchTab = div({ classNames: ["tab", "search-tab"] }, viewTree());

  //memory leak in case of multipage navigation
  autorun(() =>
    dom.assignClassMap(searchTab, {
      "search-tab_hidden": !uiStore.isSearchVisible,
    })
  );

  return div(
    { className: "app" },
    div(
      { className: "header" },
      button({ text: "search", onClick: uiStore.toggleSearchVisibility })
    ),
    div(
      { className: "gallery" },
      div({ className: "tab" }, viewTree()),
      searchTab
    ),
    div({ className: "player" })
  );
};

style.class("app", {
  color: "white",
  backgroundColor: "#1E1E1E",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  gridTemplateRows: "auto 1fr auto",
  gridTemplateAreas: `
    "header header header"
    "sidebar gallery rightSidebar"
    "player player player"`,
});

style.tag("body", {
  margin: 0,
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});

style.class("gallery", {
  gridArea: "gallery",
  display: "flex",
});

style.class("tab", {
  flex: 1,
  overflowY: "overlay",
  paddingBottom: "20vh",
});

style.class("search-tab", {
  borderLeft: "1px solid #444444",
  transition: css.transition({ marginRight: 200 }),
});

style.class("search-tab_hidden", { marginRight: "-100%" });

style.class("header", {
  gridArea: "header",
  height: 50,
  backgroundColor: "blue",
});

style.class("player", {
  gridArea: "player",
  height: 50,
  backgroundColor: "green",
});

css.createScrollStyles("tab", {
  scrollbar: {
    width: 8,
  },
  thumb: {
    backgroundColor: "#424242",
  },
});
