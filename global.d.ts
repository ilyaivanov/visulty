type Action<TIn> = (arg: TIn) => void;
type Func1<TIn, TOut> = (arg: TIn) => TOut;

type ClassName = string;
type ElementId = string;

type Item = {
  id: string;
  title: string;
  children?: Item[];
  isOpen?: boolean;
};
