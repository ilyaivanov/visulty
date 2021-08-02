import { initFirebase, loadUserSettings } from "./api/userState";
import { sampleUserName } from "./api/config";
import { style } from "../src/browser";
import { viewApp } from "./view/app";
import { store } from "./globals";
import { createThemeStyles } from "./designSystem";

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

      store.root = root;

      document.body.appendChild(viewApp());
    });
  } else {
    document.body.appendChild(viewApp());
  }
});

style.tag("body", {
  color: "white",
  margin: 0,
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});
