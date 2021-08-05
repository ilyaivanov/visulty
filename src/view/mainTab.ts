import { dom } from "../browser";
import { levels } from "../designSystem";
import { itemsStore } from "../globals";
import { ItemView } from "./itemView";

export class MainTab {
  el: HTMLElement;

  constructor() {
    this.el = dom.elem("div", { className: "tab" }, [
      ItemView.viewChildrenFor(itemsStore.root),
      this.addButton(),
    ]);
  }

  addButton() {
    return dom.elem("div", { className: levels.rowForLevel(0) }, [
      dom.elem("button", {
        textContent: "add",
        onClick: () => itemsStore.addItemToTheEndOf(itemsStore.root),
      }),
    ]);
  }

  static view = () => new MainTab().el;
}
