import { convertNumericStylesToProperCssOjbect, style } from "./style";

it("converting js styles with pascal casing with numbers to css style camel-case with string", () => {
  expect(
    convertNumericStylesToProperCssOjbect({ marginLeft: 3, flex: 1 })
  ).toEqual({
    "margin-left": "3px",
    flex: "1",
  });
});

//I know, I have format in my tests, which might make tests fragile (anytime format off CSS output will change - tests will fail)
//but there is a bright side - I don't have a lot of tests here and I can pay that price, as long as I know when my code changed or broke anything

describe("Testing style output into <style> element in head ", () => {
  const stylesElement = document.getElementById("app-styles")!;
  beforeEach(() => {
    stylesElement.innerHTML = ``;
  });

  it("simple test for converting js object to css styles", () => {
    style.class("app", { fontSize: 16 });
    expect(stylesElement.textContent).toEqual(`
.app{
    font-size: 16px;
}
`);
  });

  it("simple test for converting js object to css styles", () => {
    style.keyframes("opacityAnimation", [
      { at: "0%", fontSize: 18 },
      { at: "50%", fontSize: 20 },
      { at: "70%, 100%", fontSize: 12 },
    ]);

    expect(stylesElement.textContent).toEqual(`
@keyframes opacityAnimation {
0%{
    font-size: 18px;
}

50%{
    font-size: 20px;
}

70%, 100%{
    font-size: 12px;
}

}`);
  });
});
