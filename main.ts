import { initFirebase, loadUserSettings } from "./src/api/userState";
import { sampleUserName } from "./src/api/config";
import { style } from "./src/browser";
import { viewApp } from "./src/view/app";
import { itemsStore } from "./src/globals";
import { createThemeStyles } from "./src/designSystem";
import { dummyRoot } from "./src/api/dummyUserState";

createThemeStyles();

const USE_REAL_API = false;

initFirebase(() => {
  if (USE_REAL_API) {
    loadUserSettings(sampleUserName).then((data) => {
      const items: LegacyItems = JSON.parse(data.itemsSerialized);

      const mapItem = (id: string): MyItem | undefined => {
        const legacy = items[id];
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
      const root: MyItem = {
        type: "folder",
        id: "HOME",
        title: "Home",
        children: items["HOME"]
          .children!.map(mapItem)
          .filter((x) => x) as MyItem[],
      };

      itemsStore.root = root;

      document.body.appendChild(viewApp());
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
