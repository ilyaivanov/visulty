import { initFirebase, loadUserSettings } from "./src/api/userState";
import { sampleUserName } from "./src/api/config";
import {
  createFolder,
  createChannel,
  createPlaylist,
  createVideo,
  Item,
} from "./src/domain/item";
import { itemsStore } from "./src/app/stores";
import { viewApp } from "./src/app/app";

initFirebase(() => {
  loadUserSettings(sampleUserName).then((data) => {
    const items: LegacyItems = JSON.parse(data.itemsSerialized);
    const root: Item = createFolder(
      "HOME",
      items["HOME"].children!.map((id) => mapItem(items, items[id]))
    );

    itemsStore.homeRoot = root;

    document.body.appendChild(viewApp());
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
