type ItemBase = {
  id: string;
  title: string;
  isOpen?: boolean;
  isOpenInSidebar?: boolean;
  isLoading?: boolean;
  children?: MyItem[];
  parent?: MyItem;
};

type Folder = ItemBase & {
  type: "folder";
};

type YoutubeVideo = ItemBase & {
  type: "YTvideo";
  videoId: string;
};

type YoutubePlaylist = ItemBase & {
  type: "YTplaylist";
  playlistId: string;
  image: string;
};

type YoutubeChannel = ItemBase & {
  type: "YTchannel";
  channelId: string;
  image: string;
};

type MyItem = Folder | YoutubeVideo | YoutubePlaylist | YoutubeChannel;
