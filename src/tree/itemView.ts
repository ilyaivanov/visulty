import { dom, div, input, span, button, style } from "../browser";
import { colors, anim, levels, spacings, icons } from "../designSystem";
import { ItemIcon } from "./itemIcon";
import { showSkeletons } from "./index";
import { Item } from "../items/item";
import { AppEvents } from "../events";

export class ItemView {
  icon: ItemIcon;
  el: HTMLElement;
  rowElem = dom.createRef("div");
  childrenElem = dom.createRef("div");
  titleElem = dom.createRef("span");

  constructor(
    public item: Item,
    public level: number,
    private onShown: Action<ItemView>,
    private events: AppEvents
  ) {
    this.icon = new ItemIcon(item, {
      onChevronClick: () => item.toggleVisibility(),
      onIconMouseDown: (event) =>
        events.trigger("item.mouseDownOnIcon", { item, event }),
    });
    this.el = div({}, [
      div(
        {
          classNames: ["item-row", levels.rowForLevel(level)],
          ref: this.rowElem,
          // onClick: () => uiState.select(item),
          onMouseMove: (event) =>
            events.trigger("item.mouseMoveOverItem", { item, event }),
        },
        [
          this.icon.el,
          span({
            className: "item-row-title",
            classMap: {
              "item-container-row-title": item.isContainer(),
            },
            textContent: item.title,
            ref: this.titleElem,
          }),
          div({ classNames: ["hide", "item-row_showOnHoverOrSelected"] }, [
            button({
              textContent: "▶",
              onClickStopPropagation: () =>
                this.events.trigger("itemPlay", item),
            }),
            button({
              textContent: "F",

              onClickStopPropagation: () =>
                this.events.trigger("focusItem", item),
            }),
            button({
              textContent: "X",
              onClickStopPropagation: () =>
                item.remove({ playAnimation: true }),
            }),
            button({
              textContent: "E",
              onClickStopPropagation: () => this.enterRenameMode(),
            }),
          ]),
        ]
      ),
    ]);
    if (this.item.isOpen) this.open(false);
    else this.close(false);
    onShown(this);
  }

  updateItemChildrenVisibility = (animate?: boolean) => {
    if (this.item.isOpen) this.open(animate);
    else this.close(animate);
    this.updateIcons();
  };

  updateIcons = () => {
    this.icon.onVisibilityChange();
  };

  public remove = (options?: { playAnimation: boolean }) =>
    options && options.playAnimation
      ? anim
          .flyAwayAndCollapse(this.el)
          .addEventListener("finish", () => this.el.remove())
      : this.el.remove();

  public insertItemAfter = (item: Item) =>
    this.el.insertAdjacentElement(
      "afterend",
      ItemView.view(item, this.level, this.onShown, this.events)
    );

  public insertItemBefore = (item: Item) =>
    this.el.insertAdjacentElement(
      "beforebegin",
      ItemView.view(item, this.level, this.onShown, this.events)
    );

  public insertItemAsFirstChild = (item: Item) => {
    if (this.childrenElem.elem)
      this.childrenElem.elem.insertAdjacentElement(
        "afterbegin",
        ItemView.view(item, this.level + 1, this.onShown, this.events)
      );
  };

  public select = () => dom.addClass(this.rowElem.elem, "item-row_selected");
  public unselect = () =>
    dom.removeClass(this.rowElem.elem, "item-row_selected");

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
    div(
      { className: "item-row-children", ref: this.childrenElem },
      this.item.isLoading
        ? showSkeletons(10, this.level + 1).concat(childrenBorder(this.level))
        : this.item.children &&
            this.item.children
              .map((item) =>
                ItemView.view(item, this.level + 1, this.onShown, this.events)
              )
              .concat(childrenBorder(this.level))
              .concat(
                this.item.getNextPageToken()
                  ? [ItemView.downloadNextPageButton(this.item, this.level + 1)]
                  : []
              )
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
      item.setTitle(inputElem.value);
      titleElem.elem.textContent = item.title;
      inputElem.insertAdjacentElement("beforebegin", titleElem.elem);
      inputElem.removeEventListener("blur", stopRenaming);
      inputElem.remove();
    }
  };

  private static downloadNextPageButton = (item: Item, level: number) => {
    const ref = dom.createRef("div");
    return div({ classNames: ["item-row", levels.rowForLevel(level)] }, [
      div(
        {
          classNames: ["footer-icon-container", "item-icon-download-container"],
          ref,
          onClickStopPropagation: () => {
            if (!item.isLoading) {
              item.loadNextPage();
              dom.setChild(
                ref.elem,
                icons.spinnner({
                  classNames: ["footer-icon", "item-icon-download-spinner"],
                })
              );
            }
          },
        },
        [icons.arrow({ classNames: ["footer-icon", "item-icon-download"] })]
      ),
      div({ textContent: "Load more items..." }),
    ]);
  };

  private static view = (
    item: Item,
    level: number,
    onShown: Action<ItemView>,
    events: AppEvents
  ) => new ItemView(item, level, onShown, events).el;

  static viewChildrenFor = (
    item: Item,
    onShown: Action<ItemView>,
    events: AppEvents
  ) =>
    dom.fragment(
      item.children
        ? item.children
            .map((item) => ItemView.view(item, 0, onShown, events))
            .concat(
              item.getNextPageToken()
                ? [ItemView.downloadNextPageButton(item, 0)]
                : []
            )
        : []
    );
}

const childrenBorder = (level: number) =>
  div({
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

style.class("hide", { opacity: 0 });

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

style.class("item-icon-download-container", {
  marginRight: spacings.spaceBetweenCircleAndText,
});

style.class("item-icon-download", {
  transform: "rotateZ(180deg)",
});

style.class("item-icon-download-spinner", {
  animation: "spinner 800ms infinite linear",
});

style.keyframes("spinner", [
  { at: "0%", transform: "rotateZ(-50deg)" },
  { at: "100%", transform: "rotateZ(310deg)" },
]);
