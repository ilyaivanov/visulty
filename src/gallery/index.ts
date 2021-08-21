import { dom, div, style, css, button } from "../browser";
import { spacings, colors, anim } from "../designSystem";

import { AppEvents } from "../events";
import { Item } from "../items";
import { MainTab } from "./mainTab";
import { SearchTab } from "./searchTab";

export const viewGallery = (item: Item, events: AppEvents) => {
  const mainTab = new MainTab(item, events);
  const searchPRops: SearchRoot = {
    id: "SEARCH",
    term: "",
    title: "Search",
    type: "search",
  };
  const searchRoot = new Item(searchPRops, events);
  const searchTab = new SearchTab({
    events,
    onSearchRequest: (term) => {
      searchPRops.term = term;
      searchPRops.nextPageToken = undefined;
      events.trigger("item.loadChildren", searchRoot);
      searchTab.viewSkeletons();
    },
  });

  let searchVisible = false;

  searchTab.onSearchVisibilityChange(searchVisible);

  events.on("search.toggleVisibilty", () => {
    searchVisible = !searchVisible;
    searchTab.onSearchVisibilityChange(searchVisible);
  });
  events.on("item.childrenLoaded", (item) => {
    if (item.isSearch()) {
      searchTab.viewSearchResults(item);
    }
  });

  events.on("item.childrenNextPageLoaded", ({ page, item }) => {
    if (item.isSearch()) {
      searchTab.viewSearchResults(item);
    }
  });

  return div({ className: "gallery" }, [mainTab.el, searchTab.el]);
};

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

  //used to position context menu
  position: "relative",
});

css.createScrollStyles("tab", {
  scrollbar: {
    width: 8,
  },
  thumb: {
    backgroundColor: colors.scrollThumb,
  },
});
