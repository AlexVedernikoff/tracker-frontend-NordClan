import { createSelector } from 'reselect';
import { getOptionsFrom } from '../helpers/selectOptions';
import { langSelector } from './Localize';

export const testCasesSelector = state => state.TestingCaseReference.testCases;

export const testSuitesSelector = state => Object.values(state.TestingCaseReference.testCases.withTestSuite);

export const authorIdSelector = state => state.Auth.user.id;

export const testSuitesOptionsSelector = createSelector([testSuitesSelector], testSuites =>
  getOptionsFrom([{ title: 'Without test suite', id: 'withoutTestSuites' }, ...testSuites], 'title', 'id')
);
export const authorsSelector = createSelector([testCasesSelector], testCases => {
  const authors = testCases.withoutTestSuite.map(
    testCase =>
      testCase.authorId && {
        id: testCase.authorId || null,
        fullNameEn: testCase.authorInfo ? testCase.authorInfo.fullNameEn : null,
        fullNameRu: testCase.authorInfo ? testCase.authorInfo.fullNameRu : null
      }
  );
  testCases.withTestSuite.map(testSuite => {
    authors.concat(
      testSuite.testCasesData.map(testCase => ({
        id: testCase.authorId || null,
        fullNameEn: testCase.authorInfo ? testCase.authorInfo.fullNameEn : null,
        fullNameRu: testCase.authorInfo ? testCase.authorInfo.fullNameRu : null
      }))
    );
  });
  return authors;
});

export const authorsOptionsSelector = createSelector([authorsSelector, langSelector], (authors, lang) =>
  getOptionsFrom(authors, lang === 'ru' ? 'fullNameRu' : 'fullNameEn', 'id')
);
