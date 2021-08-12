import { dom, div, style, button, css } from "../browser";
import { icons, spacings } from "../designSystem";
import { youtubeIframeId } from "../api/youtubePlayer";
import { colors } from "../designSystem";
import { uiState } from "../globals";

export class Footer {
  el: HTMLElement;

  constructor() {
    this.el = div({ className: "player" }, [
      dom.elem("div", { id: youtubeIframeId }),

      this.icon(icons.playNext, () => 42, ["footer-icon-play-previous"]),
      this.icon(icons.play, () => 42),
      this.icon(icons.playNext, () => 42),
      this.icon(icons.playlist, () => 42),
      this.icon(icons.videoHide, () => 42),
    ]);
  }

  icon = (
    fn: typeof icons.videoHide,
    onClick: Action<MouseEvent>,
    classNames?: ClassName[]
  ) =>
    div({ className: "footer-icon-container", onClick }, [
      fn({ className: "footer-icon", classNames }),
    ]);
}

style.class("player", {
  position: "relative",
  gridArea: "player",
  height: spacings.playerFooterHeight,
  backgroundColor: colors.footer,
  boxShadow: `0 0 6px 2px ${colors.menuShadow}`,
  display: "flex",
  alignItems: "center",
});

style.id(youtubeIframeId, {
  position: "absolute",
  right: 20,
  bottom: spacings.playerFooterHeight + 20,
  width: 400,
  height: 150,
});

style.class("footer-icon", {
  width: 25,
  height: 25,
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
  marginLeft: 20,
  transition: css.transition({ backgroundColor: 120, boxShadow: 120 }),
});

style.classHover("footer-icon-container", {
  backgroundColor: "#F5F5F5",
  boxShadow: "rgba(0,0,0,0.5) 1px 2px 2px 0px",
});
style.classActive("footer-icon-container", {
  backgroundColor: "#E0E0E0",
});
