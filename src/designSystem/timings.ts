const timeScaleFactor = 1;

export const timings = {
  itemCollapse: 300,
  focusFlyTime: 300,
  itemExpand: 350,
  modalShow: 150,
};

Object.keys(timings).forEach((key) => {
  (timings as Record<string, number>)[key] *= timeScaleFactor;
});
