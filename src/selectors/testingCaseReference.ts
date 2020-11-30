import { createSelector } from 'reselect';

import uniqBy from 'lodash/fp/uniqBy';
import isNil from 'lodash/fp/isNil';
import reduce from 'lodash/fp/reduce';
import flow from 'lodash/fp/flow';
import some from 'lodash/fp/some';
import flatten from 'lodash/fp/flatten';

import { langSelector } from './Localize';

import { getOptionsFrom } from '../helpers/selectOptions';

const someIsNil = some(isNil);
const uniqById = uniqBy('id');
const uniqByLabel = uniqBy('label');

export const testCasesSelector = state => state.TestingCaseReference.testCases;
export const testCasesByProjectSelector = state => state.TestingCaseReference.testCasesByProject;
export const testCasesReferenceSelector = state => state.TestingCaseReference.testCasesReference;
export const testCasesReferenceLoading = state => state.TestingCaseReference.isReferenceLoading;
export const testCasesByProjectLoading = state => state.TestingCaseReference.testCasesByProjectLoading;

export const testSuitesSelector = state => state.TestSuite.testSuites;
export const testSuitesByProjectSelector = state => state.TestSuite.testSuitesByProject;
export const testSuitesReferenceSelector = state => state.TestSuite.testSuitesReference;
export const testSuitesReferenceLoading = state => state.TestSuite.isReferenceLoading;
export const testSuitesByProjectLoading = state => state.TestSuite.testSuitesByProjectLoading

export const authorIdSelector = state => state.Auth.user.id;

export const testSuitesOptionsSelector = createSelector([testSuitesSelector], testSuites => {
  const optionsFrom = getOptionsFrom([...testSuites], 'title', 'id');

  return flow(
    reduce((accumulator, option) => {
      if (someIsNil([option.label, option.value])) {
        return accumulator;
      }

      return [...accumulator, option];
    }, []),
    uniqByLabel
  )(optionsFrom);
});

export const authorsSelector = createSelector([testCasesSelector], testCases => {
  return flow(
    Array.of,
    flatten,
    reduce((accumulator, testCase) => {
      if (testCase.authorInfo) {
        const { fullNameEn, fullNameRu } = testCase.authorInfo;

        return [
          ...accumulator,
          {
            id: testCase.authorId,
            fullNameEn: fullNameEn || fullNameRu,
            fullNameRu: fullNameRu || fullNameEn
          }
        ];
      }

      return accumulator;
    }, []),
    uniqById
  )(testCases.withoutTestSuite, testCases.withTestSuite);
});

export const authorsOptionsSelector = createSelector([authorsSelector, langSelector], (authors, lang) =>
  getOptionsFrom(authors, lang === 'ru' ? 'fullNameRu' : 'fullNameEn', 'id')
);
