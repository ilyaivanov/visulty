import { timings } from "./timings";

export const crossFade = (
  container: HTMLElement,
  content: HTMLElement,
  newContent: HTMLElement
) => {
  const currentHeight = container.clientHeight;
  newContent.style.height = "0px";
  newContent.style.opacity = "0";
  container.appendChild(newContent);

  content
    .animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: timings.itemExpand / 2,
    })
    .addEventListener("finish", () => {
      content.remove();
      newContent.style.removeProperty("height");
      newContent.style.removeProperty("opacity");
      newContent.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: timings.itemExpand / 2,
      });
    });
  container
    .animate(
      [
        { height: `${currentHeight}px` },
        { height: `${newContent.scrollHeight}px` },
      ],
      { duration: timings.itemExpand }
    )
    .addEventListener("finish", () => {});
};

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

export const hideViaOpacity = (container: Element): Animation => {
  return container.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: timings.itemCollapse,
  });
};

export const showViaOpacity = (container: Element): Animation => {
  return container.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: timings.itemExpand,
  });
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

export const crossFadeIntoNewTextContent = (
  elem: Element,
  newText: string
): Animation => {
  const animation = elem.animate(
    [
      { transform: "translate(0,0)", opacity: 1 },
      { transform: "translate(0,-10px)", opacity: 0 },
    ],
    { duration: 200, easing: "ease-in" }
  );
  animation.addEventListener("finish", () => {
    elem.textContent = newText;
    elem.animate(
      [
        { transform: "translate(0,10px)", opacity: 0 },
        { transform: "translate(0,0)", opacity: 1 },
      ],
      { duration: 200, easing: "ease-out" }
    );
  });
  return animation;
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
