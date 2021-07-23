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

export const fragment = (children: Element[]) => {
  const frag = document.createDocumentFragment();
  children.forEach((child) => frag.appendChild(child));
  return frag;
};

export type ClassMap = Partial<Record<ClassName, boolean>>;
export type ClassDefinitions = {
  className?: ClassName;
  classNames?: ClassName[];
  classMap?: ClassMap;
};

export type ElementChild = Node | undefined | false;

type Ref<T> = {
  ref?: (el: T) => void;
};

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
};

const assignElementEvents = (elem: HTMLElement, props: Events) => {
  if (props.onKeyDown) elem.addEventListener("keydown", props.onKeyDown);
  if (props.onClick) elem.addEventListener("click", props.onClick);
};

//ELEMENTS

type DivProps = {
  id?: string;
} & ClassDefinitions &
  Events &
  Ref<HTMLDivElement>;

export const div = (props: DivProps, ...children: ElementChild[]) => {
  const elem = document.createElement("div");

  const { id } = props;
  assignClasses(elem, props);
  assignElementEvents(elem, props);
  assignChildrenArrayToElement(elem, children);
  if (id) elem.id = id;
  if (props.ref) props.ref(elem);
  return elem;
};

type ButtonProps = {
  text?: string;
} & ClassDefinitions &
  Events;

export const button = (props: ButtonProps) => {
  const elem = document.createElement("button");
  assignClasses(elem, props);
  assignElementEvents(elem, props);

  if (props.text) elem.textContent = props.text;

  return elem;
};

type InputProps = {
  value?: string;
  placeholder?: string;
} & ClassDefinitions &
  Events;

export const input = (props: InputProps) => {
  const elem = document.createElement("input");
  assignClasses(elem, props);
  if (props.value) elem.value = props.value;
  if (props.placeholder) elem.placeholder = props.placeholder;

  assignElementEvents(elem, props);

  return elem;
};

type SpanProps = {
  text: string;
} & ClassDefinitions &
  Events &
  Ref<HTMLSpanElement>;

export const span = (props: SpanProps) => {
  const elem = document.createElement("span");
  assignClasses(elem, props);
  assignElementEvents(elem, props);

  elem.textContent = props.text;
  if (props.ref) props.ref(elem);
  return elem;
};
