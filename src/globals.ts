import { CommandsDispatcher } from "./dispatcher";
import { ItemsStore as ItemsStore } from "./domain/itemsStore";
import { Shortcuts } from "./domain/shortcuts";
import { UIState } from "./domain/uiState";
import Dnd from "./view/dnd";

export const dispatcher = new CommandsDispatcher();
export const dnd = new Dnd();
export const itemsStore = new ItemsStore(dispatcher.dispatchCommand);
export const uiState = new UIState(dispatcher.dispatchCommand, itemsStore);
const shortcuts = new Shortcuts(uiState);
