import { dom, div, style, css, button } from "../browser";
import { AppEvents } from "../events";
import { Item } from "../items";
import { MainTab } from "./mainTab";
import { SearchTab } from "./searchTab";

export const viewGallery = (item: Item, events: AppEvents) => {
  const mainTab = new MainTab(item, events);
  const searchTab = new SearchTab(events);

  let searchVisible = false;

  searchTab.onSearchVisibilityChange(searchVisible);

  events.on("search.toggleVisibilty", () => {
    searchVisible = !searchVisible;
    searchTab.onSearchVisibilityChange(searchVisible);
  });

  return div({ className: "gallery" }, [mainTab.el, searchTab.el]);
};
