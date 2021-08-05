import { dom, input, style } from "../browser";
import { colors, anim, levels, spacings } from "../designSystem";
import { play } from "../api/youtubePlayer";
import { itemsStore, dispatcher, dnd } from "../globals";
import { ItemIcon } from "./itemIcon";
import { showSkeletons } from "./itemSkeleton";

export class ItemView {
  childrenElem = dom.createRef("div");
  icon: ItemIcon;
  el: HTMLElement;
  titleElem = dom.createRef("span");
  constructor(public item: MyItem, public level: number) {
    this.icon = new ItemIcon(item, {
      onChevronClick: () => itemsStore.toggleItem(item),
      onIconMouseDown: (e) => dnd.onItemMouseDown(item, e),
    });
    this.el = dom.elem("div", {}, [
      dom.elem(
        "div",
        {
          classNames: ["item-row", levels.rowForLevel(level)],
          onMouseMove: (e) => dnd.onItemMouseMoveOver(item, e),
        },
        [
          this.icon.el,
          dom.elem("span", {
            className: "item-row-title",
            classMap: {
              "item-container-row-title": itemsStore.isContainer(item),
            },
            textContent: item.title,
            ref: this.titleElem,
          }),
          dom.elem("button", {
            textContent: "▶",
            onClickStopPropagation: () =>
              item.type === "YTvideo" && play(item.videoId),
          }),
          dom.elem("button", {
            textContent: "X",
            onClickStopPropagation: () => itemsStore.removeItem(item),
          }),
          dom.elem("button", {
            textContent: "E",
            onClickStopPropagation: () => this.enterRenameMode(),
          }),
        ]
      ),
    ]);
    if (this.item.isOpen) this.open(false);
    else this.close(false);
    dispatcher.itemViewed(this);
  }

  updateItemChildrenVisibility = (animate?: boolean) => {
    if (this.item.isOpen) this.open(animate);
    else this.close(animate);
    this.updateIcons();
  };

  updateIcons = () => {
    this.icon.onVisibilityChange();
  };

  public remove = (instant?: boolean) =>
    instant
      ? this.el.remove()
      : anim
          .flyAwayAndCollapse(this.el)
          .addEventListener("finish", () => this.el.remove());

  public insertItemAfter = (item: MyItem) =>
    this.el.insertAdjacentElement("afterend", ItemView.view(item, this.level));

  public insertItemBefore = (item: MyItem) =>
    this.el.insertAdjacentElement(
      "beforebegin",
      ItemView.view(item, this.level)
    );

  public insertItemAsFirstChild = (item: MyItem) => {
    if (this.childrenElem.elem)
      this.childrenElem.elem.insertAdjacentElement(
        "afterbegin",
        ItemView.view(item, this.level + 1)
      );
  };

  private close = (animate?: boolean) => {
    if (animate) {
      //TODO: UGLY
      if (this.childrenElem.elem)
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
    if (this.childrenElem.elem) {
      this.childrenElem.elem.remove();
      //@ts-expect-error
      this.childrenElem.elem = undefined;
    }
    this.el.appendChild(this.viewChildren());
    if (animate) anim.expand(this.childrenElem.elem);
  };

  private viewChildren = () =>
    dom.elem(
      "div",
      { className: "item-row-children", ref: this.childrenElem },
      this.item.isLoading
        ? showSkeletons(10, this.level + 1).concat(childrenBorder(this.level))
        : this.item.children &&
            this.item.children
              .map((item) => ItemView.view(item, this.level + 1))
              .concat(childrenBorder(this.level))
    );

  private enterRenameMode = () => {
    const inputElem = input({
      className: "item-titleInput",
      value: this.item.title,
      onBlur: stopRenaming,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key == "Escape") stopRenaming();
      },
    });
    this.titleElem.elem.insertAdjacentElement("beforebegin", inputElem);
    this.titleElem.elem.remove();
    inputElem.focus();

    const { item, titleElem } = this;
    function stopRenaming() {
      item.title = inputElem.value;
      titleElem.elem.textContent = item.title;
      inputElem.insertAdjacentElement("beforebegin", titleElem.elem);
      inputElem.removeEventListener("blur", stopRenaming);
      inputElem.remove();
    }
  };

  private static view = (item: MyItem, level: number) =>
    new ItemView(item, level).el;

  static viewChildrenFor = (item: MyItem) =>
    dom.fragment(
      item.children ? item.children.map((item) => ItemView.view(item, 0)) : []
    );
}

const childrenBorder = (level: number) =>
  dom.elem("div", {
    classNames: ["item-children-border", levels.childrenBorderForLevel(level)],
  });
style.class("item-row", {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  color: colors.mainTextColor,
  paddingTop: spacings.rowVecticalPadding,
  paddingBottom: spacings.rowVecticalPadding,
  fontSize: 15,
  lineHeight: 1,
  onHover: {
    backgroundColor: colors.itemHover,
  },
});

style.class2("item-row", "item-row_selected", {
  backgroundColor: colors.itemSelected,
});

style.class("item-container-row-title", {
  fontWeight: "bold",
});

style.class("item-row-children", {
  overflow: "hidden",
  position: "relative",
});

style.class("item-children-border", {
  position: "absolute",
  width: 2,
  top: 0,
  bottom: 0,
  backgroundColor: colors.itemChildrenLine,
});

style.class("item-titleInput", { width: "100%" });

//SKELETON
