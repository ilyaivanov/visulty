import { dom, div, style, button } from "../browser";
import { spacings } from "../designSystem";
import { youtubeIframeId } from "../api/youtubePlayer";
import { colors } from "../designSystem";
import { uiState } from "../globals";

export class Footer {
  el: HTMLElement;

  constructor() {
    this.el = div({ className: "player" }, [
      dom.elem("div", { id: youtubeIframeId }),
      button({
        textContent: "queue",
        onClick: () => uiState.toggleRightSidebarVisibility(),
      }),
    ]);
  }
}

style.class("player", {
  position: "relative",
  gridArea: "player",
  height: spacings.playerFooterHeight,
  backgroundColor: colors.footer,
  boxShadow: `0 0 6px 2px ${colors.menuShadow}`,
});

style.id(youtubeIframeId, {
  position: "absolute",
  right: 20,
  bottom: spacings.playerFooterHeight + 20,
  width: 400,
  height: 150,
});
