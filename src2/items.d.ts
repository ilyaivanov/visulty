type MyItem = {
  id: string;
  title: string;
  isOpen?: boolean;
  isLoading?: boolean;
  children?: MyItem[];
  parent?: MyItem;
};
