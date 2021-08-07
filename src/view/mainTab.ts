import { div, dom, style } from "../browser";
import { anim, levels, colors } from "../designSystem";
import { dispatcher, itemsStore } from "../globals";
import * as items from "../domain/itemQueries";

import { ItemView } from "./itemView";

export class MainTab {
  el: HTMLElement;
  currentItemFocused?: MyItem;
  constructor() {
    this.el = dom.elem("div", { className: "tab" }, []);
    dispatcher.mainTab = this;
  }

  focusOn = (item: MyItem) => {
    if (!this.currentItemFocused) this.renderTab(item);
    else {
      const currentLevel = items.getItemDistanceFromRoot(
        this.currentItemFocused
      );
      const nextLevel = items.getItemDistanceFromRoot(item);
      const isGoingDeeper = currentLevel < nextLevel;
      const initialTrajectory: anim.FlyTrajectory = isGoingDeeper
        ? {
            from: { x: 0, y: 0 },
            to: { x: -20, y: -20 },
          }
        : {
            from: { x: 0, y: 0 },
            to: { x: 20, y: 20 },
          };
      const secondaryTrajectory: anim.FlyTrajectory = isGoingDeeper
        ? {
            from: { x: 20, y: 20 },
            to: { x: 0, y: 0 },
          }
        : {
            from: { x: -20, y: -20 },
            to: { x: 0, y: 0 },
          };
      anim.fly({
        container: this.el,
        trajectory: initialTrajectory,
        easing: "ease-out",
        opacity: "fade",
        onDone: () => {
          this.renderTab(item);
          anim.fly({
            container: this.el,
            trajectory: secondaryTrajectory,
            easing: "ease-out",
            opacity: "appear",
          });
        },
      });
    }
  };

  private renderTab = (item: MyItem) => {
    this.currentItemFocused = item;
    dom.setChildren(this.el, [
      this.tabHeader(item),
      ItemView.viewChildrenFor(item),
      this.addButton(),
    ]);
  };

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
  color: colors.mainTextColor,
});
