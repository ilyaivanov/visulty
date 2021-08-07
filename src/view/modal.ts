import { play } from "../api/youtubePlayer";
import { div, input, style, css, dom, span } from "../browser";
import { colors, timings, zIndexes } from "../designSystem";
import { Highlight, LocalSearchEntry, LocalSearchResults } from "../domain";
import { itemsStore, uiState } from "../globals";
import { ItemIcon } from "./itemIcon";

export class Modal {
  el: HTMLElement;
  private input = dom.createRef("input");
  private modalList = dom.createRef("div");

  constructor(private onDismiss: Action<void>) {
    this.el = div({ className: "modal-overlay", onClick: this.dismissModal }, [
      div({ className: "modal" }, [
        input({
          className: "modal-input",
          placeholder: "Jump to...",
          value: "",
          onInput: () => {
            console.log("on change");
            this.input.elem.value &&
              itemsStore.searchForLocalItems(this.input.elem.value);
          },
          onClick: (e) => {
            e.stopPropagation();
          },
          ref: this.input,
        }),

        div({ className: "modal-row-list", ref: this.modalList }),
      ]),
    ]);
    document.addEventListener("keydown", this.onKeyDown);
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.selectItemBelow();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      this.selectItemAbove();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      this.dismissModal();
    }
    if (e.code === "Space") {
      if (this.itemSelected && this.itemSelected.type === "YTvideo") {
        e.preventDefault();
        play(this.itemSelected.videoId);
      } else if (this.itemSelected) {
        //prevents scroll of the page when space is pressed
        e.preventDefault();
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (this.itemSelected) {
        uiState.focusOnItem(this.itemSelected);
        this.dismissModal();
      } else {
        itemsStore.searchForLocalItems(this.input.elem.value);
      }
    }
  };

  dismissModal = () => {
    this.el?.remove();
    document.removeEventListener("keydown", this.onKeyDown);
    this.onDismiss();
  };

  searchResults?: LocalSearchResults;
  itemSelected?: MyItem; //undefined means input is focused

  renderItems(results: LocalSearchResults) {
    this.searchResults = results;
    dom.setChildren(
      this.modalList.elem,
      results.items.map((info) => this.row(info))
    );
  }

  //TODO: traversal of search results is ugly, reword\redesign
  selectItemBelow = () => {
    if (this.searchResults) {
      this.unfocusCurrentlySelected();
      if (!this.itemSelected) {
        this.focusOnItem(this.searchResults.items[0].item);
      } else {
        const index = this.searchResults.items
          .map((item) => item.item)
          .indexOf(this.itemSelected);
        if (index < this.searchResults.items.length - 1) {
          this.focusOnItem(this.searchResults.items[index + 1].item);
        }
      }
    }
  };

  selectItemAbove = () => {
    if (this.itemSelected && this.searchResults) {
      const index = this.searchResults.items
        .map((item) => item.item)
        .indexOf(this.itemSelected);
      this.unfocusCurrentlySelected();
      if (index === 0) this.focusOnInput();
      else this.focusOnItem(this.searchResults.items[index - 1].item);
    }
  };

  focusOnInput = () => {
    this.unfocusCurrentlySelected();
    this.input.elem.focus();
  };

  focusOnItem = (item: MyItem) => {
    this.unfocusCurrentlySelected();
    this.itemSelected = item;
    const elem = document.getElementById(this.itemId(item));
    if (elem) {
      dom.addClass(elem, "modal-row-item-selected");
    }
  };

  unfocusCurrentlySelected = () => {
    if (this.itemSelected) {
      const elem = document.getElementById(this.itemId(this.itemSelected));
      if (elem) dom.removeClass(elem, "modal-row-item-selected");
    } else this.input.elem.blur();
  };

  row = ({ item, highlights }: LocalSearchEntry) => {
    const icon = ItemIcon.viewIcon(item);
    dom.removeClass(icon, "item-icon-video");
    return div(
      {
        className: "modal-row-item",
        id: this.itemId(item),
        onClickStopPropagation: () => {
          uiState.focusOnItem(item);
          this.dismissModal();
        },
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
