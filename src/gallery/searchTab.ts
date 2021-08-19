import { dom, div, input, style, css } from "../browser";
import { AppEvents } from "../events";
import { Item } from "../items";
import { ItemsTree, showSkeletons } from "./tree";

type SearchTabProps = {
  events: AppEvents;
  onSearchRequest: Action<string>;
};

export class SearchTab {
  el: HTMLElement;
  tree: ItemsTree;
  searchContent = dom.createRef("div");
  searchInput = dom.createRef("input");

  constructor(private props: SearchTabProps) {
    this.tree = new ItemsTree(props.events);
    this.el = div({ classNames: ["tab", "search-tab"] }, [
      input({
        ref: this.searchInput,
        placeholder: "Search...",
        value: "",
        onKeyDown: this.onKeyDown,
      }),
      div({ ref: this.searchContent }),
    ]);
  }

  onSearchVisibilityChange = (isVisible: boolean) => {
    dom.assignClassMap(this.el, {
      "search-tab_hidden": !isVisible,
    });
  };

  viewSkeletons = () => {
    dom.setChildren(this.searchContent.elem, showSkeletons(20));
  };

  viewSearchResults = (searchRoot: Item) => {
    dom.setChild(
      this.searchContent.elem,
      this.tree.viewChildrenFor(searchRoot)
    );
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Enter") {
      e.preventDefault();
      const term = (e.currentTarget as HTMLInputElement).value;
      this.props.onSearchRequest(term);
    }
  };
}

style.class("search-tab", {
  borderLeft: "1px solid #444444",
  transition: css.transition({ marginRight: 200 }),
});

style.class("search-tab_hidden", {
  marginRight: "-100%",
});
