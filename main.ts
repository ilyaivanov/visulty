import { viewTree } from "./src/app/tree";
import { dom, style } from "./src/browser";

document.body.appendChild(
  dom.div({
    className: "app",
    children: [dom.div({ className: "tab", children: [viewTree()] })],
  })
);

style.class("app", {
  color: "white",
  backgroundColor: "#1E1E1E",
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
});

style.tag("body", {
  margin: 0,
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});

style.class("tab", {
  flex: 1,
  overflowY: "overlay",
  paddingBottom: "20vh",
});
