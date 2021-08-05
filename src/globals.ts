import { CommandsDispatcher } from "./dispatcher";
import { Store } from "./domain";
import Dnd from "./view/dnd";

export const dispatcher = new CommandsDispatcher();
export const store = new Store(dispatcher.dispatchCommand);
export const dnd = new Dnd();
