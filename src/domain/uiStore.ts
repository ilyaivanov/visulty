import { makeAutoObservable } from "mobx";

export class UIStore {
  isSearchVisible = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggleSearchVisibility = () => {
    this.isSearchVisible = !this.isSearchVisible;
  };
}
