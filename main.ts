import { initFirebase, loadUserSettings } from "./src/api/userState";
import { sampleUserName } from "./src/api/config";
import { viewTree } from "./src/app/tree";
import { div, style } from "./src/browser";
import {
  createFolder,
  createChannel,
  createPlaylist,
  createVideo,
  Item,
} from "./src/domain/item";
import { itemsStore } from "./src/app/stores";

initFirebase(() => {
  loadUserSettings(sampleUserName).then((data) => {
    const items: LegacyItems = JSON.parse(data.itemsSerialized);
    const root: Item = createFolder(
      "HOME",
      items["HOME"].children!.map((id) => mapItem(items, items[id]))
    );

    itemsStore.root = root;

    document.body.appendChild(
      div({ className: "app" }, div({ className: "tab" }, viewTree()))
    );
  });
});

//converting legacy items to a new format
const mapItem = (items: LegacyItems, item: LegacyItem): Item => {
  const children = item.children
    ? item.children
        .filter((id) => items[id])
        .map((id) => mapItem(items, items[id]))
    : [];
  const res =
    item.type === "YTchannel"
      ? createChannel(item.title, item.image, item.channelId)
      : item.type === "YTplaylist"
      ? createPlaylist(item.title, item.image, item.playlistId)
      : item.type === "YTvideo"
      ? createVideo(item.title, item.videoId)
      : createFolder(item.title, children);

  //@ts-expect-error
  res.isOpen = !item.isCollapsedInGallery;
  return res;
};

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
