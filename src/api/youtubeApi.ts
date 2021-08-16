const API_HOST = "https://europe-west1-slapstuk.cloudfunctions.net";
// const API_HOST = "http://localhost:5001/slapstuk/europe-west1";

export const loadSearchResults = ({
  term,
  nextPageToken,
}: SearchRoot): Promise<MappedResponse> => {
  verifyNonTestEnvironment();
  let url = `${API_HOST}/getVideos?q=${term}`;
  if (nextPageToken) url += `&pageToken=${nextPageToken}`;
  return fetch(url)
    .then((res) => res.json() as Promise<YoutubeSearchResponse>)
    .then(createMappedResponse);
};

export const loadPlaylistItems = (
  playlistId: string,
  pageToken?: string
): Promise<MappedResponse> => {
  verifyNonTestEnvironment();
  let url = `${API_HOST}/getPlaylistItems?playlistId=${playlistId}`;

  if (pageToken) url += `&pageToken=${pageToken}`;
  return fetch(url)
    .then((res) => res.json() as Promise<YoutubePlaylistDetailsResponse>)
    .then(createMappedResponse);
};

export const loadChannelItems = (
  item: YoutubeChannel
): Promise<MappedResponse> => {
  verifyNonTestEnvironment();
  if (!item.nextPageToken) {
    return Promise.all([
      getChannelUploadsPlaylistId(item),
      getChannelPlaylists(item.channelId),
    ]).then(([uploadPlaylist, response]) => ({
      items: ([uploadPlaylist] as ResponseItem[])
        .concat(response.items)
        .map(mapResponseItem),
      nextPageToken: response.nextPageToken,
    }));
  } else {
    return getChannelPlaylists(item.channelId, item.nextPageToken).then(
      createMappedResponse
    );
  }
};

const getChannelPlaylists = (
  channelId: string,
  pageToken?: string
): Promise<YoutubeChannelPlaylistsResponse> => {
  let url = `${API_HOST}/getChannelPlaylists?part=snippet&channelId=${channelId}`;
  if (pageToken) url += `&pageToken=${pageToken}`;
  return fetch(url).then((res) => res.json());
};

const getChannelUploadsPlaylistId = (
  channel: YoutubeChannel
): Promise<PlaylistResponseItem> => {
  let url = `${API_HOST}/getChannelVideos?channelId=${channel.channelId}`;
  return fetch(url)
    .then((res) => res.json() as Promise<YoutubeChannelUploadPlaylistResponse>)
    .then((res) => {
      const responseItem: PlaylistResponseItem = {
        itemType: "playlist",
        channelId: channel.channelId,
        channelTitle: channel.title,
        id: Math.random() + "",
        image: channel.image,
        itemId: res.playlistId,
        name: channel.title + " Uploads",
      };
      return responseItem;
    });
};

export const findSimilarYoutubeVideos = (
  videoId: string,
  pageToken?: string
) => {
  verifyNonTestEnvironment();
  let url = `${API_HOST}/getVideos?relatedToVideoId=${videoId}&type=video`;

  if (pageToken) url += `&pageToken=${pageToken}`;
  return fetch(url).then((res) => res.json());
};

const verifyNonTestEnvironment = () => {
  if (process.env.NODE_ENV === "test")
    throw new Error("Tried to execute real API call from tests");
};

type YoutubeSearchResponse = {
  items: ResponseItem[];
  nextPageToken?: string;
};

type YoutubePlaylistDetailsResponse = {
  items: ResponseItem[];
  nextPageToken?: string;
};

type YoutubeChannelPlaylistsResponse = {
  items: ResponseItem[];
  nextPageToken?: string;
};

export type MappedResponse = {
  items: MyItem[];
  nextPageToken?: string;
};

export type YoutubeChannelUploadPlaylistResponse = {
  playlistId: string;
};

export type ResponseItem =
  | VideoResponseItem
  | ChannelResponseItem
  | PlaylistResponseItem;

type VideoResponseItem = {
  itemType: "video";
  id: string;
  image: string;
  channelTitle: string;
  channelId: string;
  itemId: string;
  name: string;
};
type ChannelResponseItem = {
  itemType: "channel";
  id: string;
  image: string;
  itemId: string;
  name: string;
};
type PlaylistResponseItem = {
  itemType: "playlist";
  id: string;
  image: string;
  itemId: string;
  name: string;
  channelTitle: string;
  channelId: string;
};

const createMappedResponse = (
  response: YoutubeSearchResponse
): MappedResponse => ({
  items: response.items.map(mapResponseItem),
  nextPageToken: response.nextPageToken,
});

const mapResponseItem = (item: ResponseItem): MyItem => {
  if (item.itemType === "video")
    return {
      type: "YTvideo",
      id: item.id,
      title: item.name,
      videoId: item.itemId,
    };
  else if (item.itemType === "channel")
    return {
      type: "YTchannel",
      id: item.id,
      title: item.name,
      channelId: item.itemId,
      image: item.image,
      isOpen: false,
    };
  else
    return {
      type: "YTplaylist",
      id: item.id,
      title: item.name,
      playlistId: item.itemId,
      image: item.image,
      isOpen: false,
    };
};
