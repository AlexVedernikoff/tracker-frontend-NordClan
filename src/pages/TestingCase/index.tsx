import TestingCase from './TestingCase';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { testCasesSelector } from '../../selectors/testingCaseReference';
import {
  getAllTestCases,
  updateTestCase,
  createTestCase,
  deleteTestCase,
  removeAttachment,
  uploadAttachments
} from '../../actions/TestCase';
import { createTestSuite, updateTestSuite, getAllTestSuites } from '../../actions/TestSuite';
import { getOptionsFrom } from '../../helpers/selectOptions';
import { getLocalizedTestCaseSeverities, getLocalizedTestCaseStatuses } from '../../selectors/dictionaries';
import { history } from '../../History';
import css from './TestingCase.scss';
import { TestSuite } from './types';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  isLoading: !!state.Loading.loading,
  statuses: getOptionsFrom<string, any>(getLocalizedTestCaseStatuses(state), 'name', 'id'),
  severities: getOptionsFrom<string, any>(getLocalizedTestCaseSeverities(state), 'name', 'id'),
  authorId: state.Auth.user.id,
  testCases: testCasesSelector(state)
});

const mapDispatchToProps = {
  updateTestCase,
  createTestCase,
  deleteTestCase,
  uploadAttachments,
  removeAttachment,
  createTestSuite,
  updateTestSuite,
  getAllTestSuites,
  getAllTestCases
};

type TestingCaseRouterProps = {
  lang: string,
  isLoading: boolean,
  statuses: {label: any, value: any}[],
  severities: {label: any, value: any}[],
  authorId: any,
  testCases: {withTestSuite: any[], withoutTestSuite: any[]},
  params: { id: any, },
  updateTestCase: (...args: any[]) => any,
  createTestCase: (...args: any[]) => any,
  deleteTestCase: (...args: any[]) => any,
  uploadAttachments: (...args: any[]) => any,
  removeAttachment: (...args: any[]) => any,
  createTestSuite: (...args: any[]) => any,
  updateTestSuite: (...args: any[]) => any,
  getAllTestSuites: (...args: any[]) => any,
  getAllTestCases: (...args: any[]) => any,
  onClose?: Function,
  testSuites?: TestSuite[],
  css?: any
  projectId: null | number
}

// Fix for Router
class TestingCaseRouter extends Component<TestingCaseRouterProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      testSuites: []
    };
  }

  componentDidMount() {
    this.props.getAllTestSuites().then(response => {
      const testSuites = response.data.map(el => {
        return { label: el.title, value: el.id };
      });

      this.setState({ testSuites }, () => {
        this.props.getAllTestCases();
      });
    });

    if (this.props.params.id === undefined) {
      setTimeout(function () {
        history.push('/testing-case-reference');
      }, 1000);
    }
  }

  render() {
    if (this.props.params.id === undefined) {
      return <span>No test case selected.</span>;
    }

    // withTestSuite is {} when not loaded
    const loaded = (this.props.testCases.withTestSuite.length || 0) + this.props.testCases.withoutTestSuite.length;
    if (loaded === 0) {
      return <span>{}</span>;
    }
    return <TestingCase {...this.props} testSuites={this.state.testSuites} css={css} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingCaseRouter);
