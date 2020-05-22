import { createSelector } from 'reselect';

export const testCasesSelector = state => state.TestingCaseReference.testCases;
export const authorsSelector = createSelector([testCasesSelector], testCases => {
  const authors = testCases.withoutSuite.map(testCase => ({
    id: testCase.authorId,
    fullNameEn: testCase.authorInfo.fullNameEn,
    fullNameRu: testCase.authorInfo.fullNameRu
  }));
  testCases.withSuite.forEach(testSuite => {
    authors.concat(
      testSuite.testCases.map(testCase => ({
        id: testCase.authorId,
        fullNameEn: testCase.authorInfo.fullNameEn,
        fullNameRu: testCase.authorInfo.fullNameRu
      }))
    );
  });
  return authors;
});
