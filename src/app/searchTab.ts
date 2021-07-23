import { autorun, reaction } from "mobx";
import { div, dom, input, span } from "../browser";
import { itemsStore, uiStore } from "./stores";
import { viewTree } from "./tree";
import * as youtubeApi from "../api/youtube";
import {
  VideoItem,
  ChannelItem,
  PlaylistItem,
  Item,
  FolderItem,
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
      itemsStore.searchRoot = new FolderItem({
        title: "Search",
        children: items,
      });
    });
    setTimeout(() => {
      uiStore.stopLoading();
    }, 2000);
  }
};

export const mapResponseItem = (item: youtubeApi.ResponseItem): Item => {
  if (item.itemType === "video")
    return new VideoItem({ title: item.name, videoId: item.itemId });
  else if (item.itemType === "channel")
    return new ChannelItem({
      title: item.name,
      channelImage: item.image,
      channelId: item.itemId,
    });
  else
    return new PlaylistItem({
      title: item.name,
      playlistImage: item.image,
      playlistId: item.itemId,
    });
};
