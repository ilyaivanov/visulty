type Action<TIn> = (arg: TIn) => void;
type Func1<TIn, TOut> = (arg: TIn) => TOut;

type ElementId = string;

type AppTheme = "dark" | "light";
type DropPlacement = "after" | "before" | "inside";
