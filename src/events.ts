import { Item } from "./items/item";
type ItemEventDefinitions = {
  itemRemoved: { item: Item; isInstant: boolean };
  itemToggled: Item;
  emptyEvent: undefined;
};

export class AppEvents {
  private itemCbs: Partial<Record<keyof ItemEventDefinitions, Action<Item>[]>> =
    {};

  on = <T extends keyof ItemEventDefinitions>(
    event: T,
    cb: Action<ItemEventDefinitions[T]>
  ) => {
    if (!this.itemCbs[event]) this.itemCbs[event] = [];
    this.itemCbs[event]!.push(cb as any);
  };

  trigger = <T extends keyof ItemEventDefinitions>(
    event: T,
    data: ItemEventDefinitions[T]
  ) => {
    const cbs = this.itemCbs[event] || [];
    cbs!.forEach((cb) => (cb as any)(data));
  };
}
