import { dom, div, button, style, css } from "../../src/browser";
import { spacings } from "../../src/designSystem";
import { store } from "../globals";
import { ItemView } from "./itemView";
import { SearchTab } from "./searchTab";

export const viewApp = () => {
  return div(
    { className: "app" },
    div(
      { className: "header" },
      button({ text: "search", onClick: store.toggleSearchVisibility })
    ),
    div(
      { className: "gallery" },
      div({ className: "tab" }, ItemView.viewChildrenFor(store.root)),
      SearchTab.view()
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

style.class("header", {
  gridArea: "header",
  height: spacings.headerHeight,
  backgroundColor: "#3C3C3C",
});

style.class("player", {
  gridArea: "player",
  height: spacings.playerFooterHeight,
  backgroundColor: "#3C3C3C",
});

css.createScrollStyles("tab", {
  scrollbar: {
    width: 8,
  },
  thumb: {
    backgroundColor: "#424242",
  },
});
