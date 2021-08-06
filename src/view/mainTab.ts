import { div, dom, style } from "../browser";
import { levels } from "../designSystem";
import { dispatcher, itemsStore } from "../globals";
import * as items from "../domain/itemQueries";

import { ItemView } from "./itemView";
import { colorsVars } from "../designSystem/colorVars";

export class MainTab {
  el: HTMLElement;

  constructor() {
    this.el = dom.elem("div", { className: "tab" }, []);
    dispatcher.mainTab = this;
  }

  focusOn = (item: MyItem) =>
    dom.setChildren(this.el, [
      this.tabHeader(item),
      ItemView.viewChildrenFor(item),
      this.addButton(),
    ]);

  tabHeader = (item: MyItem) => {
    if (items.isRoot(item)) return div({});
    else
      return div({
        classNames: ["tab-title", levels.rowForLevel(0)],
        textContent: item.title,
      });
  };

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

style.class("tab-title", {
  fontSize: 24,
  marginBottom: 10,
  fontWeight: "bold",
  color: colorsVars.mainTextColor,
});
