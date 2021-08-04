import { dom, div, input, style, css } from "../../src/browser";
import { dispatcher, store } from "../globals";
import { ItemView, showSkeletons } from "./itemView";

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
  }
};

style.class("search-tab", {
  borderLeft: "1px solid #444444",
  transition: css.transition({ marginRight: 200 }),
});

style.class("search-tab_hidden", {
  marginRight: "-100%",
});
