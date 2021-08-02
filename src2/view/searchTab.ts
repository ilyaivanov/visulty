// import { autorun, reaction } from "mobx";
// import { div, dom, input, span } from "../browser";
// import { itemsStore, uiStore } from "./stores";
// import { viewTree } from "./tree";
// import * as youtubeApi from "../api/youtube";
// import {
//   VideoItem,
//   ChannelItem,
//   PlaylistItem,
//   Item,
//   FolderItem,
// } from "../domain/item";

import { dom, div, input, style, css } from "../../src/browser";
import { dispatcher, store } from "../globals";
import { itemSkeleton, ItemView, showSkeletons } from "./itemView";

export class SearchTab {
  el: HTMLElement;
  searchContent = dom.createRef("div");
  constructor() {
    this.el = div(
      { classNames: ["tab", "search-tab"] },
      input({
        placeholder: "Search...",
        onKeyDown,
      }),
      dom.elem("div", { ref: this.searchContent }, [
        ItemView.viewChildrenFor(store.searchRoot),
      ])
    );

    this.onSearchVisibilityChange();
    dispatcher.searchTab = this;
  }

  static view = () => new SearchTab().el;

  onSearchVisibilityChange = () => {
    dom.assignClassMap(this.el, {
      "search-tab_hidden": !store.isSearchVisible,
    });
  };

  startSearching = () => {
    dom.setChildren(this.searchContent.elem, showSkeletons(20));
  };

  stopSearching = () => {
    dom.setChild(
      this.searchContent.elem,
      ItemView.viewChildrenFor(store.searchRoot)
    );
  };
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.code === "Enter") {
    e.preventDefault();
    const term = (e.currentTarget as HTMLInputElement).value;
    store.findVideos(term);
    // uiStore.startLoading();

    // youtubeApi.loadSearchResults(term).then((response) => {
    //   const items = response.items.map(mapResponseItem);
    //   itemsStore.searchRoot = new FolderItem({
    //     title: "Search",
    //     children: items,
    //   });
    // });
    // setTimeout(() => {
    //   uiStore.stopLoading();
    // }, 2000);
  }
};

// export const mapResponseItem = (item: youtubeApi.ResponseItem): Item => {
//   if (item.itemType === "video")
//     return new VideoItem({ title: item.name, videoId: item.itemId });
//   else if (item.itemType === "channel")
//     return new ChannelItem({
//       title: item.name,
//       channelImage: item.image,
//       channelId: item.itemId,
//     });
//   else
//     return new PlaylistItem({
//       title: item.name,
//       playlistImage: item.image,
//       playlistId: item.itemId,
//     });
// };

style.class("search-tab", {
  borderLeft: "1px solid #444444",
  transition: css.transition({ marginRight: 200 }),
});

style.class("search-tab_hidden", {
  marginRight: "-100%",
});
