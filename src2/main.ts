import { store } from "./globals";
import { viewChildrenFor } from "./view";

document.body.appendChild(viewChildrenFor(store.root));
