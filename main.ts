import { sampleUserName } from "./src/api/config";
import { style } from "./src/browser";
import { createThemeStyles } from "./src/designSystem";
import { APIGateway, FakeAPIGateweay, Gateway } from "./src/api";
import { viewApp } from "./src/app";
import { createAppEvents } from "./src/events";
import { Item } from "./src/items";
import { listenToLoadEvents } from "./src/api/itemsLoader";
import { initShortcuts } from "./src/shortcuts";
import { initSearch } from "./src/search";

createThemeStyles();

const USE_REAL_API = true;
const api: Gateway = USE_REAL_API ? new APIGateway() : new FakeAPIGateweay();

const events = createAppEvents();
viewApp(document.body, events, api);

listenToLoadEvents(events, api);
initShortcuts(events);
initSearch(events);
api
  .initFirebare()
  .then(() => api.loadUserSettings(sampleUserName))
  .then((data) => events.trigger("stateLoaded", new Item(data.root, events)));

style.tag("body", {
  margin: 0,
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});
