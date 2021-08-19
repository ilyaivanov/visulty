import { array } from "../lodash";
import { traverseChildrenBFS } from "../items";
export type LocalSearchResults = {
  items: LocalSearchEntry[];
  term: string;
};
export type LocalSearchEntry = { item: MyItem; highlights: Highlight[] };

type TermsFound = { term: string; foundAt: number };
export type Highlight = { from: number; to: number };

//BFS on items tree finding items with case-insensitive term
export const findLocalItems = (
  rootItem: MyItem,
  term: string
): LocalSearchResults => {
  const MAX_ITEMS_TO_FIND = 12;

  const terms = term
    .toLocaleLowerCase()
    .split(" ")
    .filter((x) => x);

  const isMatchingTerms = (item: MyItem): LocalSearchEntry | undefined => {
    const loweredTitle = item.title.toLocaleLowerCase();
    const indexes = terms.map((term) => loweredTitle.indexOf(term));

    if (array.all(indexes, (index) => index >= 0))
      return {
        item,
        highlights: createTermsFound(item.title, terms),
      };
    return undefined;
  };

  return {
    items: [], //traverseChildrenBFS(rootItem, isMatchingTerms, MAX_ITEMS_TO_FIND),
    term,
  };
};

//see unit tests for more details
const createTermsFound = (title: string, terms: string[]): Highlight[] => {
  const indexes = terms.map((term) => title.toLocaleLowerCase().indexOf(term));
  return createTitleHighlightsFromFoundTerms(
    terms
      .map((term, termIndex) => ({
        term,
        foundAt: indexes[termIndex],
      }))
      .sort((prev, next) => prev.foundAt - next.foundAt)
  );
};

export const createTitleHighlightsFromFoundTerms = (
  terms: TermsFound[]
): { from: number; to: number }[] => {
  const foundsAt: Map<number, string> = new Map();

  terms.forEach((termFound) => {
    if (
      !foundsAt.has(termFound.foundAt) ||
      foundsAt.get(termFound.foundAt)!.length < termFound.term.length
    )
      foundsAt.set(termFound.foundAt, termFound.term);
  });

  return Array.from(foundsAt.entries()).map(([key, value]) => ({
    from: key,
    to: key + value.length,
  }));
};
