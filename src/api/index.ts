import { MappedResponse } from "./youtubeApi";
import * as youtubeAPI from "./youtubeApi";
import * as userState from "./userState";
import { dummyRoot } from "./dummyUserState";

export interface Gateway {
  initFirebare(): Promise<void>;
  loadUserSettings(userId: string): Promise<PersistedState>;
  saveUserSettings(state: PersistedState, userId: string): void;

  loadSearchResults(searchRoot: SearchRoot): Promise<MappedResponse>;
  loadPlaylistItems(
    playlistId: string,
    pageToken?: string
  ): Promise<MappedResponse>;
  loadChannelItems(channel: YoutubeChannel): Promise<MappedResponse>;
}

export class APIGateway implements Gateway {
  initFirebare = () => {
    return new Promise(((resolve: () => void) => {
      userState.initFirebase(() => resolve());
    }) as any) as any; //TODO: fuck me, how to type empty Promise?
  };

  loadUserSettings = userState.loadUserSettings;

  saveUserSettings = userState.saveUserSettings;

  loadSearchResults = youtubeAPI.loadSearchResults;

  loadPlaylistItems = youtubeAPI.loadPlaylistItems;

  loadChannelItems = youtubeAPI.loadChannelItems;
}

export class FakeAPIGateweay implements Gateway {
  initFirebare(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  }
  loadUserSettings(): Promise<PersistedState> {
    console.log(dummyRoot);
    return Promise.resolve({
      itemsSerialized: JSON.stringify(dummyRoot),
    });
  }
  saveUserSettings(state: PersistedState): void {
    throw new Error("Method not implemented.");
  }
  loadSearchResults(searchRoot: SearchRoot): Promise<MappedResponse> {
    throw new Error("Method not implemented.");
  }
  loadPlaylistItems(
    playlistId: string,
    pageToken?: string
  ): Promise<MappedResponse> {
    throw new Error("Method not implemented.");
  }
  loadChannelItems(channel: YoutubeChannel): Promise<MappedResponse> {
    throw new Error("Method not implemented.");
  }
}
