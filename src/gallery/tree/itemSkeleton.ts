import { div, style } from "../../browser";
import { colors, levels, spacings } from "../../designSystem";

export const itemSkeleton = (index: number, level: number) => {
  const elem = div(
    { classNames: ["avatar-row" as any, levels.rowForLevel(level)] },
    [
      div({
        className: "avatar" as any,
        style: { animationDelay: 100 * index + "ms" },
      }),
      div({
        className: "text-avatar" as any,
        style: { animationDelay: 100 * index + "ms" },
      }),
    ]
  );
  return elem;
};

const time = 1500;
style.keyframes("opacity", [
  { at: "0%", backgroundColor: colors.itemSkeletonBackground },
  { at: "20%", backgroundColor: colors.itemSkeletonGradientCenter },
  { at: "80%, 100%", backgroundColor: colors.itemSkeletonBackground },
]);

style.class("avatar-row" as any, {
  height: 32,
  paddingTop: 4,
  paddingBottom: 4,
  display: "flex",
  alignItems: "center",
});

style.class("avatar" as any, {
  marginLeft: spacings.distanceBetweenRowLeftBorderAndIcon,
  borderRadius: 4,
  minWidth: 32,
  width: 32,
  height: 32,
  backgroundColor: colors.itemSkeletonBackground,
  animation: `opacity ${time}ms infinite linear`,
});

style.class("text-avatar" as any, {
  height: 16,
  width: 200,
  marginLeft: 10,
  borderRadius: 4,
  backgroundColor: colors.itemSkeletonBackground,
  animation: `opacity ${time}ms infinite linear`,
});
