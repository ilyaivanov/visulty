import { Item } from "./items/item";

type ItemEventDefinitions = {
  itemRemoved: { item: Item; isInstant: boolean };
  stateLoaded: Item;

  itemToggled: Item;
  toggleSidebar: void;

  themeToggled: AppTheme;
  toggleTheme: void;
};

export class AppEvents {
  private itemCbs: Partial<Record<keyof ItemEventDefinitions, Action<Item>[]>> =
    {};

  on<T extends keyof ItemEventDefinitions>(
    type: T,
    cb: Callback<ItemEventDefinitions[T]>
  ) {
    if (!this.itemCbs[type]) this.itemCbs[type] = [];
    this.itemCbs[type]!.push(cb as any);
  }

  trigger<T extends keyof ItemEventDefinitions>(
    ...args: TriggerArgs<T, ItemEventDefinitions[T]>
  ) {
    const [type, event] = args;
    const cbs = this.itemCbs[type] || [];
    cbs!.forEach((cb) => (cb as any)(event));
  }
}

//Helper types for Events
type Callback<T> = T extends void ? EmptyAction : Action<T>;

type TriggerArgs<TKey, TVal> = TVal extends void
  ? [type: TKey]
  : [type: TKey, event: TVal];
