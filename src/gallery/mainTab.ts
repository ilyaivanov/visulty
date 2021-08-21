import { div, button, dom, style } from "../browser";
import { anim, levels, colors, spacings } from "../designSystem";
import { AppEvents } from "../events";
import { Item } from "../items";
import { ItemsTree } from "./tree";

export class MainTab {
  el: HTMLElement;
  mainTree: ItemsTree;
  currentItemFocused?: Item;
  constructor(item: Item, private events: AppEvents) {
    this.mainTree = new ItemsTree(events);
    this.currentItemFocused = item;
    this.el = div({ className: "tab" });
    this.renderTab(item);

    events.on("focusItem", this.focusOn);
  }
  focusOn = (item: Item) => {
    if (!this.currentItemFocused) this.renderTab(item);
    else {
      const currentLevel = this.currentItemFocused.getItemDistanceFromRoot();
      const nextLevel = item.getItemDistanceFromRoot();
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

  private renderTab = (item: Item) => {
    this.currentItemFocused = item;
    dom.setChildren(this.el, [
      this.tabHeader(item),
      this.mainTree.viewChildrenFor(item),
      this.addButton(),
    ]);
  };

  tabHeader = (item: Item) => {
    if (item.isRoot()) return div({});
    else
      return div({
        classNames: ["tab-title", levels.rowForLevel(0)],
        textContent: item.title,
      });
  };

  addButton() {
    return div({ className: levels.rowForLevel(0) }, [
      button({
        textContent: "add",
        onClick: () => this.currentItemFocused?.createNewItemAsLastChild(),
      }),
    ]);
  }
}

style.class("tab-title", {
  fontSize: 24,
  marginBottom: 10,
  marginLeft: spacings.distanceBetweenRowLeftBorderAndIcon,
  fontWeight: "bold",
  color: colors.mainTextColor,
});
