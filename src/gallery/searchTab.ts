import { dom, div, input, style, css } from "../browser";
import { AppEvents } from "../events";
import { dispatcher, itemsStore, uiState } from "../globals";
import { showSkeletons } from "../tree";

export class SearchTab {
  el: HTMLElement;
  searchContent = dom.createRef("div");
  searchInput = dom.createRef("input");
  constructor(private events: AppEvents) {
    this.el = div({ classNames: ["tab", "search-tab"] }, [
      input({
        ref: this.searchInput,
        placeholder: "Search...",
        value: "",
        onKeyDown,
      }),
      div({ ref: this.searchContent }, [
        // viewChildrenFor(itemsStore.searchRoot),
      ]),
    ]);

    this.onSearchVisibilityChange();
    dispatcher.searchTab = this;
  }

  onSearchVisibilityChange = () => {
    dom.assignClassMap(this.el, {
      "search-tab_hidden": !uiState.isSearchVisible,
    });
  };

  startSearching = () => {
    dom.setChildren(this.searchContent.elem, showSkeletons(20));
  };

  stopSearching = () => {
    dom.setChild(
      this.searchContent.elem,
      div({})
      // viewChildrenFor(itemsStore.searchRoot)
    );
  };
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.code === "Enter") {
    e.preventDefault();
    const term = (e.currentTarget as HTMLInputElement).value;
    itemsStore.findVideos(term);
  }
};

style.class("search-tab", {
  borderLeft: "1px solid #444444",
  transition: css.transition({ marginRight: 200 }),
});

style.class("search-tab_hidden", {
  marginRight: "-100%",
});