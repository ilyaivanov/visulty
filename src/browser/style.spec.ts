import { convertNumericStylesToProperCssOjbect } from "./style";

it("converting js styles with pascal casing with numbers to css style camel-case with string", () => {
  expect(
    convertNumericStylesToProperCssOjbect({ marginLeft: 3, flex: 1 })
  ).toEqual({
    "margin-left": "3px",
    flex: "1",
  });
});
