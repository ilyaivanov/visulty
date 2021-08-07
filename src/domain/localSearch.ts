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
  const results: LocalSearchEntry[] = [];
  const MAX_ITEMS_TO_FIND = 12;

  const terms = term.split(" ").filter((x) => x);

  const queue: MyItem[] = [];
  const traverse = () => {
    const item = queue.shift();

    if (!item || results.length >= MAX_ITEMS_TO_FIND) return;

    const loweredTitle = item.title.toLocaleLowerCase();
    const indexes = terms.map((term) => loweredTitle.indexOf(term));

    if (all(indexes, (index) => index >= 0))
      results.push({
        item,
        highlights: createTermsFound(item.title, terms),
      });
    if (item.children) item.children.forEach((subitem) => queue.push(subitem));
    traverse();
  };

  queue.push(rootItem);
  traverse();

  return { items: results, term };
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

const all = <T>(arr: T[], predicate: (a: T) => boolean): boolean => {
  //not using reduce here because I want to have the ability not to traverse whole array
  //and return result as long as I get predicate returning false
  //same goes for any
  for (var i = 0; i < arr.length; i++) {
    if (!predicate(arr[i])) return false;
  }
  return true;
};

const any = <T>(arr: T[], predicate: (a: T) => boolean): boolean => {
  for (var i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return true;
  }
  return false;
};
