import { anim, dom, style } from "../src/browser";
import { store, dispatcher } from "./globals";

export class ItemView {
  counterElem = dom.createRef("span");
  childrenElem = dom.createRef("ol");
  chevronElem = dom.createRef("button");
  el: HTMLElement;
  constructor(public item: MyItem) {
    this.el = dom.elem("li", {}, [
      dom.elem("button", {
        ref: this.chevronElem,
        onClick: () => store.toggleItem(item),
      }),
      dom.elem("span", { textContent: item.title }),
      dom.elem("span", { className: "counter" as any, ref: this.counterElem }),
      dom.button({ text: "+", onClick: () => store.increment(this.item) }),
      dom.button({ text: "X" }),
    ]);
    this.updateCounter(true);
    this.updateItemChildrenVisibility();
    dispatcher.itemViewed(this);
  }

  updateCounter = (ignoreAnimations?: boolean) => {
    const { elem } = this.counterElem;
    if (!ignoreAnimations) {
      elem
        .animate(
          [
            { transform: "translate(0,0)", opacity: 1 },
            { transform: "translate(0,-10px)", opacity: 0 },
          ],
          { duration: 200, easing: "ease-in" }
        )
        .addEventListener("finish", () => {
          elem.textContent = `(${this.item.counter})`;
          elem.animate(
            [
              { transform: "translate(0,10px)", opacity: 0 },
              { transform: "translate(0,0)", opacity: 1 },
            ],
            { duration: 200, easing: "ease-out" }
          );
        });
    } else {
      elem.textContent = ` (${this.item.counter})`;
    }
  };

  updateItemChildrenVisibility = (animate?: boolean) => {
    if (this.item.isOpen) this.open(animate);
    else this.close(animate);
  };

  private close = (animate?: boolean) => {
    this.chevronElem.elem.textContent = "ᐳ";
    if (animate) {
      //TODO: UGLY
      anim.collapse(this.childrenElem.elem).addEventListener("finish", () => {
        this.childrenElem.elem.remove();
        //@ts-expect-error
        this.childrenElem.elem = undefined;
      });
    } else if (this.childrenElem.elem) {
      this.childrenElem.elem.remove();
      //@ts-expect-error
      this.childrenElem.elem = undefined;
    }
  };
  private open = (animate?: boolean) => {
    this.chevronElem.elem.textContent = "ᐯ";
    this.el.appendChild(this.viewChildren());
    if (animate) anim.expand(this.childrenElem.elem);
  };

  private viewChildren = () =>
    dom.elem(
      "ol",
      { ref: this.childrenElem },
      this.item.children && this.item.children.map(ItemView.view)
    );

  static view = (item: MyItem) => new ItemView(item).el;
}
//VIEW
export const viewChildrenFor = (item: MyItem) =>
  dom.elem("ol", {}, item.children && item.children.map(ItemView.view));

style.tag("li", {
  fontSize: 18,
});

style.tag("button", {
  border: "none",
  cursor: "pointer",
});

style.class("counter" as any, {
  display: "inline-block",
  marginLeft: 10,
  marginRight: 10,
});

style.selector("button:hover", {
  backgroundColor: "#CCCCCC",
});

style.selector("button:active", {
  backgroundColor: "#DDDDDD",
});
