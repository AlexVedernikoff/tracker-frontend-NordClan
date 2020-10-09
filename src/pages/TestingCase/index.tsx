import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  testCasesReferenceSelector,
  testSuitesReferenceSelector,
  testCasesReferenceLoading,
  testSuitesReferenceLoading,
} from '../../selectors/testingCaseReference';
import {
  getTestCasesReference,
  updateTestCase,
  createTestCase,
  deleteTestCase,
  removeAttachment,
  uploadAttachments
} from '../../actions/TestCase';
import { createTestSuite, getTestSuitesReference } from '../../actions/TestSuite';
import { getOptionsFrom } from '../../helpers/selectOptions';
import { getLocalizedTestCaseSeverities, getLocalizedTestCaseStatuses } from '../../selectors/dictionaries';
import { TestingCase } from './TestingCase'

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  isLoading: !!state.Loading.loading,
  statuses: getOptionsFrom<string, any>(getLocalizedTestCaseStatuses(state), 'name', 'id'),
  severities: getOptionsFrom<string, any>(getLocalizedTestCaseSeverities(state), 'name', 'id'),
  authorId: state.Auth.user.id,
  testCases: testCasesReferenceSelector(state),
  testSuites: testSuitesReferenceSelector(state),
  isCasesLoading: testCasesReferenceLoading(state),
  isSuitesLoading: testSuitesReferenceLoading(state),
});

const mapDispatchToProps = {
  updateTestCase,
  createTestCase,
  deleteTestCase,
  uploadAttachments,
  removeAttachment,
  createTestSuite,
  getAllTestSuites: getTestSuitesReference,
  getAllTestCases: getTestCasesReference,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingCase);
