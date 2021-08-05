import { style } from "../browser";
import { colors } from "./colors";

const darkThemeColors: ThemeColors = takeNthKey(colors, 0);

const lightThemeColors: ThemeColors = takeNthKey(colors, 1);

export const createThemeStyles = () => {
  style.class("app-dark", { variables: darkThemeColors });
  style.class("app-light", { variables: lightThemeColors });
};

const mapEntries = <T>(
  obj: T,
  mapper: Func1<[string, unknown], [string, string]>
): T => Object.fromEntries(Object.entries(obj).map(mapper)) as unknown as T;

//Doesn't really matter which theme I'm picking.
//Using only keys here, which are shared across all themes
export const colorsVars: ThemeColors = mapEntries(
  darkThemeColors,
  ([key, _]) => [key, `var(--${key})`]
);

type ThemeColors = StringKeys<typeof colors>;

function takeNthKey<T>(theme: T, index: number): StringKeys<T> {
  return Object.fromEntries(
    Object.entries(theme).map(([key, values]) => [key, values[index]])
  ) as StringKeys<T>;
}

type StringKeys<Type> = {
  [Property in keyof Type]: string;
};
