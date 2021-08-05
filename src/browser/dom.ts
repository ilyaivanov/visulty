import { Styles, convertNumericStylesToProperJsOjbect } from "./style";

//QUERIES
export const getFirstElementWithClass = (
  elem: Element,
  className: ClassName
): Element => {
  return elem.getElementsByClassName(className)[0];
};

//COMMANDS
export const insert = (
  elem: Element,
  target: InsertPosition,
  elemToInsert: Element
) => elem.insertAdjacentElement(target, elemToInsert);

export const appendChildren = (elem: Element, children: Node[]) =>
  children.forEach((child) => elem.appendChild(child));

export const removeAllChildren = (elem: Element) => {
  while (elem.firstChild) elem.firstChild.remove();
};

const assignChildrenArrayToElement = (
  elem: Element,
  children: ElementChild[]
) => children.forEach((child) => child && elem.appendChild(child));

export const setChildren = (elem: Element, children: Element[]) => {
  removeAllChildren(elem);
  children.forEach((child) => elem.appendChild(child));
};
export const setChild = (elem: Element, child: Node) => {
  removeAllChildren(elem);
  elem.appendChild(child);
};

export const fragment = (children: (Element | undefined)[]) => {
  const frag = document.createDocumentFragment();
  children.forEach((child) => child && frag.appendChild(child));
  return frag;
};

export type ClassMap = Partial<Record<ClassName, boolean>>;
export type ClassDefinitions = {
  className?: ClassName;
  classNames?: ClassName[];
  classMap?: ClassMap;
};

export type ElementChild = Node | undefined | false;

export const assignClasses = <T extends Element>(
  elem: T,
  classes: ClassDefinitions
): T => {
  const { classMap, className, classNames } = classes;
  if (classMap) assignClassMap(elem, classMap);
  if (className) elem.classList.add(className);
  if (classNames) classNames.forEach((cs) => elem.classList.add(cs));
  return elem;
};

export const assignClassMap = (elem: Element, classMap: ClassMap) =>
  Object.entries(classMap).map(([className, isSet]) =>
    toggleClass(elem, className as ClassName, isSet)
  );

export const addClass = (elem: Element, className: ClassName) =>
  elem.classList.add(className);

export const removeClass = (elem: Element, className: ClassName) =>
  elem.classList.remove(className);

export const toggleClass = (
  elem: Element,
  className: ClassName,
  isSet?: boolean
) => elem.classList.toggle(className, isSet);

type Events = {
  onKeyDown?: (e: KeyboardEvent) => void;
  onClick?: (e: MouseEvent) => void;
  onClickStopPropagation?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onBlur?: (e: FocusEvent) => void;
};

const assignElementEvents = (elem: HTMLElement, props: Events) => {
  const { onClick, onClickStopPropagation, onKeyDown, onMouseMove, onBlur } =
    props;
  if (onKeyDown) elem.addEventListener("keydown", onKeyDown);
  if (onClick) elem.addEventListener("click", onClick);
  if (onClickStopPropagation)
    elem.addEventListener("click", (e) => {
      e.stopPropagation();
      onClickStopPropagation(e);
    });
  if (onMouseMove) elem.addEventListener("mousemove", onMouseMove);
  if (onBlur) elem.addEventListener("blur", onBlur);
};

//ELEMENTS

const elemFactory =
  <T extends keyof HTMLElementTagNameMap>(tag: T) =>
  (
    props: ElementProps<HTMLElementTagNameMap[T]>,
    children?: ElementChild[]
  ): HTMLElementTagNameMap[T] =>
    elem(tag, props, children);

export const div = elemFactory("div");
export const span = elemFactory("span");
export const button = elemFactory("button");

type InputProps = ElementProps<HTMLInputElement> & {
  placeholder?: string;
  value: string;
};
export const input = (inputProps: InputProps) => {
  const el = elem("input", inputProps);
  if (inputProps.placeholder) el.placeholder = inputProps.placeholder;
  el.value = inputProps.value;
  return el;
};

type ElementProps<T> = {
  id?: string;
  textContent?: string;
  ref?: MyRef<T>;
  style?: Styles;
} & ClassDefinitions &
  Events;

export const elem = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  props: ElementProps<HTMLElementTagNameMap[T]>,
  children?: ElementChild[]
): HTMLElementTagNameMap[T] => {
  const elem = document.createElement(tag);

  if (props.textContent) elem.textContent = props.textContent;
  if (props.id) elem.id = props.id;
  if (props.ref) props.ref.elem = elem;

  assignClasses(elem, props);
  assignElementEvents(elem, props);
  if (children) assignChildrenArrayToElement(elem, children);
  if (props.style) {
    Object.assign(
      elem.style,
      convertNumericStylesToProperJsOjbect(props.style)
    );
  }
  return elem;
};

export const createRef = <T extends keyof HTMLElementTagNameMap>(
  tag: T
): MyRef<HTMLElementTagNameMap[T]> => ({ elem: undefined as any });

export type MyRef<T> = {
  elem: T;
};
