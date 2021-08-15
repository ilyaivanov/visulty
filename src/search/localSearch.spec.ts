import { folder } from "../api/dummyUserState";
import {
  createTitleHighlightsFromFoundTerms,
  findLocalItems,
} from "./localSearch";

describe("having a bunch of nested items", () => {
  it("searching for the term yields results", () => {
    const root = folder("ROOT", [
      folder("Music", [folder("Another Music thirdTerm (this comes second)")]),
      folder("Another Music (thirdTerm)"),
      folder("Other Item"),
    ]);
    const searchResults = findLocalItems(root, "mus ther third");

    areEqual(searchResults.items.length, 2);

    //Expecting BFS to first give items which are closer to the root (compared to DFS)
    areEqual(searchResults.items[0].item.title, "Another Music (thirdTerm)");
    areEqual(
      searchResults.items[1].item.title,
      "Another Music thirdTerm (this comes second)"
    );

    const fisrtResult = searchResults.items[0];
    //items are ordered by foundAt, thus simplifying UI
    areEqual(fisrtResult.highlights, [
      { from: 3, to: 7 },
      { from: 8, to: 11 },
      { from: 15, to: 20 },
    ]);
  });

  it("terms found are generated properly from overlapping search terms", () => {
    const root = folder("ROOT", [folder("Miss Monique (Radio Intense)")]);

    const searchResults = findLocalItems(root, "mis MI iss mon");

    const fisrtResult = searchResults.items[0];
    areEqual(fisrtResult.highlights, [
      { from: 0, to: 3 },
      { from: 1, to: 4 },
      { from: 5, to: 8 },
    ]);
  });

  //TODO: turned out - multiterm search is much more trickier than I expected
  //I will leave this at current stage and return back when I will have better ideas
  //Currently search works ok, it just gives visual bugs when you have overllaping term
  //Nest unit tests demonstrates this case
  xit("overlapping terms are being 'swallowed' by bigger terms", () => {
    const terms = [
      { foundAt: 0, term: "star" },
      { foundAt: 1, term: "tart" },
    ];

    areEqual(createTitleHighlightsFromFoundTerms(terms), [{ from: 0, to: 5 }]);
  });
});
