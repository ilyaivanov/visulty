import { initFirebase, loadUserSettings } from "./src/api/userState";
import { sampleUserName } from "./src/api/config";
import { style } from "./src/browser";
import { viewApp } from "./src/view/app";
import { itemsStore, uiState } from "./src/globals";
import { createThemeStyles } from "./src/designSystem";
import { dummyRoot } from "./src/api/dummyUserState";
import * as itemsQueries from "./src/domain/itemQueries";

createThemeStyles();

const USE_REAL_API = true;

initFirebase(() => {
  if (USE_REAL_API) {
    loadUserSettings(sampleUserName).then((data) => {
      const legacyItems: LegacyItems = JSON.parse(data.itemsSerialized);

      const mapItem = (id: string): MyItem | undefined => {
        const legacy = legacyItems[id];
        if (!legacy) return;

        const item: MyItem = {
          ...legacy,
          //@ts-expect-error
          isOpen: !legacy.isCollapsedInGallery,
          children: legacy.children
            ? (legacy.children.map(mapItem).filter((x) => x) as MyItem[])
            : undefined,
        };

        return item;
      };
      const items = legacyItems["HOME"]
        .children!.map(mapItem)
        .filter((x) => x) as MyItem[];

      itemsQueries.assignChildrenTo(itemsStore.root, items);
      const firstChild = itemsQueries.getFirstChild(itemsStore.root);
      document.body.appendChild(viewApp());
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
