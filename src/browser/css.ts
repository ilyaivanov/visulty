import { camelToSnakeCase, Styles, style } from "./style";

type Transition = Partial<Record<keyof Styles, number>>;

export const transition = (transitionDefinition: Transition): string =>
  Object.entries(transitionDefinition)
    .map(([key, value]) => `${camelToSnakeCase(key)} ${value}ms`)
    .join(", ");

export const translate = (x: number, y: number) => `translate(${x}px, ${y}px)`;

export const paddingVertical = (v: number): Styles => ({
  paddingBottom: v,
  paddingTop: v,
});

export const paddingHorizontal = (v: number): Styles => ({
  paddingLeft: v,
  paddingRight: v,
});

export function padding(all: number): string;
export function padding(vertical: number, horizontal: number): string;
export function padding(vertical: number, horizontal?: number): string {
  return horizontal ? `${vertical}px ${horizontal}px` : `${vertical}px`;
}

export const createScrollStyles = (
  className: ClassName,
  props: {
    scrollbar: Styles;
    thumb: Styles;
  }
) => {
  style.selector(`.${className}::-webkit-scrollbar`, props.scrollbar);
  style.selector(`.${className}::-webkit-scrollbar-thumb`, props.thumb);
};
