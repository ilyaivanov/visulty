//this goes down into children
export const getItemBelow = (item: MyItem): MyItem | undefined => {
  if (item.isOpen && item.children) return item.children![0];

  const followingItem = getFollowingItem(item);
  if (followingItem) return followingItem;
  else {
    let parent: MyItem | undefined = item.parent;
    while (parent && isLast(parent)) {
      parent = parent.parent;
    }
    if (parent) return getFollowingItem(parent);
  }
};

export const getItemAbove = (item: MyItem): MyItem | undefined => {
  const previous = getPreviousItem(item);
  if (previous && previous.isOpen) return getLastNestedItem(previous);
  else if (previous) return previous;
  else if (item.parent && !isRoot(item.parent)) return item.parent;
};

export const removeItem = (item: MyItem): void => {
  const parent = item.parent;
  if (parent && parent.children) {
    parent.children = parent.children.filter((sibling) => item != sibling);
  }
};

export const createNewItemAsLastChild = (parent: MyItem): MyItem => {
  const newFolder: Folder = {
    title: "New Folder",
    id: Math.random() + "",
    type: "folder",
    parent: parent,
  };
  parent.children = (parent.children || []).concat(newFolder);
  return newFolder;
};

//this always returns following item without going down to children
export const getFollowingItem = (item: MyItem): MyItem | undefined => {
  const parent = item.parent;
  if (parent) {
    const context: MyItem[] = parent.children!;
    const index = context.indexOf(item);
    if (index < context.length - 1) {
      return context[index + 1];
    }
  }
};
// //this always returns following item without going down to children
export const getPreviousItem = (item: MyItem): MyItem | undefined => {
  const parent = item.parent;
  if (parent) {
    const context: MyItem[] = parent.children!;
    const index = context.indexOf(item);
    if (index > 0) {
      return context[index - 1];
    }
  }
};

export const getLastNestedItem = (item: MyItem): MyItem => {
  if (item.isOpen && item.children) {
    const { children } = item;
    return getLastNestedItem(children[children.length - 1]);
  }
  return item;
};

export const getFirstChild = (item: MyItem): MyItem | undefined => {
  const { children } = item;
  if (children && children.length > 0) return children[0];
  return undefined;
};

export const isLast = (item: MyItem): boolean => !getFollowingItem(item);

export const isRoot = (item: MyItem): boolean => {
  if (item.id === "HOME" || item.id === "SEARCH") return true;
  if (!item.parent)
    throw new Error(
      `Found non-root item without a parent ${item.title}. Please check your assignment to a parent property`
    );
  return false;
};

export const assignChildrenTo = (item: MyItem, children: MyItem[]) => {
  children.forEach((child) => {
    child.parent = item;
    if (child.children) assignChildrenTo(child, child.children);
  });
  item.children = children;
};
export const appendChildrenTo = (item: MyItem, children: MyItem[]) => {
  children.forEach((child) => {
    child.parent = item;
    if (child.children) assignChildrenTo(child, child.children);
  });
  item.children = (item.children || []).concat(children);
};

export const getRoot = (item: MyItem): MyItem => {
  let parent = item;
  while (parent.parent) {
    parent = parent.parent;
  }
  return parent;
};

export const getItemPath = (item: MyItem) => {
  const path: MyItem[] = [];

  let parent = item;
  while (parent.parent) {
    path.push(parent);
    parent = parent.parent;
  }
  return path.reverse();
};

export const getItemDistanceFromRoot = (item: MyItem): number =>
  getItemPath(item).length;

export const getPreviewImage = (item: MyItem): string => {
  if ("videoId" in item)
    return `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
  else if ("image" in item) return item.image;
  else return "";
};

export const getNextPageToken = (item: MyItem): string | undefined => {
  if (
    item.type === "YTchannel" ||
    item.type === "YTplaylist" ||
    item.type === "search"
  )
    return item.nextPageToken;
  return undefined;
};

export const hasItemImage = (item: MyItem) =>
  "image" in item || "videoId" in item;

export const isVideo = (item: MyItem): item is YoutubeVideo =>
  item.type === "YTvideo";
export const isPlaylist = (item: MyItem): item is YoutubePlaylist =>
  item.type === "YTplaylist";
export const isChannel = (item: MyItem): item is YoutubeChannel =>
  item.type === "YTchannel";

export const isSearch = (item: MyItem): item is SearchRoot =>
  item.type === "search";

export const isContainer = (
  item: MyItem
): item is YoutubePlaylist | YoutubeChannel | Folder => item.type != "YTvideo";

export const isEmpty = (item: MyItem) =>
  !item.children || item.children.length == 0;
export const isNeededToBeFetched = (item: MyItem) =>
  isEmpty(item) && !item.isLoading && (isPlaylist(item) || isChannel(item));

export const forEachChild = (
  item: MyItem,
  action: (item: MyItem, parent: MyItem) => void
) => {
  const traverseChildren = (parent: MyItem, item: MyItem) => {
    action(item, parent);

    if (item.children)
      item.children.forEach((child) => traverseChildren(item, child));
  };
  if (item.children)
    item.children.forEach((child) => traverseChildren(item, child));
};

export const traverseChildrenDFS = (
  item: MyItem,
  filter?: (item: MyItem) => boolean
): MyItem[] => {
  const results: MyItem[] = [];
  const traverseChildren = (item: MyItem) => {
    if (!filter || filter(item)) results.push(item);

    if (item.children) item.children.forEach(traverseChildren);
  };
  traverseChildren(item);
  return results;
};

export const traverseChildrenBFS = <T>(
  rootItem: MyItem,
  filterMap: (item: MyItem) => T | undefined,
  maxResults: number
): T[] => {
  const results: T[] = [];
  const queue: MyItem[] = [];
  const traverse = () => {
    const item = queue.shift();

    if (!item || results.length >= maxResults) return queue;

    const resultingItem = filterMap(item);

    if (resultingItem) results.push(resultingItem);
    if (item.children) item.children.forEach((subitem) => queue.push(subitem));
    traverse();
  };

  queue.push(rootItem);
  traverse();
  return results;
};

export const moveItem = (
  itemToMove: MyItem,
  placement: DropPlacement,
  itemRelativeWhichToMove: MyItem
) => {
  if (placement === "after") {
    insertItemAfter(itemRelativeWhichToMove, itemToMove);
  } else if (placement == "before") {
    insertItemBefore(itemRelativeWhichToMove, itemToMove);
  } else if (placement == "inside") {
    insertItemInside(itemRelativeWhichToMove, itemToMove);
  }
};

const insertItemAfter = (
  itemRelativeToInsert: MyItem,
  itemToInsert: MyItem
) => {
  const context = itemRelativeToInsert.parent!.children!;
  const index = context.indexOf(itemRelativeToInsert);

  context.splice(index + 1, 0, itemToInsert);
  itemToInsert.parent = itemRelativeToInsert.parent;
};

const insertItemBefore = (
  itemRelativeToInsert: MyItem,
  itemToInsert: MyItem
) => {
  const context = itemRelativeToInsert.parent!.children!;
  const index = context.indexOf(itemRelativeToInsert);

  context.splice(index, 0, itemToInsert);
  itemToInsert.parent = itemRelativeToInsert.parent;
};

const insertItemInside = (parentItem: MyItem, itemToInsert: MyItem) => {
  parentItem.children = [itemToInsert].concat(parentItem.children || []);
  itemToInsert.parent = parentItem;
};

export { Item } from "./item";
