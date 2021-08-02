import { dom, div, button, style } from "../../src/browser";
import { spacings } from "../../src/designSystem";
import { colors } from "../designSystem";
import { dispatcher, store } from "../globals";

export class Header {
  el: HTMLElement;
  themeButton = dom.createRef("button");

  constructor() {
    this.el = div(
      { className: "header" },
      button({ text: "search", onClick: () => store.toggleSearchVisibility() }),
      dom.elem("button", {
        onClick: () => store.toggleTheme(),
        ref: this.themeButton,
      })
    );
    this.assignThemeButtonText();
    dispatcher.header = this;
  }

  assignThemeButtonText = () => {
    this.themeButton.elem.textContent =
      store.theme == "dark" ? "Switch to light" : "Switch to dark";
  };
}

style.class("header", {
  gridArea: "header",
  height: spacings.headerHeight,
  backgroundColor: colors.header,
  boxShadow: `0 0 6px 2px ${colors.menuShadow}`,
});
