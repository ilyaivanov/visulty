import { deserializeRootItem } from "./src/api/userState";
import { sampleUserName } from "./src/api/config";
import { style } from "./src/browser";
import { createThemeStyles } from "./src/designSystem";
import { APIGateway, FakeAPIGateweay } from "./src/api";
import { App } from "./src/app";

// app.renderInto(document.body);
createThemeStyles();

const USE_REAL_API = false;
const api = USE_REAL_API ? new APIGateway() : new FakeAPIGateweay();

api
  .initFirebare()
  .then(() => api.loadUserSettings(sampleUserName))
  .then((data: PersistedState) => {
    const container = document.getElementById("loader-container");

    if (container)
      container
        .animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 })
        .addEventListener("finish", () => {
          container.remove();
        });
    const app = new App(document.body);
    app.renderInto(document.body, deserializeRootItem(data.itemsSerialized));
  });

style.tag("body", {
  margin: 0,
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});
