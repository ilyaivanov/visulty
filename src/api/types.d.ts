type PersistedState = {
  selectedItemId: string;
  focusedStack: string[];
  itemsSerialized: string;
  ui?: {
    leftSidebarWidth: number;
  };
};

type LegacyItem = {
  id: string;
  title: string;
  children?: string[];
} & (
  | {
      type: "YTplaylist";
      playlistId: string;
      image: string;
    }
  | {
      type: "YTchannel";
      channelId: string;
      image: string;
    }
  | {
      type: "YTvideo";
      videoId: string;
    }
  | {
      type: "folder";
      videoId: string;
    }
);

type LegacyItems = Record<string, LegacyItem>;
