export class MyEventSource<TEventsDefinition> {
  private itemCbs: Partial<Record<keyof TEventsDefinition, Action<any>[]>> = {};

  on<T extends keyof TEventsDefinition>(
    type: T,
    cb: Callback<TEventsDefinition[T]>
  ) {
    if (!this.itemCbs[type]) this.itemCbs[type] = [];
    this.itemCbs[type]!.push(cb as any);
  }

  //TODO: off events
  //currently i'm not unsubscribing because all features are specifically made static
  //but i will need to unsub from events when I will have paging

  trigger<T extends keyof TEventsDefinition>(
    ...args: TriggerArgs<T, TEventsDefinition[T]>
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
