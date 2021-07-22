import { ItemsStore } from "./itemsStore";

it("having a opened root item when toggling it closes", () => {
  const store = new ItemsStore();

  expect(store.root.isOpen).toBe(true);

  store.toggleItem(store.root);

  expect(store.root.isOpen).toBe(false);
});
