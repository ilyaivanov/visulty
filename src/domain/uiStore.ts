import { makeAutoObservable } from "mobx";

type SearchState = "empty" | "loading" | "loaded";

export class UIStore {
  isSearchVisible = false;

  searchState: SearchState = "empty";
  constructor() {
    makeAutoObservable(this);
  }

  toggleSearchVisibility = () => {
    this.isSearchVisible = !this.isSearchVisible;
  };

  startLoading = () => {
    this.searchState = "loading";
  };

  //TODO: it might be empty if no search results found
  stopLoading = () => {
    this.searchState = "loaded";
  };
}
