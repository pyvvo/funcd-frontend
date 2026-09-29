interface ICollector {
  name: string;
  operator: string;
  subscriber: string;
  email: string;
  password: string;
}

const rows: ICollector[] = [
  {
    name: 'Test1',
    operator: 'orange',
    subscriber: 'birdz1',
    email: 'test1@mail.coom',
    password: ''
  },
  {
    name: 'Test2',
    operator: 'orange',
    subscriber: 'birdz2',
    email: 'test2@mail.coom',
    password: ''
  },
  {
    name: 'Test3',
    operator: 'orange',
    subscriber: 'birdz3',
    email: 'test3@mail.coom',
    password: ''
  },
  {
    name: 'Test4',
    operator: 'orange',
    subscriber: 'birdz4',
    email: 'test3@mail.coom',
    password: ''
  }
];

export default {
  getRows: () => rows,
  getRowByName: (name: string) => rows.find((row) => row.name === name)
  // setRow: (row: ICollector) => rows.find((row) => row.name === name)
};
