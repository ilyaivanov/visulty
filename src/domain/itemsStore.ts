import { makeAutoObservable } from "mobx";
import {
  createChannel,
  createFolder,
  createPlaylist,
  createVideo,
  Item,
} from "./item";
import { ItemReactions } from "./itemAutorun";

export class ItemsStore {
  root = createFolder("HOME", [
    createFolder("first", [
      createFolder("first 1"),
      createFolder("first 2"),
      createFolder("first 3", [
        createFolder("first 3,1"),
        createFolder("first 3.2"),
      ]),
    ]),
    createFolder("Channels", [
      createChannel(
        "Better Ideas",
        "https://yt3.ggpht.com/ytc/AAUvwnirbpqnd7FV8ShzIbByyOesFZLgwwIwl8luimDv=s240-c-k-c0xffffffff-no-rj-mo"
      ),
      createChannel(
        "Veritasium",
        "https://yt3.ggpht.com/ytc/AAUvwnjBJR7xS-yf4Mwz7GJ4y6rWceVa1LkGQpPnaTyyCw=s240-c-k-c0xffffffff-no-rj-mo"
      ),
      createChannel(
        "Vsauce",
        "https://yt3.ggpht.com/ytc/AAUvwnhZ3RdTd90CWLjszcugYGMU4I72zJAVkphAfSflTQ=s240-c-k-c0xffffffff-no-rj-mo"
      ),
    ]),
    createFolder("Podcats", [
      createVideo(
        "How Foods and Nutrients Control Our Moods | Huberman Lab Podcast #11",
        "XfURDjegrAw"
      ),
      createVideo(
        "How to Increase Motivation & Drive | Huberman Lab Podcast #12",
        "vA50EK70whE"
      ),
    ]),
    createFolder("Music", [
      createPlaylist(
        "Xenia (Radio Intense)",
        "https://i.ytimg.com/vi/r-BxA8TFSfg/mqdefault.jpg"
      ),
      createPlaylist(
        "Miss Monique (Radio Intense)",
        "https://i.ytimg.com/vi/mNF9eMOuSUk/mqdefault.jpg"
      ),
    ]),
    createFolder("fourth"),
    createFolder("fifth"),
  ]);

  constructor() {
    makeAutoObservable(this, {
      //root is never changed
      root: false,
    });
  }

  toggleItem = (item: Item) => {
    item.isOpen = !item.isOpen;
    this.itemAutoruns.disposeItemReactions(item);
  };

  private itemAutoruns = new ItemReactions();

  itemAutorun = this.itemAutoruns.itemAutorun;
  itemReaction = this.itemAutoruns.itemReaction;
}
