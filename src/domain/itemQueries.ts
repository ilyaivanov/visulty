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
