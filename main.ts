import { deserializeRootItem } from "./src/api/userState";
import { sampleUserName } from "./src/api/config";
import { style } from "./src/browser";
import { createThemeStyles } from "./src/designSystem";
import { APIGateway, FakeAPIGateweay } from "./src/api";
import { viewApp } from "./src/app";
import { AppEvents } from "./src/events";
import { Item } from "./src/items";

// app.renderInto(document.body);
createThemeStyles();

const USE_REAL_API = false;
const api = USE_REAL_API ? new APIGateway() : new FakeAPIGateweay();

const events = new AppEvents();
viewApp(document.body, events);

api
  .initFirebare()
  .then(() => api.loadUserSettings(sampleUserName))
  .then((data: MappedPersistedState) => {
    events.trigger("stateLoaded", new Item(data.root, events));
  });

style.tag("body", {
  margin: 0,
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});
