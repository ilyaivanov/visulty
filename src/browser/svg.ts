import * as dom from "./dom";
import { camelToSnakeCase, Styles } from "./style";

type SvgEvents = {
  onMouseDown?: Action<MouseEvent>;
  onClick?: Action<MouseEvent>;
};
type BaseSvg = dom.ClassDefinitions & SvgEvents;
type SvgInlineStyles = Pick<Styles, "backgroundImage">;

export interface SvgProps extends BaseSvg {
  style?: SvgInlineStyles;
  viewBox: string;
  fill?: string;
  children?: (SVGElement | undefined)[];
}
export const svg = (props: SvgProps): SVGSVGElement =>
  dom.assignClasses(
    appendChildren(
      assignEvents(
        assignSvgAttributes(
          assignSvgInlineStyles(svgElem("svg"), props.style),
          props
        ),
        props
      ),
      props.children
    ),
    props
  );

export interface CircleProps extends dom.ClassDefinitions {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}
export const circle = (circleProps: CircleProps) =>
  dom.assignClasses(
    assignSvgAttributes(svgElem("circle"), circleProps),
    circleProps
  );

export interface PolygonProps extends dom.ClassDefinitions {
  points: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinejoin?: "round";
}
export const polygon = (props: PolygonProps) =>
  assignSvgAttributes(svgElem("polygon"), props);

export interface PathProps extends dom.ClassDefinitions {
  d: string;
  fill?: string;
  stroke?: string;
  strokeLinecap?: string;
}
export const path = (props: PathProps) =>
  assignSvgAttributes(svgElem("path"), props);

//SVG infra

const assignEvents = (svg: SVGSVGElement, props: SvgEvents) => {
  if (props.onMouseDown) svg.addEventListener("mousedown", props.onMouseDown);
  if (props.onClick) svg.addEventListener("click", props.onClick);
  return svg;
};
const svgAttributesIgnored: Record<string, boolean> = {
  children: true,
  className: true,
  classMap: true,
  style: true,
  onClick: true,
};

const attributesInPascal: Record<string, boolean> = {
  viewBox: true,
};
const assignSvgAttributes = <T extends Element>(
  elem: T,
  attributes: {} & dom.ClassDefinitions
): T => {
  if (attributes.className) elem.classList.add(attributes.className);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value && !svgAttributesIgnored[key]) {
      const keyConverted = attributesInPascal[key]
        ? key
        : camelToSnakeCase(key);
      elem.setAttribute(keyConverted, value + "");
    }
  });
  return elem;
};

const assignSvgInlineStyles = (
  elem: SVGSVGElement,
  styles: SvgInlineStyles | undefined
): SVGSVGElement => {
  if (styles) {
    if (styles.backgroundImage)
      elem.style.backgroundImage = styles.backgroundImage;
  }
  return elem;
};

const svgNamespace = "http://www.w3.org/2000/svg";
const svgElem = <T extends keyof SVGElementTagNameMap>(name: T) =>
  document.createElementNS(svgNamespace, name) as SVGElementTagNameMap[T];

const appendChildren = <T extends SVGElement>(
  elem: T,
  children: (SVGElement | undefined)[] | undefined
): T => {
  if (children) children.forEach((child) => child && elem.appendChild(child));
  return elem;
};
