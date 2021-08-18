import { dom, div, style, css, button } from "./browser";
import { spacings, colors, anim } from "./designSystem";

import { AppEvents } from "./events";
import { Item } from "./items/item";
import { ItemsTree } from "./tree";
import { Footer } from "./player/footer";
import { SearchTab } from "./view/searchTab";
import { viewHeader } from "./focus/header";
import { viewLeftSidebar } from "./focus/leftSidebar";
import { createThemeController } from "./designSystem/colorVars";
import { PlayerState, viewPlayer } from "./player/player";
import { viewGallery } from "./gallery";
// import { SearchModalController } from "../search/modalController";
// import ModalViewImplementation from "../search/modalView";

export const viewApp = (container: HTMLElement, events: AppEvents) => {
  const renderInto = (root: Item) => {
    const appElement = div({ classNames: ["app"] });

    let initialTheme = createThemeController(appElement, events);

    const { rightSidebar, footer } = viewPlayer(events);
    dom.appendChildren(appElement, [
      viewHeader({
        events,
        theme: initialTheme,
      }),
      viewGallery(root, events),
      viewLeftSidebar(events),
      rightSidebar,
      footer,
    ]);

    hideLoading();
    dom.appendChild(container, appElement);
  };

  const hideLoading = () => {
    const container = document.getElementById("loader-container");

    container && anim.removeViaOpaque(container, 200);
  };

  events.on("stateLoaded", renderInto);
};

style.class("app", {
  backgroundColor: colors.appBackground,
  color: colors.mainTextColor,
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
