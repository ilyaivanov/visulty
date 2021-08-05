import { dom, div, button, style } from "../browser";
import { spacings, colors } from "../designSystem";
import { dispatcher, store } from "../globals";

export class Header {
  el: HTMLElement;
  themeButton = dom.createRef("button");

  constructor() {
    this.el = div({ className: "header" }, [
      button({
        textContent: "search",
        onClick: () => store.toggleSearchVisibility(),
      }),
      dom.elem("button", {
        onClick: () => store.toggleTheme(),
        ref: this.themeButton,
      }),
    ]);
    this.assignThemeButtonText();
    dispatcher.header = this;
  }

  assignThemeButtonText = () => {
    this.themeButton.elem.textContent =
      store.theme == "dark" ? "Switch to light" : "Switch to dark";
  };
}

style.class("header", {
  //relative positioning for youtu9ve iframe player
  position: "relative",
  gridArea: "header",
  height: spacings.headerHeight,
  backgroundColor: colors.header,
  boxShadow: `0 0 6px 2px ${colors.menuShadow}`,
});

//I can't really recall why I used pseudoelement for shadows here
//leaveing code in case i will need it
// style.after("header", {
//   position: "absolute",
//   left: 0,
//   right: 0,
//   top: "100%",
//   height: 4,
//   content: `" "`,
//   background: `linear-gradient(
//     rgba(9, 30, 66, 0.13) 0px,
//     rgba(9, 30, 66, 0.13) 1px,
//     rgba(9, 30, 66, 0.08) 1px,
//     rgba(9, 30, 66, 0) 4px)`,
// });
