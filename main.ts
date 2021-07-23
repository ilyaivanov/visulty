import { initFirebase, loadUserSettings } from "./src/api/userState";
import { sampleUserName } from "./src/api/config";
import {
  ChannelItem,
  FolderItem,
  PlaylistItem,
  VideoItem,
  Item,
} from "./src/domain/item";
import { itemsStore } from "./src/app/stores";
import { viewApp } from "./src/app/app";

initFirebase(() => {
  loadUserSettings(sampleUserName).then((data) => {
    const items: LegacyItems = JSON.parse(data.itemsSerialized);
    const root: Item = new FolderItem({
      title: "HOME",
      children: items["HOME"].children!.map((id) => mapItem(items, items[id])),
    });

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
      ? new ChannelItem({
          title: item.title,
          channelImage: item.image,
          channelId: item.channelId,
        })
      : item.type === "YTplaylist"
      ? new PlaylistItem({
          title: item.title,
          playlistImage: item.image,
          playlistId: item.playlistId,
        })
      : item.type === "YTvideo"
      ? new VideoItem({ title: item.title, videoId: item.videoId })
      : new FolderItem({ title: item.title, children });

  //@ts-expect-error
  res.isOpen = !item.isCollapsedInGallery;
  return res;
};
