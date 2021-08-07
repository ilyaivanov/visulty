export const createLoggingDispatcher = () => ({
  commands: [] as DomainCommand[],
  dispatch(command: DomainCommand) {
    this.commands.push(command);
  },
  clearLogs() {
    this.commands = [];
  },
});

export const expectEqual = <T>(a: T, b: T) => expect(a).toEqual(b);

export const createDummyItem = (id: string): MyItem =>
  ({
    id,
  } as MyItem);

export const folder = (id: string, children?: MyItem[]): MyItem => ({
  id,
  title: id,
  type: "folder",
  children,
});
