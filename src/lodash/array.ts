export const getNextItemBy = <T>(
  array: T[],
  predicate: Func1<T, boolean>
): T | undefined => {
  const index = array.findIndex((val) => predicate(val));
  if (index !== -1 && index < array.length - 1) return array[index + 1];
  return undefined;
};

export const getPreviousItemBy = <T>(
  array: T[],
  predicate: Func1<T, boolean>
): T | undefined => {
  const index = array.findIndex((val) => predicate(val));
  if (index !== -1 && index > 0) return array[index - 1];
  return undefined;
};
export const all = <T>(arr: T[], predicate: (a: T) => boolean): boolean => {
  //not using reduce here because I want to have the ability not to traverse whole array
  //and return result as long as I get predicate returning false
  //same goes for any
  for (var i = 0; i < arr.length; i++) {
    if (!predicate(arr[i])) return false;
  }
  return true;
};
