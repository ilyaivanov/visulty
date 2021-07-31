import { observable, reaction } from "mobx";
import { FolderItem } from "./item";

it("sample", () => {
  const item = new FolderItem({
    title: "HOME",
    children: [new FolderItem({ title: "Sub" })],
  });

  reaction(
    () => item.children,
    () => {
      console.log("values changed");
    }
  );

  item.children = [];
});
