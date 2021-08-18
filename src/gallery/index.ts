import { dom, div, style, css, button } from "../browser";
import { AppEvents } from "../events";
import { Item } from "../items";
import { MainTab } from "./mainTab";

export const viewGallery = (item: Item, events: AppEvents) => {
  const mainTab = new MainTab(item, events);
  return div({ className: "gallery" }, [
    div({ className: "tab" }, [mainTab.el]),
    // SearchTab.view(),
  ]);
};
