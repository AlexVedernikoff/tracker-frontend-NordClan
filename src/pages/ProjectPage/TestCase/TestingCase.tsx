import React, { Component } from 'react';
import TestingCaseForm from '../../../components/TestingCaseForm';
import { history } from '../../../History';

type TestingCaseProps = {
  lang: string,
  isLoading: boolean,
  statuses: {label: any, value: any}[],
  severities: {label: any, value: any}[],
  authorId: any,
  testCases: Record<string, {withTestSuite: any[], withoutTestSuite: any[]}>,
  params: { id: any, projectId: any },
  updateTestCase: (...args: any[]) => any,
  createTestCase: (...args: any[]) => any,
  deleteTestCase: (...args: any[]) => any,
  uploadAttachments: (...args: any[]) => any,
  removeAttachment: (...args: any[]) => any,
  createTestSuite: (...args: any[]) => any,
  getAllTestSuites: (...args: any[]) => any,
  getAllTestCases: (...args: any[]) => any,
  onClose?: Function,
  testSuites: Record<string, { title: string; id: number; }[]>,
  testCasesLoading: Record<string, boolean>,
  testSuitesLoading: Record<string, boolean>,
  projectId: null | number
}

export class TestingCase extends Component<TestingCaseProps, any> {
  componentDidMount() {
    const { getAllTestSuites, getAllTestCases, params } = this.props;
    getAllTestSuites(params.projectId).then(() => getAllTestCases(params.projectId));
  }

  render() {
    const {
      params: { projectId, id },
      testCasesLoading,
      testSuitesLoading,
      testCases,
      testSuites,
      createTestCase,
      updateTestCase,
      createTestSuite,
      getAllTestSuites,
    } = this.props;

    const isLoaded = testCasesLoading[projectId] === false && testSuitesLoading[projectId] === false;

    if (!isLoaded && id !== 'new') return null;

    return (
      <TestingCaseForm
        {...this.props}
        testCases={testCases[projectId] || { withTestSuite: [], withoutTestSuite: [] }}
        testSuites={(testSuites[projectId] || []).map(item => ({ label: item.title, value: item.id }))}
        successRedirect={() => history.push(`/projects/${projectId}/tests/cases`)}
        editRedirect={(id) => history.replace(`/projects/${projectId}/test-case/${id}`)}
        createTestCase={(params) => createTestCase({ ...params, projectId })}
        updateTestCase={(id, params) => updateTestCase(id, { ...params, projectId })}
        createTestSuite={(params) => createTestSuite({ ...params, projectId })}
        getAllTestSuites={() => getAllTestSuites(projectId)}
      />
    );
  }
}
