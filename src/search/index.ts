import { dom } from "../browser";
import { AppEvents } from "../events";
import { getMainRoot } from "../items/roots";
import { SearchModalController } from "./modalController";
import ModalViewImplementation from "./modalView";

export const initSearch = (events: AppEvents) => {
  const controller = new SearchModalController(new ModalViewImplementation(), {
    getRoot: getMainRoot,
    onDismiss: () => {
      events.trigger("shortcuts.listenToKeyboard");
    },
    onFocus: (item) => events.trigger("focusItem", item),
    onPlay: (item) => events.trigger("item.play", item),
  });
  events.on("localSearch.showModal", () => {
    events.trigger("shortcuts.stopListeningToKeyboard");
    controller.showModal(dom.getFirstElementWithClass(document.body, "app"));
  });
};
