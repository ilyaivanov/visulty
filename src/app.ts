import { dom, div, style, css, button } from "./browser";
import { spacings, colors, anim } from "./designSystem";

import { AppEvents } from "./events";
import { Item } from "./items/item";
import { ItemsTree } from "./tree";
import { Footer } from "./player/footer";
import { Header } from "./view/header";
import { LeftSidebar } from "./view/leftSidebar";
import { MainTab } from "./view/mainTab";
import { RightSidebar } from "./player/rightSidebar";
import { SearchTab } from "./view/searchTab";
import { viewHeader } from "./view/header2";
import { viewLeftSidebar } from "./view/leftSidebar2";
import { createThemeController } from "./designSystem/colorVars";
// import { SearchModalController } from "../search/modalController";
// import ModalViewImplementation from "../search/modalView";

export const viewApp = (container: HTMLElement, events: AppEvents) => {
  const renderInto = (root: Item) => {
    const mainTree = new ItemsTree(events);
    const tree = mainTree.viewChildrenFor(root);

    const appElement = div({ classNames: ["app"] }, [
      viewHeader({
        events,
        theme: "dark",
      }),
      div({ className: "gallery" }, [
        div({ className: "tab" }, tree),
        SearchTab.view(),
      ]),
      viewLeftSidebar(events),
      new RightSidebar().el,
      new Footer().el,
    ]);
    createThemeController({ container: appElement, events });
    hideLoading();
    dom.appendChild(container, appElement);
  };

  const hideLoading = () => {
    const container = document.getElementById("loader-container");

    container && anim.removeViaOpaque(container, 200);
  };

  events.on("stateLoaded", renderInto);
};

// export class App {
//   root?: Item;

//   appEvents = new AppEvents();
//   mainTree = new ItemsTree(this.appEvents);

//   constructor(private parent: HTMLElement) {
//     // this.assignTheme();
//   }

//   renderInto(container: Element, root: MyItem) {
//     this.root = new Item(root, this.appEvents);
//     const tree = this.mainTree.viewChildrenFor(this.root);

//     const appElement = div({ classNames: ["app", "app-light"] }, [
//       viewHeader(this.appEvents),
//       div({ className: "gallery" }, [
//         div({ className: "tab" }, tree),
//         SearchTab.view(),
//       ]),
//       viewLeftSidebar(this.appEvents),
//       new RightSidebar().el,
//       new Footer().el,
//     ]);

//     dom.setChild(container, appElement);
//   }

//   rootItemLoaded = (item: Item) => {
//     this.root = item;
//   };

//   // assignTheme = () =>
//   //   dom.assignClassMap(this.el, {
//   //     "app-light": uiState.theme === "light",
//   //     "app-dark": uiState.theme === "dark",
//   //   });
// }

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
