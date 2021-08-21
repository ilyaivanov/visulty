import { Gateway } from ".";
import { AppEvents } from "../events";
import { Item } from "../items";
import * as youtubeApi from "./youtubeApi";

export const listenToLoadEvents = (events: AppEvents, gateway: Gateway) => {
  events.on("item.loadChildren", (item) => {
    loadItem(item, gateway).then(({ nextPageToken, items }) => {
      item.childrenLoaded(items, nextPageToken);
    });
  });
  events.on("item.loadChildrenNextPage", (item) => {
    loadItem(item, gateway).then(({ nextPageToken, items }) => {
      item.pageLoaded(items, nextPageToken);
    });
  });
};

const loadItem = (
  item: Item,
  gateway: Gateway
): Promise<youtubeApi.MappedResponse> =>
  item.isSearch()
    ? gateway.loadSearchResults(item.props as SearchRoot)
    : item.isPlaylist()
    ? gateway.loadPlaylistItems(item.props as YoutubePlaylist)
    : item.isChannel()
    ? gateway.loadChannelItems(item.props as YoutubeChannel)
    : throwError(`Can't load ${item.title} of type ${item.props.type}`);

const throwError = (message: string) => {
  throw new Error(message);
};
