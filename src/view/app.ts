import { dom, div, style, css } from "../browser";
import { spacings, colors } from "../designSystem";
import { dispatcher, itemsStore, shortcuts, uiState } from "../globals";
import { Footer } from "../player/footer";
import { Header } from "./header";
import { LeftSidebar } from "./leftSidebar";
import { MainTab } from "./mainTab";
import { RightSidebar } from "../player/rightSidebar";
import { SearchTab } from "./searchTab";
import { SearchModalController } from "../search/modalController";
import ModalViewImplementation from "../search/modalView";

export class AppView {
  el: HTMLElement;
  modalControler = new SearchModalController(new ModalViewImplementation(), {
    getRoot: () => itemsStore.root,
    onFocus: (item) => uiState.focusOnItem(item),
    onPlay: (item) => 42,
    onDismiss: () => shortcuts.startListeningToKeyboard(),
  });

  constructor() {
    this.el = div({ className: "app" }, [
      new Header().el,
      div({ className: "gallery" }, [MainTab.view(), SearchTab.view()]),
      new LeftSidebar().el,
      new RightSidebar(42 as any).el,
      new Footer(42 as any).el,
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
    shortcuts.stopListeningToKeyboard();
    this.modalControler.showModal(this.el);
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
  height: `calc(100vh - ${spacings.playerFooterHeight}px - ${spacings.headerHeight}px)`,
  gridArea: "gallery",
  display: "flex",
  overflow: "hidden",
});

style.class("tab", {
  paddingTop: 30,
  flex: 1,
  overflowY: "overlay",
  overflowX: "hidden",
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
