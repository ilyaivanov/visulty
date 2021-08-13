import { css, div, dom, img, style } from "../browser";
import { colors, timings, zIndexes } from "../designSystem";
import { dispatcher, itemsStore, playerState, uiState } from "../globals";

export class RightSidebar {
  el: HTMLElement;

  currentQueueItemBeingPlayed?: HTMLElement;
  constructor() {
    this.el = div({ className: "right-sidebar" }, [this.queueLabel()]);
    this.assignVisibility();
    dispatcher.rightSidebar = this;
  }

  assignVisibility = () =>
    dom.toggleClass(
      this.el,
      "right-sidebar-hidden",
      !uiState.isRightSidebarVisible
    );

  queueLabel = () =>
    div({ className: "right-sidebar-label", textContent: "Current Queue" });

  viewQueue = (parentItem: MyItem, queueItems: YoutubeVideo[]) => {
    dom.setChildren(
      this.el,
      [
        this.queueLabel(),
        div({
          className: "right-sidebar-queue-title",
          textContent: parentItem.title,
        }),
      ].concat(queueItems.map(this.viewItem))
    );
  };

  viewItem = (item: YoutubeVideo) =>
    div(
      {
        id: "queue-item-" + item.id,
        className: "right-sidebar-item",
        onClick: () => playerState.playItemInQueue(item),
      },
      [
        img({
          className: "right-sidebar-item-image",
          src: itemsStore.getPreviewImage(item),
        }),
        div({
          className: "right-sidebar-item-title",
          textContent: item.title,
        }),
      ]
    );

  playItemInQueue = (item: YoutubeVideo) => {
    const elem = document.getElementById("queue-item-" + item.id);
    if (elem) {
      if (this.currentQueueItemBeingPlayed)
        dom.removeClass(
          this.currentQueueItemBeingPlayed,
          "right-sidebar-queue-title_currentlyPlayed"
        );
      this.currentQueueItemBeingPlayed = elem;
      dom.addClass(
        this.currentQueueItemBeingPlayed,
        "right-sidebar-queue-title_currentlyPlayed"
      );
    } else {
      throw new Error(
        `No item ${item} exist in the queue, so I can't highlight it`
      );
    }
  };
}

style.class("right-sidebar", {
  //relative positioning because of 'current queue' label
  position: "relative",
  gridArea: "rightSidebar",
  backgroundColor: colors.leftSidebar,
  boxShadow: "rgb(0 0 0 / 20%) -2px 0px 2px",
  overflowX: "hidden",
  overflowY: "overlay",
  paddingBottom: 10,
  width: 250,
  transition: css.transition({ width: timings.sidebarCollapse }),
  zIndex: zIndexes.rightSidebar,
});

style.class("right-sidebar-label", {
  position: "absolute",
  top: 5,
  right: 10,
  fontSize: 11,
  fontStyle: "italic",
  color: colors.disabledTextColor,
});

style.class("right-sidebar-hidden", {
  width: 0,
});

style.class("right-sidebar-item", {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: css.padding(2, 5),
});

style.classHover("right-sidebar-item", {
  backgroundColor: colors.itemHover,
});

style.class("right-sidebar-queue-title_currentlyPlayed", {
  backgroundColor: colors.itemSelected,
});

style.class("right-sidebar-queue-title", {
  padding: css.padding(10, 5),
  paddingTop: 15,
  fontSize: 16,
  fontWeight: "bold",
});

style.class("right-sidebar-item-title", {
  fontSize: 13,
  whiteSpace: "nowrap",
});

style.class("right-sidebar-item-image", {
  width: 32,
  height: 32,
  objectFit: "cover",
  borderRadius: 4,
  marginRight: 4,
});

css.createScrollStyles("right-sidebar", {
  scrollbar: {
    width: 8,
  },
  thumb: {
    backgroundColor: colors.scrollThumb,
  },
});
