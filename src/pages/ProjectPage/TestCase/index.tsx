import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  testCasesByProjectSelector,
  testSuitesByProjectSelector,
  testCasesByProjectLoading,
  testSuitesByProjectLoading,
} from '../../../selectors/testingCaseReference';
import {
  getAllTestCases,
  updateTestCase,
  createTestCase,
  deleteTestCase,
  removeAttachment,
  uploadAttachments
} from '../../../actions/TestCase';
import { createTestSuite, getAllTestSuites } from '../../../actions/TestSuite';
import { getOptionsFrom } from '../../../helpers/selectOptions';
import { getLocalizedTestCaseSeverities, getLocalizedTestCaseStatuses } from '../../../selectors/dictionaries';
import { TestingCase } from './TestingCase'

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  isLoading: !!state.Loading.loading,
  statuses: getOptionsFrom<string, any>(getLocalizedTestCaseStatuses(state), 'name', 'id'),
  severities: getOptionsFrom<string, any>(getLocalizedTestCaseSeverities(state), 'name', 'id'),
  authorId: state.Auth.user.id,
  testCases: testCasesByProjectSelector(state),
  testSuites: testSuitesByProjectSelector(state),
  testCasesLoading: testCasesByProjectLoading(state),
  testSuitesLoading: testSuitesByProjectLoading(state),
});

const mapDispatchToProps = {
  updateTestCase,
  createTestCase,
  deleteTestCase,
  uploadAttachments,
  removeAttachment,
  createTestSuite,
  getAllTestSuites,
  getAllTestCases,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingCase);
