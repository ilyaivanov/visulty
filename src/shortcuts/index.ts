import { AppEvents } from "../events";

export const initShortcuts = (events: AppEvents) => {
  const onkeydown = (e: KeyboardEvent) => {
    console.log("onkeydown", e.key);
    if (e.key === "k" && e.ctrlKey) {
      e.preventDefault();
      events.trigger("localSearch.showModal");
    }
  };
  events.on("shortcuts.listenToKeyboard", () => {
    document.addEventListener("keydown", onkeydown);
  });

  events.on("shortcuts.stopListeningToKeyboard", () => {
    document.removeEventListener("keydown", onkeydown);
  });
};
