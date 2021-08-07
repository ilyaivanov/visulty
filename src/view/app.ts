import { dom, div, style, css } from "../browser";
import { spacings, colors } from "../designSystem";
import { LocalSearchResults } from "../domain";
import { dispatcher, shortcuts, uiState } from "../globals";
import { Footer } from "./footer";
import { Header } from "./header";
import { LeftSidebar } from "./leftSidebar";
import { MainTab } from "./mainTab";
import { Modal } from "./modal";
import { SearchTab } from "./searchTab";

export class AppView {
  el: HTMLElement;
  modal?: Modal;
  constructor() {
    this.el = div({ className: "app" }, [
      new Header().el,
      div({ className: "gallery" }, [MainTab.view(), SearchTab.view()]),
      new LeftSidebar().el,
      new Footer().el,
    ]);
    this.assignTheme();
    dispatcher.appView = this;
  }

  assignTheme = () =>
    dom.assignClassMap(this.el, {
      "app-light": uiState.theme === "light",
      "app-dark": uiState.theme === "dark",
    });

  showModal = () => {
    this.modal = new Modal(() => {
      shortcuts.startListeningToKeyboard();
      this.modal = undefined;
    });
    shortcuts.stopListeningToKeyboard();
    this.el.appendChild(this.modal.el);
    this.modal.focusOnInput();
  };

  showLocalResults = (results: LocalSearchResults) => {
    if (this.modal) this.modal.renderItems(results);
  };
}

export const viewApp = () => new AppView().el;

style.class("app", {
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
  //this width fixes forced center shift for smaller screens
  width: "100vw",
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

css.createScrollStyles("tab", {
  scrollbar: {
    width: 8,
  },
  thumb: {
    backgroundColor: colors.scrollThumb,
  },
});
