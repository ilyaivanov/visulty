import { div, input, style, css, dom, span } from "../browser";
import { colors, timings, zIndexes } from "../designSystem";
import { viewIconFor } from "../tree";
import { Highlight, LocalSearchEntry } from "./localSearch";
import { ModalView, LocalSearchResults } from "./modalController";

export default class ModalViewImplementation implements ModalView {
  private input = dom.createRef("input");
  private modalList = dom.createRef("div");
  private onItemClickCb?: Action<MyItem>;
  private onKeyDownCb?: Action<KeyboardEvent>;
  private onInputCb?: Action<string>;
  private el?: HTMLElement;

  render() {
    this.el = div({ className: "modal-overlay" }, [
      div({ className: "modal" }, [
        input({
          className: "modal-input",
          placeholder: "Jump to...",
          value: "",
          onInput: () =>
            this.onInputCb && this.onInputCb(this.input.elem.value),
          ref: this.input,
        }),

        div({ className: "modal-row-list", ref: this.modalList }),
      ]),
    ]);
    return this.el;
  }

  onItemClick(cb: Action<MyItem>): void {
    this.onItemClickCb = cb;
  }

  focusOnInput(): void {
    this.input.elem.focus();
  }

  setSearchResults(searchResults: LocalSearchResults): void {
    dom.setChildren(
      this.modalList.elem,
      searchResults.items.map((info) => this.row(info))
    );
  }

  row = ({ item, highlights }: LocalSearchEntry) => {
    const icon = div({}); // viewIconFor(item);
    dom.removeClass(icon, "item-icon-video");
    return div(
      {
        className: "modal-row-item",
        id: this.itemId(item),
        onClickStopPropagation: () =>
          this.onItemClickCb && this.onItemClickCb(item),
      },
      [
        icon,
        span(
          {},
          this.createRowTitleWithHighlightsFromTerms(highlights, item.title)
        ),
      ]
    );
  };

  private createRowTitleWithHighlightsFromTerms = (
    highlights: Highlight[],
    title: string
  ): (HTMLElement | string)[] =>
    highlights
      .map((term, index) => {
        const prevIndex = index == 0 ? 0 : highlights[index - 1].to;
        return [
          title.slice(prevIndex, term.from),
          span({
            className: "modal-row-item-highlight",
            textContent: title.slice(term.from, term.to),
          }),
        ];
      })
      .flat()
      .concat(title.slice(highlights[highlights.length - 1].to));

  itemId = (item: MyItem) => "modal-item-" + item.id;

  selectItem(item: MyItem): void {
    const row = document.getElementById(this.itemId(item));
    if (row) dom.addClass(row, "modal-row-item-selected");
  }

  unselectItem(item: MyItem): void {
    const row = document.getElementById(this.itemId(item));
    if (row) dom.removeClass(row, "modal-row-item-selected");
  }

  onInput(cb: Action<string>): void {
    this.onInputCb = cb;
  }

  onKeyDown(cb: Action<KeyboardEvent>): void {
    this.onKeyDownCb = cb;
    document.addEventListener("keydown", this.onKeyDownCb);
  }

  dismissModal() {
    if (this.onKeyDownCb)
      document.removeEventListener("keydown", this.onKeyDownCb);
    this.el?.remove();
  }
}

style.class("modal-overlay", {
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  zIndex: zIndexes.modalWindow,
  animation: `modalOverlay ${timings.modalShow}ms ease-out`,
});

style.keyframes("modalOverlay", [
  { at: "0%", opacity: 0 },
  { at: "100%", opacity: 1 },
]);

const modalWidth = 500;
style.class("modal", {
  width: modalWidth,
  position: "absolute",
  top: 200,
  left: `calc(50vw - ${modalWidth / 2}px)`,
  backgroundColor: "white",
  animation: `modalShow ${timings.modalShow}ms ease-out`,
  borderRadius: 4,
});

style.keyframes("modalShow", [
  { at: "0%", transform: css.translate(0, -20), opacity: 0 },
  { at: "100%", transform: css.translate(0, 0), opacity: 1 },
]);

style.class("modal-input", {
  width: "calc(100% - 20px)",
  boxSizing: "border-box",
  borderRadius: 4,
  border: `1px solid rgb(220, 224, 226)`,
  outline: "none",
  margin: 10,
  padding: 12.5,
  fontSize: 15,
  lineHeight: "18px",
});

style.class("modal-row-item", {
  padding: css.padding(10, 20),
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
});

style.classHover("modal-row-item", { backgroundColor: colors.itemHover });

style.class2("modal-row-item", "modal-row-item-selected", {
  backgroundColor: colors.itemSelected,
});

style.class("modal-row-list", {
  overflow: "overlay",
  maxHeight: 350,
});

style.class("modal-row-item-highlight", {
  fontWeight: "bold",
  textDecoration: "underline",
});

style.classFocus("modal-input", { borderColor: "rgb(73, 186, 242)" });

css.createScrollStyles("modal-row-list", {
  scrollbar: {
    width: 8,
  },
  thumb: {
    backgroundColor: colors.scrollThumb,
  },
});
