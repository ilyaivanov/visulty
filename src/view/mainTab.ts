import { dom } from "../browser";
import { levels } from "../designSystem";
import { store } from "../globals";
import { ItemView } from "./itemView";

export class MainTab {
  el: HTMLElement;

  constructor() {
    this.el = dom.elem("div", { className: "tab" }, [
      ItemView.viewChildrenFor(store.root),
      this.addButton(),
    ]);
  }

  addButton() {
    return dom.elem("div", { className: levels.rowForLevel(0) }, [
      dom.elem("button", {
        textContent: "add",
        onClick: () => store.addItemToTheEndOf(store.root),
      }),
    ]);
  }

  static view = () => new MainTab().el;
}
