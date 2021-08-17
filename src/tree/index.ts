import { ItemIcon } from "./itemIcon";
import { itemSkeleton } from "./itemSkeleton";
import { ItemView } from "./itemView";
export { ItemView } from "./itemView";

export const showSkeletons = (count: number, level = 0) =>
  Array.from(new Array(count)).map((_, index) => itemSkeleton(index, level));

export const viewChildrenFor = (item: MyItem) => ItemView.viewChildrenFor(item);

export const viewIconFor = (item: MyItem) => ItemIcon.viewIcon(item);
