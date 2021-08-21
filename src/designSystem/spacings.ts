const borderWidth = 2;
const treeMaxWidth = 700;
const outerRadius = 18;
const innerRadius = 6;
const chevronSize = 16;
const borderSize = 2;
const rowVecticalPadding = 4;

const distanceBetweenMenuAndChevron = 15;
const iconMenuWidth = 16;
export const spacings = {
  borderWidth,
  treeMaxWidth,

  outerRadius,
  innerRadius,
  imageSize: outerRadius * 2,
  rowHeight: outerRadius * 2 + rowVecticalPadding * 2,
  chevronSize,
  //   borderSize,
  //   rowLeftPadding: chevronSize / 2,
  spacePerLevel: chevronSize + outerRadius - borderSize / 2 + 5,
  //   negativeMarginForRowAtZeroLevel: 1000,

  distanceBetweenRowLeftBorderAndIcon:
    chevronSize + distanceBetweenMenuAndChevron + iconMenuWidth,
  rowVecticalPadding,
  spaceBetweenCircleAndText: 8,
  headerHeight: 48,
  playerFooterHeight: 49,
  rightSidebarDefaultWidth: 250,

  iconMenuWidth,
  iconMenuHeight: 32,
  distanceBetweenMenuAndChevron,
  //   bodyScrollWidth: 6,
  //   pageFontSize: 16,
  //   pageTitleFontSize: 23,
  //   pageMarginTop: 20,
  //   documentWidth: 700,
  //   rowsContainerLeftPadding: 20,

  //   //CARDS
  //   cardHeight: 48,
  //   cardPadding: 14,
  //   cardWidth: 280,
  //   cardTextPadding: 4,
  //   cardTextBottomPadding: 2,
};
