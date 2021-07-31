import { CommandsDispatcher } from "./dispatcher";
import { Store } from "./domain";

export const dispatcher = new CommandsDispatcher();
export const store = new Store(dispatcher.dispatchCommand);
