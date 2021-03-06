import { css, style, dom, svg, div } from "../../browser";
import { icons, spacings, colors, timings } from "../../designSystem";
import { Item } from "../../items";

const iconSize = spacings.outerRadius * 2;

export type IconEvents = {
  onChevronClick: EmptyAction;
  onMenuClick: Action<HTMLElement>;
  onIconMouseDown: Action<MouseEvent>;
};

export class ItemIcon {
  chevron?: SVGElement;
  iconEl!: SVGSVGElement;
  el: Node;
  constructor(private item: Item, events: IconEvents) {
    if (!item.isVideo())
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
    this.el = dom.fragment([
      icons.menu({
        classNames: ["item-icon-menu"],
        onClick: (e) => {
          e.stopPropagation();
          const icon = e.currentTarget as HTMLElement;
          events.onMenuClick(icon);
        },
      }),
      this.chevron,
      this.iconEl,
    ]);
  }
  public static view = (item: Item, events: IconEvents) =>
    new ItemIcon(item, events).el;

  onVisibilityChange = () => {
    this.chevron && dom.assignClassMap(this.chevron, chevronMap(this.item));

    if (!this.item.hasItemImage()) {
      dom.setChildren(this.iconEl, ItemIcon.viewCircles(this.item));
    } else {
      ItemIcon.assignIconWithImageClasses(this.iconEl, this.item);
    }
  };

  public static viewIcon = (
    item: Item,
    events?: { onIconMouseDown: Action<unknown> }
  ) => {
    const res = svg.svg({
      className: "item-icon-svg",
      viewBox: `0 0 ${iconSize} ${iconSize}`,
      onMouseDown: events?.onIconMouseDown,
    });
    if (item.hasItemImage()) {
      res.style.backgroundImage = `url(${item.getPreviewImage()})`;
      ItemIcon.assignIconWithImageClasses(res, item);
    } else {
      dom.appendChildren(res, ItemIcon.viewCircles(item));
    }
    return res;
  };

  private static viewCircles = (item: Item): SVGElement[] => {
    if (item.isEmpty()) {
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
        // svg.circle({
        //   cx: iconSize / 2,
        //   cy: iconSize / 2,
        //   r: spacings.outerRadius - 1,
        //   fill: "transparent",
        //   strokeWidth: 2,
        //   stroke: colors.itemChildrenLine,
        //   className: "item-icon-circle",
        //   classMap: outerCircleClassMap(item),
        // }),
        svg.circle({
          cx: iconSize / 2,
          cy: iconSize / 2,
          r: spacings.innerRadius,
          fill: colors.itemInnerCircle,
        }),
      ];
    }
  };

  private static assignIconWithImageClasses = (el: SVGElement, item: Item) => {
    dom.assignClasses(el, {
      classMap: {
        "item-icon-image_square": item.isPlaylist() || item.isVideo(),
        "item-icon-image_circle": item.isChannel(),
        "item-icon-video": item.isVideo(),
        "item-icon-image_closed": !item.isVideo() && !item.isOpen,
      },
    });
  };
}

const outerCircleClassMap = (item: MyItem): dom.ClassMap => ({
  "item-icon-circle_hidden": item.isOpen || !item.children,
});

const chevronMap = (item: Item): dom.ClassMap => ({
  "item-icon-chevron_open": item.isOpen,
  "item-row_showOnHoverOrSelected":
    item.isLoading || !item.isEmpty() || item.isNeededToBeFetched(),
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
  minWidth: spacings.chevronSize,
  color: colors.itemChevron,
  opacity: 0,
  onHover: { color: colors.itemChevronHover },
  active: { color: colors.itemChevronActive },
  transition: css.transition({
    transform: timings.itemCollapse,
  }),
  transform: "translate3d(-2px, 0, 0)",
});

style.class("item-icon-menu", {
  height: spacings.iconMenuHeight,
  width: spacings.iconMenuWidth,
  minWidth: spacings.iconMenuWidth,
  marginRight: spacings.distanceBetweenMenuAndChevron,
  color: colors.itemChevron,
  borderRadius: "50%",
  onHover: { color: colors.itemChevronHover },
  active: { color: colors.itemChevronActive },
  opacity: 0,
});

style.parentChild("item-row-highlightedContextMenu", "item-icon-menu", {
  color: "white",
  opacity: 1,
});

style.parentHover("item-row", "item-icon-menu", {
  opacity: 1,
});

style.parentChild("item-row-folder", "item-icon-chevron", {
  transform: "translate3d(5px, 0, 0)",
});

style.parentChild("item-row-folder", "item-icon-chevron_open", {
  transform: "translate3d(5px, 0, 0) rotateZ(90deg) ",
});

style.class("item-icon-chevron_open", {
  transform: "translate3d(-2px, 0, 0) rotateZ(90deg) ",
});

style.class("item-icon-chevron_visible", {
  opacity: 1,
});

style.parentHover("item-row", "item-row_showOnHoverOrSelected", {
  opacity: 1,
});

style.parentChild("item-row_selected", "item-row_showOnHoverOrSelected", {
  opacity: 1,
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

style.class2("item-icon-image_square", "item-icon-image_closed", {
  boxShadow:
    inset(2, colors.itemImageInsetShadow) +
    `, 0 0 4px 2px ${colors.itemImageShadow}`,
});

style.class2("item-icon-image_circle", "item-icon-image_closed", {
  boxShadow:
    inset(2, colors.itemImageInsetShadow) +
    `, 0 0 4px 2px ${colors.itemImageShadow}`,
});

//we need  this spacings because I'm not rendering chevron for videos
//maybe in future I won't be rendering chevron at all to speedup rendering for lots of items
style.class("item-icon-video", {
  marginLeft: spacings.chevronSize,
});
