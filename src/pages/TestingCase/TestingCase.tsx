import React, { Component } from 'react';
import TestingCaseForm from '../../components/TestingCaseForm';
import { history } from '../../History';

type TestingCaseProps = {
  lang: string,
  isLoading: boolean,
  statuses: {label: any, value: any}[],
  severities: {label: any, value: any}[],
  authorId: any,
  testCases: {withTestSuite: any[], withoutTestSuite: any[]},
  params: { id: any, },
  isCasesLoading: boolean;
  isSuitesLoading: boolean;
  updateTestCase: (...args: any[]) => any,
  createTestCase: (...args: any[]) => any,
  deleteTestCase: (...args: any[]) => any,
  uploadAttachments: (...args: any[]) => any,
  removeAttachment: (...args: any[]) => any,
  createTestSuite: (...args: any[]) => any,
  getAllTestSuites: (...args: any[]) => any,
  getAllTestCases: (...args: any[]) => any,
  onClose?: Function,
  testSuites: { title: string; id: number; }[],
  projectId: null | number
}

export class TestingCase extends Component<TestingCaseProps, any> {
  componentDidMount() {
    const { getAllTestSuites, getAllTestCases, params } = this.props;
    getAllTestSuites().then(() => getAllTestCases());

    if (this.props.params.id === undefined) {
      setTimeout(function () {
        history.push('/testing-case-reference');
      }, 1000);
    }
  }

  render() {
    const { isCasesLoading, isSuitesLoading, params } = this.props;

    const isLoaded = !isCasesLoading && !isSuitesLoading;

    if (!isLoaded && params.id !== 'new') return null;

    return (
      <TestingCaseForm
        {...this.props}
        testSuites={this.props.testSuites.map(item => ({ label: item.title, value: item.id }))}
        successRedirect={() => history.push('/testing-case-reference')}
        editRedirect={(id) => history.replace(`/test-case/${id}`)}
        getAllTestSuites={() => this.props.getAllTestSuites()}
      />
    );
  }
}
