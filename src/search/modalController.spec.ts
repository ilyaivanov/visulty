import { folder } from "../api/dummyUserState";
import { createAppEvents } from "../events";
import { Item } from "../items";
import { ModalView, SearchModalController } from "./modalController";

describe("When modal window is shown while having", () => {
  let onPlay: Action<Item>;
  let onFocus: Action<Item>;
  let onDismiss: Action<void>;
  let viewMock: ViewMock;

  const events = createAppEvents();

  const root = new Item(
    folder({
      id: "HOME",
      children: [folder("aaa"), folder("bbb"), folder("aa"), folder("bb")],
    }),
    events
  );

  const matchingItem1 = root.children![0];
  const matchingItem2 = root.children![2];

  beforeEach(() => {
    onPlay = jest.fn();
    onFocus = jest.fn();
    onDismiss = jest.fn();
    viewMock = createViewMock();
    new SearchModalController(viewMock, {
      getRoot: () => root,
      onFocus,
      onPlay,
      onDismiss,
    });
  });

  describe("having 'aa' on input value", () => {
    beforeEach(() => viewMock.triggerInput("aa"));

    it("shows two items with aa in their title", () => {
      haveLastBeenCalledWith(viewMock.setSearchResults, {
        term: "aa",
        items: [
          {
            item: matchingItem1,
            highlights: [{ from: 0, to: 2 }],
          },
          {
            item: matchingItem2,
            highlights: [{ from: 0, to: 2 }],
          },
        ],
      });
    });

    it("selects first item", () => {
      haveLastBeenCalledWith(viewMock.selectItem, matchingItem1);
    });

    describe("pressing down", () => {
      beforeEach(() => viewMock.triggerKeyDown({ key: "ArrowDown" }));
      it("selects second and unselects first", () => {
        viewMock.triggerKeyDown({ key: "ArrowDown" });
        haveLastBeenCalledWith(viewMock.unselectItem, matchingItem1);
        haveLastBeenCalledWith(viewMock.selectItem, matchingItem2);
      });

      it("pressing up selects first and unselects second", () => {
        viewMock.triggerKeyDown({ key: "ArrowUp" });
        haveLastBeenCalledWith(viewMock.selectItem, matchingItem1);
        haveLastBeenCalledWith(viewMock.unselectItem, matchingItem2);
      });
    });

    it("on escape modal is dismissed", () => {
      viewMock.triggerKeyDown({ key: "Escape" });
      haveBeenCalled(viewMock.dismissModal);
      haveBeenCalled(onDismiss);
    });

    it("on enter items is focused and modal is dismissed", () => {
      viewMock.triggerKeyDown({ key: "Enter" });
      haveBeenCalledWith(onFocus, matchingItem1);
      haveBeenCalled(onDismiss);
    });

    it("on enter with ctrl items is played", () => {
      viewMock.triggerKeyDown({ key: "Enter", ctrlKey: true });
      haveBeenCalledWith(onPlay, matchingItem1);
    });
  });
});

type ViewMock = ModalView & {
  triggerInput(value: string): void;
  triggerKeyDown(props: KeyboardEventInit): void;
  triggerItemClick(item: Item): void;
};
const createViewMock = (): ViewMock => {
  let onInput: Action<string>;
  let onKeyDown: Action<KeyboardEvent>;
  let onItemClick: Action<Item>;
  return {
    onInput: (cb) => (onInput = cb),
    triggerInput: (value) => onInput(value),

    onKeyDown: (cb) => (onKeyDown = cb),
    triggerKeyDown: (props: KeyboardEventInit) =>
      onKeyDown(new KeyboardEvent("keydown", props)),

    onItemClick: (cb) => (onItemClick = cb),
    triggerItemClick: (item) => onItemClick(item),

    render: jest.fn(),
    dismissModal: jest.fn(),
    focusOnInput: jest.fn(),
    selectItem: jest.fn(),
    setSearchResults: jest.fn(),
    unselectItem: jest.fn(),
  };
};
