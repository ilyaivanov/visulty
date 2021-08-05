import { css, style, dom, svg } from "../browser";
import { icons, spacings, colors, timings } from "../designSystem";
import { store } from "../globals";

const iconSize = spacings.outerRadius * 2;

export type IconEvents = {
  onChevronClick: Action<void>;
  onIconMouseDown: Action<MouseEvent>;
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
        onClick: (e) => {
          e.stopPropagation();
          events.onChevronClick();
        },
      });

    this.iconEl = ItemIcon.viewIcon(this.item);
    this.iconEl.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      events.onIconMouseDown(e);
    });
    this.el = dom.fragment([this.chevron, this.iconEl]);
  }
  public static view = (item: MyItem, events: IconEvents) =>
    new ItemIcon(item, events).el;

  onVisibilityChange = () => {
    this.chevron && dom.assignClassMap(this.chevron, chevronMap(this.item));

    if (!store.hasItemImage(this.item)) {
      dom.setChildren(this.iconEl, ItemIcon.viewCircles(this.item));
    } else {
      ItemIcon.assignIconWithImageClasses(this.iconEl, this.item);
    }
  };

  public static viewIcon = (
    item: MyItem,
    events?: { onIconMouseDown: Action<unknown> }
  ) => {
    const res = svg.svg({
      className: "item-icon-svg",
      viewBox: `0 0 ${iconSize} ${iconSize}`,
      onMouseDown: events?.onIconMouseDown,
    });
    if (store.hasItemImage(item)) {
      res.style.backgroundImage = `url(${store.getPreviewImage(item)})`;
      ItemIcon.assignIconWithImageClasses(res, item);
    } else {
      dom.appendChildren(res, ItemIcon.viewCircles(item));
    }
    return res;
  };

  private static viewCircles = (item: MyItem): SVGElement[] => {
    if (store.isEmpty(item)) {
      return [
        svg.circle({
          cx: iconSize / 2,
          cy: iconSize / 2,
          r: spacings.innerRadius,
          fill: "transparent",
          strokeWidth: 2,
          stroke: colors.itemEmptyCircle,
        }),
      ];
    } else {
      return [
        svg.circle({
          cx: iconSize / 2,
          cy: iconSize / 2,
          r: spacings.outerRadius,
          fill: colors.itemOuterCircle,
          className: "item-icon-circle",
          classMap: outerCircleClassMap(item),
        }),
        svg.circle({
          cx: iconSize / 2,
          cy: iconSize / 2,
          r: spacings.innerRadius,
          fill: colors.itemInnerCircle,
        }),
      ];
    }
  };

  private static assignIconWithImageClasses = (
    el: SVGElement,
    item: MyItem
  ) => {
    dom.assignClasses(el, {
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
    item.isLoading || !store.isEmpty(item) || store.isNeededToBeFetched(item),
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
  color: colors.itemChevron,
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
  boxShadow: inset(2, colors.itemImageInsetShadow),
});

style.class("item-icon-image_square", {
  borderRadius: 4,
  boxShadow: inset(2, colors.itemImageInsetShadow),
});

style.class("item-icon-image_closed", {
  boxShadow: `0 0 4px 2px ${colors.itemImageShadow}`,
});

//we need  this spacings because I'm not rendering chevron for videos
//maybe in future I won't be rendering chevron at all to speedup rendering for lots of items
style.class("item-icon-video", {
  marginLeft: spacings.chevronSize,
});
