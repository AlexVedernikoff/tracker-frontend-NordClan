import { createSelector } from 'reselect';

import uniqBy from 'lodash/uniqBy';
import isNil from 'lodash/isNil';

import { langSelector } from './Localize';

import { getOptionsFrom } from '../helpers/selectOptions';

export const testCasesSelector = state => state.TestingCaseReference.testCases;

export const testSuitesSelector = state => Object.values(state.TestingCaseReference.testCases.withTestSuite);

export const authorIdSelector = state => state.Auth.user.id;

export const testSuitesOptionsSelector = createSelector([testSuitesSelector], testSuites => {
  const optionsFrom = getOptionsFrom([{ title: 'Without test suite', id: 'default' }, ...testSuites], 'title', 'id');

  return optionsFrom.reduce((accumulator, option) => {
    if ([option.label, option.value].some(isNil)) {
      return accumulator;
    }

    return [...accumulator, option];
  }, []);
});

export const authorsSelector = createSelector([testCasesSelector], testCases => {
  const authors = [...testCases.withoutTestSuite, ...testCases.withTestSuite].reduce((accumulator, testCase) => {
    if (testCase.authorInfo) {
      const { fullNameEn, fullNameRu } = testCase.authorInfo;

      return [
        ...accumulator,
        {
          id: testCase.authorId,
          fullNameEn,
          fullNameRu
        }
      ];
    }

    return accumulator;
  }, []);

  return uniqBy(authors, 'id');
});

export const authorsOptionsSelector = createSelector([authorsSelector, langSelector], (authors, lang) =>
  getOptionsFrom(authors, lang === 'ru' ? 'fullNameRu' : 'fullNameEn', 'id')
);
