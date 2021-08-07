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

type LocalSearchResults = {
  items: LocalSearchEntry[];
  term: string;
};
type LocalSearchEntry = { item: MyItem; highlights: Highlight[] };

type TermsFound = { term: string; foundAt: number };
type Highlight = { from: number; to: number };
