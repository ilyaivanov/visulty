import { timings } from "./timings";

export const collapse = (
  container: Element,
  options?: { ignoreOpacity: boolean }
): Animation => {
  const currentHeight = container.clientHeight;

  const frames =
    options && options.ignoreOpacity
      ? [{ height: `${currentHeight}px` }, { height: `0px` }]
      : [
          { height: `${currentHeight}px`, opacity: 1 },
          { height: `0px`, opacity: 0 },
        ];

  return container.animate(frames, {
    duration: timings.itemCollapse,
    easing: "ease-in-out",
  });
};
export const expand = (container: HTMLElement): Animation => {
  const currentHeight = container.clientHeight;
  return container.animate(
    [
      { height: `0px`, opacity: 0 },
      { height: `${currentHeight}px`, opacity: 1 },
    ],
    { duration: timings.itemExpand, easing: "ease-out" }
  );
};

export const flyAwayAndCollapse = (container: Element): Animation => {
  const frames = [
    { transform: "translate3d(0,0,0)", opacity: 1 },
    { transform: "translate3d(-40px,0,0)", opacity: 0 },
  ];
  container
    .animate(frames, { duration: 200, fill: "forwards" })
    .addEventListener("finish", () => {
      collapseAnimation.play();
    });

  const collapseAnimation = collapse(container, { ignoreOpacity: true });
  collapseAnimation.pause();
  return collapseAnimation;
};

export const hasAnimations = (elem: HTMLElement) =>
  elem.getAnimations().length > 0;

export const revertAnimations = (elem: HTMLElement | undefined) => {
  if (!elem) return false;

  if (hasAnimations(elem)) {
    elem.getAnimations().forEach((animation) => animation.reverse());
    return true;
  }
  return false;
};
