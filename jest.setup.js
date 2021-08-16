global.haveBeenCalledWith = (fn, ...args) =>
  expect(fn).toHaveBeenCalledWith(...args);

global.haveLastBeenCalledWith = (fn, ...args) =>
  expect(fn).toHaveBeenLastCalledWith(...args);

global.haveBeenCalled = (fn) => expect(fn).toHaveBeenCalled();

global.areEqual = (a, b) => expect(a).toEqual(b);
global.areSame = (a, b) => expect(a).toBe(b);
