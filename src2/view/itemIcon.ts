import { css, style, dom, svg } from "../../src/browser";
import { icons, spacings, timings } from "../../src/designSystem";
import { colorsVars } from "../designSystem/colorVars";
import { store } from "../globals";

const iconSize = spacings.outerRadius * 2;

export type IconEvents = {
  onChevronClick: () => void;
};

export class ItemIcon {
  chevron?: SVGElement;
  iconEl!: SVGSVGElement;
  el: Node;
  constructor(private item: MyItem, events: IconEvents) {
    if (!store.isVideo(item))
      this.chevron = icons.chevron({
        className: "item-icon-chevron",
        classMap: chevronMap(item),
        onClick: events.onChevronClick,
      });

    this.el = dom.fragment([this.chevron, this.viewIcon()]);
  }
  public static view = (item: MyItem, events: IconEvents) =>
    new ItemIcon(item, events).el;

  onVisibilityChange = () => {
    this.chevron && dom.assignClassMap(this.chevron, chevronMap(this.item));

    if (!store.hasItemImage(this.item)) {
      dom.setChildren(this.iconEl, this.viewCircles());
    } else {
      this.assignIconWithImageClasses();
    }
  };

  viewIcon = () => {
    this.iconEl = svg.svg({
      className: "item-icon-svg",
      viewBox: `0 0 ${iconSize} ${iconSize}`,
      // onMouseDown: props?.onMouseDown,
    });
    const { item } = this;
    if (store.hasItemImage(item)) {
      this.iconEl.style.backgroundImage = `url(${store.getPreviewImage(item)})`;
      this.assignIconWithImageClasses();
    } else {
      dom.appendChildren(this.iconEl, this.viewCircles());
    }
    return this.iconEl;
  };

  viewCircles = (): SVGElement[] => {
    const { item } = this;
    if (item.title === "Deep work") console.log(item);
    if (store.isEmpty(item)) {
      return [
        svg.circle({
          cx: iconSize / 2,
          cy: iconSize / 2,
          r: spacings.innerRadius,
          fill: "transparent",
          strokeWidth: 2,
          stroke: colorsVars.itemEmptyCircle,
        }),
      ];
    } else {
      return [
        svg.circle({
          cx: iconSize / 2,
          cy: iconSize / 2,
          r: spacings.outerRadius,
          fill: colorsVars.itemOuterCircle,
          className: "item-icon-circle",
          classMap: outerCircleClassMap(item),
        }),
        svg.circle({
          cx: iconSize / 2,
          cy: iconSize / 2,
          r: spacings.innerRadius,
          fill: colorsVars.itemInnerCircle,
        }),
      ];
    }
  };

  private assignIconWithImageClasses = () => {
    const { item } = this;
    dom.assignClasses(this.iconEl, {
      classMap: {
        "item-icon-image_square": store.isPlaylist(item) || store.isVideo(item),
        "item-icon-image_circle": store.isChannel(item),
        "item-icon-video": store.isVideo(item),
        "item-icon-image_closed": !store.isVideo(item) && !item.isOpen,
      },
    });
  };
}

const outerCircleClassMap = (item: MyItem): dom.ClassMap => ({
  "item-icon-circle_hidden": item.isOpen || !item.children,
});

const chevronMap = (item: MyItem): dom.ClassMap => ({
  "item-icon-chevron_open": item.isOpen,
  "item-icon-chevron_active":
    !store.isEmpty(item) || store.isNeededToBeFetched(item),
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
  color: colorsVars.itemChevron,
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
  boxShadow: inset(2, colorsVars.itemImageInsetShadow),
});

style.class("item-icon-image_square", {
  borderRadius: 4,
  boxShadow: inset(2, colorsVars.itemImageInsetShadow),
});

style.class("item-icon-image_closed", {
  boxShadow: `0 0 4px 2px ${colorsVars.itemImageShadow}`,
});

//we need  this spacings because I'm not rendering chevron for videos
//maybe in future I won't be rendering chevron at all to speedup rendering for lots of items
style.class("item-icon-video", {
  marginLeft: spacings.chevronSize,
});
