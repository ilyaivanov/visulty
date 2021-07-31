type MyItem = {
  id: string;
  title: string;
  isOpen?: boolean;
  children?: MyItem[];
  parent?: MyItem;
  counter: number;
};
