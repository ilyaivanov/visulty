import { style } from "../browser";
import * as colors from "./colors";

export const createThemeStyles = () => {
  style.class("app-dark", { variables: colors.darkThemeColors });
  style.class("app-light", { variables: colors.lightThemeColors });
};

const mapEntries = <T>(
  obj: T,
  mapper: Func1<[string, unknown], [string, string]>
): T => Object.fromEntries(Object.entries(obj).map(mapper)) as unknown as T;

export const colorsVars: colors.ThemeColors = mapEntries(
  colors.darkThemeColors,
  ([key, _]) => [key, `var(--${key})`]
);
