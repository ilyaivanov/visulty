import { dom, div, button, style, css } from "../../src/browser";
import { spacings } from "../../src/designSystem";
import { colors } from "../designSystem";
import { dispatcher, store } from "../globals";
import { Header } from "./header";
import { ItemView } from "./itemView";
import { SearchTab } from "./searchTab";

//I can't really recall why I used pseudoelement for shadows here
//leaveing code in case i will need it
// style.after("header", {
//   position: "absolute",
//   left: 0,
//   right: 0,
//   top: "100%",
//   height: 4,
//   content: `" "`,
//   background: `linear-gradient(
//     rgba(9, 30, 66, 0.13) 0px,
//     rgba(9, 30, 66, 0.13) 1px,
//     rgba(9, 30, 66, 0.08) 1px,
//     rgba(9, 30, 66, 0) 4px)`,
// });

export class AppView {
  el: HTMLElement;
  constructor() {
    this.el = div(
      { className: "app" },
      new Header().el,
      div(
        { className: "gallery" },
        div({ className: "tab" }, ItemView.viewChildrenFor(store.root)),
        SearchTab.view()
      ),
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

style.class("tab", {
  paddingTop: 30,
  flex: 1,
  overflowY: "overlay",
  paddingBottom: "20vh",
});

style.class("player", {
  gridArea: "player",
  height: spacings.playerFooterHeight,
  backgroundColor: colors.footer,
  boxShadow: `0 0 6px 2px ${colors.menuShadow}`,
});

css.createScrollStyles("tab", {
  scrollbar: {
    width: 8,
  },
  thumb: {
    backgroundColor: colors.scrollThumb,
  },
});
