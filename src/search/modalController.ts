import { array } from "../lodash";
import * as localSearch from "./localSearch";
export { LocalSearchResults } from "./localSearch";

export interface ModalView {
  //commands
  setSearchResults(searchResults: localSearch.LocalSearchResults): void;
  selectItem(item: MyItem): void;
  unselectItem(item: MyItem): void;
  focusOnInput(): void;
  dismissModal(): void;
  render(): HTMLElement;
  //events
  onInput(cb: Action<string>): void;
  onKeyDown(cb: Action<KeyboardEvent>): void;
  onItemClick(cb: Action<MyItem>): void;
}

type SearchProps = {
  onPlay: Action<MyItem>;
  onFocus: Action<MyItem>;
  getRoot: Func0<MyItem>;
  onDismiss: Action<void>;
};

export class SearchModalController {
  itemSelected?: MyItem;
  results: localSearch.LocalSearchResults = {
    items: [],
    term: "",
  };
  constructor(private view: ModalView, private props: SearchProps) {
    view.onInput((term) => {
      if (term) {
        this.results = localSearch.findLocalItems(props.getRoot(), term);
        view.setSearchResults(this.results);
        this.itemSelected = this.results.items[0].item;
        view.selectItem(this.itemSelected);
      }
    });

    view.onItemClick((item) => {
      props.onFocus(item);
      this.dismiss();
    });

    view.onKeyDown(this.onKeyDown);
  }

  showModal(parentElement: HTMLElement) {
    parentElement.appendChild(this.view.render());
    this.view.focusOnInput();
  }

  onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      const nextItem = array.getNextItemBy(
        this.results.items,
        ({ item }) => item === this.itemSelected
      );
      nextItem && this.selectItem(nextItem.item);
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      const previousItem = array.getPreviousItemBy(
        this.results.items,
        ({ item }) => item === this.itemSelected
      );
      previousItem && this.selectItem(previousItem.item);
    } else if (ev.key === "Escape") this.dismiss();
    else if (ev.key === "Enter" && ev.ctrlKey)
      this.itemSelected && this.props.onPlay(this.itemSelected);
    else if (ev.key === "Enter") {
      this.itemSelected && this.props.onFocus(this.itemSelected);
      this.dismiss();
    }
  };

  private dismiss = () => {
    this.view.dismissModal();
    this.props.onDismiss();
  };

  private selectItem = (item: MyItem) => {
    if (this.itemSelected) this.view.unselectItem(this.itemSelected);
    this.itemSelected = item;
    this.view.selectItem(this.itemSelected);
  };
}
