import { initFirebase, loadUserSettings } from "./src2/api/userState";
import { sampleUserName } from "./src2/api/config";
import { style } from "./src2/browser";
import { viewApp } from "./src2/view/app";
import { store } from "./src2/globals";
import { createThemeStyles } from "./src2/designSystem";
import { dummyRoot } from "./src2/api/dummyUserState";

createThemeStyles();

const USE_REAL_API = true;

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
    store.root = dummyRoot;
    document.body.appendChild(viewApp());
  }
});

style.tag("body", {
  color: "white",
  margin: 0,
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});
