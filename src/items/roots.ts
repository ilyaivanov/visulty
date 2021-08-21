import { Item } from ".";

let root: Item;

export const setMainRoot = (item: Item) => {
  root = item;
};
export const getMainRoot = () => root;
