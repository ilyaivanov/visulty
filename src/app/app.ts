import { viewTree } from "./tree";
import { css, div, button, style } from "../browser";
import { itemsStore, uiStore } from "./stores";
import { viewSearchTab as viewSearchTab } from "./searchTab";
import { spacings } from "../designSystem";

export const viewApp = () => {
  return div(
    { className: "app" },
    div(
      { className: "header" },
      button({ text: "search", onClick: uiStore.toggleSearchVisibility })
    ),
    div(
      { className: "gallery" },
      div({ className: "tab" }, viewTree(itemsStore.homeRoot)),
      viewSearchTab()
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
  height: `calc(100vh - ${spacings.playerFooterHeight}px - ${spacings.headerHeight}px)`,
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
  height: spacings.headerHeight,
  backgroundColor: "blue",
});

style.class("player", {
  gridArea: "player",
  height: spacings.playerFooterHeight,
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
