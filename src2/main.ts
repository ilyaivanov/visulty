import { style } from "../src/browser";
import { store } from "./globals";
import { ItemView } from "./view/itemView";

document.body.appendChild(ItemView.viewChildrenFor(store.root));

style.tag("body", {
  color: "white",
  backgroundColor: "#1E1E1E",
  margin: 0,
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});
