import { spacings } from "./spacings";
import { style } from "../browser";

// this file generates a bunch of classes for nested levels
// I'm using this approach because gallery view requires full width while being nested

export const rowForLevel = (level: number): ClassName =>
  ("level_" + level) as unknown as ClassName;

export const childrenBorderForLevel = (level: number): ClassName =>
  ("children-border-level_" + level) as unknown as ClassName;

const numberOfLevelsToGenerate = 11;

const borderWidth = 2;

for (let level = 0; level < numberOfLevelsToGenerate; level++) {
  const base = `max((100% - ${spacings.treeMaxWidth}px) / 2, 20px)`;
  const levelPadding = `${level * spacings.spacePerLevel}px`;
  style.class(rowForLevel(level), {
    paddingLeft: `calc(${base} + ${levelPadding})`,
    paddingRight: `calc(${base} + ${levelPadding})`,
  });
  style.class(childrenBorderForLevel(level), {
    left: `calc(${base} + ${
      level * spacings.spacePerLevel +
      spacings.chevronSize +
      spacings.outerRadius -
      borderWidth / 2
    }px)`,
  });
}
