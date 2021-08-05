const s = document.createElement("style");
document.head.appendChild(s);

const selector = (selector: string, styles: StylesWithVariables) => {
  const res = Array.isArray(selector) ? selector.join(", ") : selector;
  s.innerHTML += cssToString(res, styles);
};

const ignoredStyles: Record<string, number> = {
  onHover: 1,
  themes: 1,
  variables: 1,
};

type StylesWithVariables = Styles & {
  variables?: Record<string, string>;
};

type CompoundStyles = StylesWithVariables & {
  onHover?: Styles;
  active?: Styles;
};

type CN = ClassName; //just for being short

const handleCompoundStyles = (
  elementSelector: string,
  styles: CompoundStyles
) => {
  selector(elementSelector, styles);
  if (styles.onHover) selector(`${elementSelector}:hover`, styles.onHover);
  if (styles.active) selector(`${elementSelector}:active`, styles.active);
};

export const style = {
  text: (val: string) => (s.innerHTML += val),
  selector,
  tag: (tagName: keyof HTMLElementTagNameMap, styles: StylesWithVariables) =>
    selector(`${tagName}`, styles),

  class: (className: CN, styles: CompoundStyles) =>
    handleCompoundStyles(`.${className}`, styles),
  class2: (className1: CN, className2: CN, styles: CompoundStyles) =>
    handleCompoundStyles(`.${className1}.${className2}`, styles),
  id: (id: ElementId, styles: CompoundStyles) =>
    handleCompoundStyles(`#${id}`, styles),
  after: (className: CN, styles: Styles) => {
    selector(`.${className}::after`, styles);
  },
  parentHover: (parent: CN, child: CN, styles: StylesWithVariables) =>
    selector(`.${parent}:hover > .${child}`, styles),
  parentChild: (parent: CN, child: CN, styles: StylesWithVariables) =>
    selector(`.${parent} .${child}`, styles),
  parentDirectChild: (parent: CN, child: CN, styles: StylesWithVariables) =>
    selector(`.${parent} > .${child}`, styles),
};

const cssToString = (selector: string, props: StylesWithVariables) => {
  let values = Object.entries(convertNumericStylesToProperCssOjbect(props)).map(
    ([key, val]) => `\t${key}: ${val};`
  );
  if (props.variables) {
    const variablesFormatted = Object.entries(props.variables).map(
      ([variableKey, variableValue]) => `\t--${variableKey}: ${variableValue};`
    );
    values = values.concat(variablesFormatted);
  }
  return `\n${selector}{\n${values.join("\n")}\n}\n`;
};

export const convertNumericStylesToProperCssOjbect = (styles: Styles): {} =>
  Object.entries(convertNumericStylesToProperJsOjbect(styles)).reduce(
    (res, [key, val]) => {
      res[camelToSnakeCase(key)] = val;
      return res;
    },
    {} as Record<string, string>
  );

export const convertNumericStylesToProperJsOjbect = (
  styles: Styles
): Record<string, string> =>
  Object.entries(styles).reduce((res, [key, val]) => {
    const isNotIgnored = !ignoredStyles[key];
    if (
      typeof val !== "undefined" &&
      isNotIgnored &&
      (typeof val == "number" || typeof val === "string")
    )
      res[key] = convertVal(key, val);
    return res;
  }, {} as Record<string, string>);

//I'm using whitelist approach
//in other words I add px to every number values expect 'opacity', 'flex' and other
//and I'm leaving zeros for any value as string without px postfix
const whitelist: Styles = {
  zIndex: 1,
  opacity: 1,
  flex: 1,
  // fontWeight: 1,
  lineHeight: 1,
  animationDelay: 1,
};

const convertVal = (key: string, val: number | string) => {
  if ((whitelist as any)[key]) return val + "";

  if (typeof val == "number") return val + "px";
  return val + "";
};

export const camelToSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

type Easing = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";

export type Styles = Partial<{
  //display
  opacity: number;

  //sizing
  height: number | "100vh" | "100%" | string;
  width: number | string;
  minWidth: number;
  minHeight: number;
  boxSizing: "border-box";

  //margins and paddings
  margin: number;
  marginRight: number | "-100%";
  marginLeft: number;
  marginTop: number;
  marginBottom: number;
  padding: number | string;
  paddingRight: number | string;
  paddingLeft: number | string;
  paddingTop: number | string;
  paddingBottom: number | string;

  //positioning
  position: "absolute" | "relative" | "fixed";
  top: number | "100%" | string;
  right: number;
  bottom: number;
  left: number | string;
  zIndex: number;
  overflow: "hidden" | "auto" | "scroll" | "overlay";
  overflowX: "hidden" | "auto" | "scroll" | "overlay";
  overflowY: "hidden" | "auto" | "scroll" | "overlay";

  //flex
  flex: number;
  display: "flex" | "inline-block" | "block" | "grid";
  flexDirection: "row" | "column";
  justifyContent: "flex-start" | "center" | "flex-end";
  flexWrap: "wrap";
  alignSelf: "stretch";
  alignItems: "flex-start" | "center" | "flex-end";

  //border
  border: string;
  borderLeft: string;
  borderTop: string;
  outline: string;
  borderRadius: number | "50%";
  borderTopRightRadius: number;
  borderTopLeftRadius: number;
  borderBottomLeftRadius: number;
  borderBottomRightRadius: number;

  //colors
  backgroundColor: string;

  //transitions
  transition: string;
  transitionTimingFunction: Easing;

  animation: string;
  animationDelay: string | number;

  //typography
  fontFamily: string;
  color: string;
  lineHeight: number;
  fontSize: number;
  fontWeight: "bold" | "500" | "600";
  fontStyle: "italic";

  //shadows
  boxShadow: string;

  //svg
  stroke: string;
  strokeWidth: number;
  fill: string;

  //background
  backgroundImage: string;
  backgroundSize: "cover";
  backgroundPosition: string;
  background: string;
  backgroundRepeat: string;

  //grid
  gridTemplateColumns: string;
  gridTemplateRows: string;
  gridTemplateAreas: string;
  gridArea: string;

  //Other
  cursor: "pointer";
  userSelect: "none";
  transform: string;
  transformOrigin: string;
  pointerEvents: "none" | "all";
  visibility: "hidden";
  content: `" "`;
}>;
