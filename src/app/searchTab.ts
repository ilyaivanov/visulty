import { autorun, reaction } from "mobx";
import { div, dom, input, span } from "../browser";
import { itemsStore, uiStore } from "./stores";
import { viewTree } from "./tree";
import * as youtubeApi from "../api/youtube";
import {
  createChannel,
  createFolder,
  createPlaylist,
  createVideo,
  Item,
} from "../domain/item";

export const viewSearchTab = () => {
  const content = div({}, viewTree(itemsStore.searchRoot));
  const searchTab = div(
    { classNames: ["tab", "search-tab"] },
    input({ placeholder: "Search...", onKeyDown }),
    content
  );

  //memory leak in case of multipage navigation
  autorun(() =>
    dom.assignClassMap(searchTab, {
      "search-tab_hidden": !uiStore.isSearchVisible,
    })
  );

  reaction(
    () => uiStore.searchState,
    (state) => {
      if (state === "loading")
        dom.setChild(content, span({ text: "Loading..." }));
      else if (state === "loaded")
        dom.setChild(content, viewTree(itemsStore.searchRoot));
    }
  );

  return searchTab;
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.code === "Enter") {
    e.preventDefault();
    uiStore.startLoading();

    const term = (e.currentTarget as HTMLInputElement).value;
    youtubeApi.loadSearchResults(term).then((response) => {
      const items = response.items.map(mapResponseItem);
      itemsStore.searchRoot = createFolder("Search", items);
    });
    setTimeout(() => {
      uiStore.stopLoading();
    }, 2000);
  }
};

const mapResponseItem = (item: youtubeApi.ResponseItem): Item => {
  if (item.itemType === "video") return createVideo(item.name, item.itemId);
  else if (item.itemType === "channel")
    return createChannel(item.name, item.image, item.itemId);
  else return createPlaylist(item.name, item.image, item.itemId);
};
