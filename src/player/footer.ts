import { dom, div, style, css, img, span } from "../browser";
import { icons, spacings, colors, timings, zIndexes } from "../designSystem";
import { youtubeIframeId } from "../api/youtubePlayer";
import { getItemPath, getPreviewImage } from "../items";
import { dispatcher, playerState, uiState } from "../globals";

export class Footer {
  el: HTMLElement;

  textArea = dom.createRef("div");
  youtubePlayer = dom.createRef("div");
  targetText = dom.createRef("div");
  constructor() {
    this.el = div({ className: "player" }, [
      div({
        id: youtubeIframeId,
        className: "player-iframe",
        ref: this.youtubePlayer,
      }),

      this.icon(icons.playNext, () => playerState.playPreviousItemInQueue(), [
        "footer-icon-play-previous",
      ]),
      this.icon(icons.play, () => 42),
      this.icon(icons.playNext, () => playerState.playNextItemInQueue()),
      div({ className: "text-area", ref: this.textArea }),
      this.icon(icons.videoHide, () =>
        playerState.toggleVideoFrameVisibility()
      ),
      this.icon(icons.playlist, () => uiState.toggleRightSidebarVisibility()),
      this.viewProgress(),
    ]);
    this.onRightSidebarVisibilityChanged();
    dispatcher.footer = this;
  }

  itemPlayed = (item: MyItem) => {
    dom.setChildren(this.textArea.elem, [
      img({
        className: "footer-video-image",
        src: getPreviewImage(item),
      }),

      div({ className: "text-area-titles-container" }, [
        this.viewPath(item),
        div({ textContent: item.title, className: "text-area-title" }),
      ]),
    ]);
  };

  viewPath = (item: MyItem) => {
    const pathElement = (pathItem: MyItem, index: number, paths: MyItem[]) => {
      const isLast = index == paths.length - 1;
      const res = [
        span({
          textContent: pathItem.title,
          className: "text-area-item-path-element",
          onClick: () => uiState.focusOnItem(pathItem),
        }),
      ];
      if (!isLast) res.push(span({ textContent: " > " }));
      return res;
    };
    return div(
      { className: "text-area-item-path" },
      getItemPath(item)
        .filter((i) => i != item)
        .map(pathElement)
        .flat()
    );
  };

  onVideoFrameVisibilityChanged = () =>
    dom.toggleClass(
      document.getElementById(youtubeIframeId)!,
      "player-iframeHidden",
      !playerState.isVideoFrameShown
    );

  onRightSidebarVisibilityChanged = () => {
    //using in case player has not yet been initialized
    const playerEl =
      document.getElementById(youtubeIframeId) || this.youtubePlayer.elem;
    if (playerEl) {
      const right =
        (uiState.isRightSidebarVisible
          ? spacings.rightSidebarDefaultWidth
          : 0) + 20;
      playerEl.style.right = right + "px";
    }
  };

  icon = (
    fn: typeof icons.videoHide,
    onClick: Action<MouseEvent>,
    classNames?: ClassName[]
  ) =>
    div({ className: "footer-icon-container", onClick }, [
      fn({ className: "footer-icon", classNames }),
    ]);

  viewProgress = () =>
    div(
      {
        className: "player-progress-container-padding",
        onMouseMove: (e) => {
          const assumedDuration = 2 * 60 + 31;
          const overallWidth = (e.currentTarget as HTMLDivElement).clientWidth;
          const width = this.targetText.elem.offsetWidth;
          const textPadding = 3;
          let position = clamp(
            e.clientX - width / 2,
            textPadding,
            overallWidth - width - textPadding
          );

          this.targetText.elem.style.left = position + "px";
          this.targetText.elem.textContent = formatTime(
            (e.clientX / overallWidth) * assumedDuration
          );
        },
      },
      [
        div({ className: "player-progress-container" }, [
          div({ className: "player-progress-buffer", style: { width: 400 } }),
          div(
            { className: "player-progress-ellapsed", style: { width: 200 } },
            [div({ className: "player-progress-bulp" })]
          ),

          div({
            className: "player-progress-text",
            ref: this.targetText,
          }),
        ]),
      ]
    );
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const padZeros = (val: number): string => (val < 10 ? "0" + val : "" + val);

  return `${padZeros(minutes)}:${padZeros(seconds)}`;
};

const clamp = (val: number, min: number, max: number): number => {
  if (val < min) return min;
  if (val > max) return max;
  return val;
};

style.class("player", {
  //relative because of player-progress indicator
  position: "relative",
  gridArea: "player",
  height: spacings.playerFooterHeight,
  backgroundColor: colors.footer,
  boxShadow: `0 0 6px 2px ${colors.menuShadow}`,
  display: "flex",
  alignItems: "center",
  paddingRight: 15,
  zIndex: zIndexes.footer,
});
const containerHeight = 3;
const containerHeightOnHover = 5;
style.class("player-progress-container", {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: containerHeight,
  backgroundColor: "rgba(0,0,0,0.1)",
});

style.class("player-progress-container-padding", {
  position: "absolute",
  left: 0,
  right: 0,
  top: -13,
  height: 16,
  cursor: "pointer",
});

style.class("player-progress-buffer", {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  backgroundColor: "#C2C2C2",
});

style.class("player-progress-ellapsed", {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  backgroundColor: colors.itemInnerCircle,
});

style.class("player-progress-text", {
  textShadow: `0 0 4px rgb(0 0 0 / 40%)`,
  position: "absolute",
  top: -25,
  color: colors.mainTextColor,
  fontWeight: "bold",
  fontSize: 14,
  opacity: 0,
  transition: css.transition({ opacity: 100 }),
});

const bulpDiameter = 13;
style.class("player-progress-bulp", {
  height: bulpDiameter,
  width: bulpDiameter,
  backgroundColor: colors.itemInnerCircle,
  borderRadius: bulpDiameter / 2,
  position: "absolute",
  right: -bulpDiameter / 2,
  top: -bulpDiameter / 2 + 2,
  transform: "scale(0)",
  transition: css.transition({ transform: 100 }),
});

style.parentHover(
  "player-progress-container-padding",
  "player-progress-container",
  {
    height: containerHeightOnHover,
    transform: `translateY(${
      (containerHeightOnHover - containerHeight) / 2
    }px)`,
  }
);

style.parentHover("player-progress-container-padding", "player-progress-text", {
  opacity: 1,
});

style.parentHover("player-progress-container-padding", "player-progress-bulp", {
  transform: "scale(1)",
});

style.class("player-iframe", {
  position: "absolute",
  right: 20,
  bottom: spacings.playerFooterHeight + 20,
  width: 400,
  height: 150,
  transform: css.translate(0, 0),
  transition: css.transition({
    right: timings.sidebarCollapse,
    opacity: 200,
    transform: 200,
  }),
});

style.class("player-iframeHidden", {
  opacity: 0,
  transform: css.translate(0, 15),
  pointerEvents: "none",
});

style.class("footer-icon", {
  width: 20,
  height: 20,
  color: colors.mainTextColor,
});

style.class("footer-icon-play-previous", {
  transform: "rotateZ(180deg)",
});

style.class("footer-icon-container", {
  cursor: "pointer",
  padding: 8,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  marginLeft: 15,
  transition: css.transition({ backgroundColor: 120, boxShadow: 120 }),
});

style.classHover("footer-icon-container", {
  backgroundColor: "#F5F5F5",
  boxShadow: "rgba(0,0,0,0.5) 1px 2px 2px 0px",
});
style.classActive("footer-icon-container", {
  backgroundColor: "#E0E0E0",
  boxShadow: "rgba(0,0,0,0.5) 1px 1px 1px 0px",
});

style.class("text-area", {
  flex: 1,
  paddingLeft: 8,
  paddingRight: 8,
  display: "flex",
});

style.class("text-area-titles-container", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

style.class("text-area-title", {
  fontSize: 15,
});

style.class("text-area-item-path", {
  fontSize: 13,
  color: colors.disabledTextColor,
  overflow: "hidden",
});

style.classHover("text-area-item-path-element", {
  cursor: "pointer",
  color: colors.mainTextColor,
  textDecoration: "underline",
});

style.class("footer-video-image", {
  width: 35,
  height: 35,
  marginRight: 8,
  marginTop: 2,
  borderRadius: 4,
  objectFit: "cover",
  display: "block",
});
