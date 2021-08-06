import { UIState } from "./uiState";

describe("Having a default UI State", () => {
  let uiState: UIState;
  let commandsLogger: ReturnType<typeof createLoggingDispatcher>;

  beforeEach(() => {
    commandsLogger = createLoggingDispatcher();
    uiState = new UIState((c) => commandsLogger.dispatch(c), undefined as any);
  });

  it("selecting an item dispatch select command", () => {
    const item = createDummyItem("my-item");
    uiState.select(item);
    expectEqual(commandsLogger.commands, [{ type: "item-selected", item }]);
  });

  it("selecting items at first, then selecting second item dispatch select/unselect commands", () => {
    const item1 = createDummyItem("my-item1");
    uiState.select(item1);
    commandsLogger.clearLogs();

    const item2 = createDummyItem("my-item2");
    uiState.select(item2);
    expectEqual(commandsLogger.commands, [
      { type: "item-unselected", item: item1 },
      { type: "item-selected", item: item2 },
    ]);
  });

  it("selecting child of SEARCH root switches focus on search", () => {
    expectEqual(uiState.tabFocused, "main");

    const searchItem = createDummyItem("my-item2");
    searchItem.parent = createDummyItem("SEARCH");

    uiState.select(searchItem);

    expectEqual(uiState.tabFocused, "search");
  });

  it("Selecting one item in main, then selecting another in search, when switching focus to main it should select first", () => {
    const item1 = createDummyItem("my-item1");
    item1.parent = createDummyItem("HOME");
    uiState.select(item1);

    expectEqual(uiState.tabFocused, "main");

    const item2 = createDummyItem("my-item2");
    item2.parent = createDummyItem("SEARCH");
    uiState.select(item2);
    expectEqual(uiState.tabFocused, "search");

    commandsLogger.clearLogs();

    uiState.focusOnTab("main");
    expectEqual(commandsLogger.commands, [
      { type: "item-unselected", item: item2 },
      { type: "item-selected", item: item1 },
    ]);
  });
});

const createLoggingDispatcher = () => ({
  commands: [] as DomainCommand[],
  dispatch(command: DomainCommand) {
    this.commands.push(command);
  },
  clearLogs() {
    this.commands = [];
  },
});

const expectEqual = <T>(a: T, b: T) => expect(a).toEqual(b);

const createDummyItem = (id: string): MyItem =>
  ({
    id,
  } as MyItem);
