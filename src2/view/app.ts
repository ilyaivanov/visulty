import { dom, div, style, css } from "../../src/browser";
import { spacings } from "../../src/designSystem";
import { colors } from "../designSystem";
import { dispatcher, store } from "../globals";
import { Header } from "./header";
import { MainTab } from "./mainTab";
import { SearchTab } from "./searchTab";

export class AppView {
  el: HTMLElement;
  constructor() {
    this.el = div(
      { className: "app" },
      new Header().el,
      div({ className: "gallery" }, MainTab.view(), SearchTab.view()),
      div({ className: "player" })
    );
    this.assignTheme();
    dispatcher.appView = this;
  }

  assignTheme = () =>
    dom.assignClassMap(this.el, {
      "app-light": store.theme === "light",
      "app-dark": store.theme === "dark",
    });
}

export const viewApp = () => new AppView().el;

style.class("app", {
  color: "white",
  backgroundColor: colors.appBackground,
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

style.class("player", {
  gridArea: "player",
  height: spacings.playerFooterHeight,
  backgroundColor: colors.footer,
  boxShadow: `0 0 6px 2px ${colors.menuShadow}`,
});

style.class("tab", {
  paddingTop: 30,
  flex: 1,
  overflowY: "overlay",
  paddingBottom: "20vh",
});

css.createScrollStyles("tab", {
  scrollbar: {
    width: 8,
  },
  thumb: {
    backgroundColor: colors.scrollThumb,
  },
});
