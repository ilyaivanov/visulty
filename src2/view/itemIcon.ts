import { css, style, dom, svg } from "../../src/browser";
import { icons, spacings, timings } from "../../src/designSystem";
// import { itemsStore } from "./stores";

const iconSize = spacings.outerRadius * 2;

export type IconEvents = {
  onChevronClick: () => void;
};

export class ItemIcon {
  chevron: SVGElement;

  el: Node;
  constructor(private item: MyItem, events: IconEvents) {
    this.chevron = icons.chevron({
      className: "item-icon-chevron",
      classMap: chevronMap(item),
      onClick: events.onChevronClick,
    });
    this.el = dom.fragment([
      this.chevron,
      svg.svg({
        className: "item-icon-svg",
        viewBox: `0 0 ${iconSize} ${iconSize}`,
        children: [
          item.children
            ? svg.circle({
                cx: iconSize / 2,
                cy: iconSize / 2,
                r: spacings.outerRadius,
                fill: "rgba(255,255,255,0.3)",
                className: "item-icon-circle",
                // classMap: outerCircleClassMap(item),
              })
            : undefined,
          getInnerCircle(item),
        ],
        // onMouseDown: props?.onMouseDown,
      }),
    ]);
  }
  public static view = (item: MyItem, events: IconEvents) =>
    new ItemIcon(item, events).el;

  updateChevron = () => {
    dom.assignClassMap(this.chevron, chevronMap(this.item));
  };
}

// export const viewItemIcon = (item: Item, events: IconEvents) => {
//   const outerCircle = svg.circle({
//     cx: iconSize / 2,
//     cy: iconSize / 2,
//     r: spacings.outerRadius,
//     fill: "rgba(255,255,255,0.3)",
//     className: "item-icon-circle",
//     classMap: outerCircleClassMap(item),
//   });
//   let innerCircle: SVGElement | undefined;

//   const chevron = icons.chevron({
//     className: "item-icon-chevron",
//     classMap: chevronMap(item),
//     onClick: events.onChevronClick,
//   });

//   const itemIconContainer = svg.svg({
//     className: "item-icon-svg",
//     viewBox: `0 0 ${iconSize} ${iconSize}`,
//     children: [!item.imageUrl ? outerCircle : undefined, innerCircle],
//     // onMouseDown: props?.onMouseDown,
//   });

//   if (item.imageUrl) {
//     itemIconContainer.style.backgroundImage = `url(${item.imageUrl})`;
//     dom.assignClasses(itemIconContainer, {
//       classMap: {
//         "item-icon-image_square": item.isPlaylist() || item.isVideo(),
//         "item-icon-image_circle": item.isChannel(),
//       },
//     });
//   } else {
//     innerCircle = getInnerCircle(item);
//     dom.appendChildren(itemIconContainer, [innerCircle]);
//   }

//   //reactions
//   itemsStore.itemReaction(
//     item,
//     () => item.isOpen,
//     () => {
//       dom.assignClassMap(outerCircle, outerCircleClassMap(item));
//       dom.assignClassMap(chevron, chevronMap(item));
//     }
//   );

//   return dom.fragment([chevron, itemIconContainer]);
// };

const getInnerCircle = (item: MyItem) =>
  !item.children
    ? svg.circle({
        cx: iconSize / 2,
        cy: iconSize / 2,
        r: spacings.innerRadius,
        fill: "transparent",
        strokeWidth: 2,
        stroke: "#DDDDDD",
      })
    : svg.circle({
        cx: iconSize / 2,
        cy: iconSize / 2,
        r: spacings.innerRadius,
        fill: "white",
      });

// const outerCircleClassMap = (item: Item): dom.ClassMap => ({
//   "item-icon-circle_hidden": item.isOpen || item.isEmpty,
// });

const chevronMap = (item: MyItem): dom.ClassMap => ({
  "item-icon-chevron_open": item.isOpen,
  "item-icon-chevron_active": true,
  //   "item-icon-chevron_active": item.isEmpty || item.isNeededToBeFetched,
});

style.class("item-icon-svg", {
  width: iconSize,
  minWidth: iconSize,
  height: iconSize,
  marginRight: spacings.spaceBetweenCircleAndText,
  backgroundSize: "cover",
  backgroundPosition: `50% 50%`,
});

style.class("item-icon-circle", {
  transition: css.transition({ opacity: timings.itemCollapse }),
});

style.class("item-icon-circle_hidden", { opacity: 0 });

style.class("item-icon-chevron", {
  height: spacings.chevronSize,
  width: spacings.chevronSize,
  borderRadius: spacings.chevronSize,
  //   marginTop: spacings.imageSize / 2 - spacings.chevronSize / 2,
  minWidth: spacings.chevronSize,
  color: "#B8BCBF",
  opacity: 0,
  userSelect: "none",
  pointerEvents: "none",
  onHover: { color: "currentColor" },
  transition: css.transition({
    transform: timings.itemCollapse,
    // opacity: timings.itemCollapse,
  }),
});

style.class("item-icon-chevron_open", {
  transform: "rotateZ(90deg)",
});

style.class("item-icon-chevron_visible", {
  opacity: 1,
  pointerEvents: "all",
});

style.parentHover("item-row", "item-icon-chevron_active", {
  opacity: 1,
  pointerEvents: "all",
});

const inset = (spread: number, color: string) =>
  `inset 0 0 0 ${spread}px ${color}`;

style.class("item-icon-image_circle", {
  borderRadius: "50%",
  boxShadow: inset(2, "rgba(255,255,255,0.15)"),
});

style.class("item-icon-image_square", {
  borderRadius: 4,
  boxShadow: inset(2, "rgba(255,255,255,0.15)"),
});
