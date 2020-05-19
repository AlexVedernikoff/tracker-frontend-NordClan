export const testCasesMock = [
  {
    id: 34,
    title: 'Test1',
    priority: 3,
    authorInfo: { id: 1, fullNameRu: 'Петя Иванов', fullNameEn: 'Petya Ivanov' },
    testSuiteInfo: { title: 'Test' }
  },
  {
    id: 21,
    title: 'Test2',
    priority: 3,
    authorInfo: { id: 2, fullNameRu: 'Петя Иванов', fullNameEn: 'Petya Ivanov' },
    testSuiteInfo: { title: 'Test' }
  },
  {
    id: 25,
    title: 'Test3',
    priority: 3,
    authorInfo: { id: 1, fullNameRu: 'Петя Иванов', fullNameEn: 'Petya Ivanov' },
    testSuiteInfo: { title: 'Test' }
  }
];

export const authorsMock = [{ label: 'Petya Ivanov', id: 1 }];

export const testSuitesMock = {
  withTestSuite: [
    {
      id: 1,
      title: 'testSuite',
      description:
        'descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription',
      testCases: testCasesMock
    },
    {
      id: 2,
      title: 'testSuite2',
      description: 'description',
      testCases: testCasesMock
    },
    {
      id: 3,
      title: 'testSuite3',
      description: 'description',
      testCases: testCasesMock
    }
  ],
  withoutTestSuite: testCasesMock
};
