import {
  deserializeRootItem,
  initFirebase,
  loadUserSettings,
} from "./src/api/userState";
import { sampleUserName } from "./src/api/config";
import { style } from "./src/browser";
import { viewApp } from "./src/view/app";
import { itemsStore, uiState } from "./src/globals";
import { createThemeStyles } from "./src/designSystem";
import { dummyRoot } from "./src/api/dummyUserState";
import * as items from "./src/items";

createThemeStyles();

const USE_REAL_API = true;

initFirebase(() => {
  if (USE_REAL_API) {
    loadUserSettings(sampleUserName).then((data) => {
      itemsStore.root = deserializeRootItem(data.itemsSerialized);
      const firstChild = items.getFirstChild(itemsStore.root);
      document.body.appendChild(viewApp());
      uiState.focusOnItem(itemsStore.root);
      firstChild && uiState.select(firstChild);
    });
  } else {
    itemsStore.root = dummyRoot;
    document.body.appendChild(viewApp());
  }
});

style.tag("body", {
  margin: 0,
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});
