import React, { Component } from 'react';
import cn from 'classnames';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import { Link } from 'react-router';
import Title from '~/components/Title';
import Button from '~/components/Button';
import TestSuiteFormModal from '~/components/TestSuiteEditModal';
import TestingCaseReference from '~/components/TestingCaseReference';
import { TestCaseInfo, TestSuiteInfo } from "~/components/TestingCaseReference/Types";

import localize from './TestingCaseReference.json';
import * as css from './TestingCaseReference.scss';

type TestingCaseReferenceProp = {
  addCasesToProject: (ids: number[]) => void | undefined,
  addCaseSuiteToProject: (case_id: number) => void | undefined,
  addToTestPlan: (ids: number[]) => void | undefined,
  addCaseSuiteToTestPlan: (case_id: number) => void | undefined,
  getAllTestCases: (...args: any[]) => any,
  getAllTestSuites: (...args: any[]) => any,
  lang: 'ru' | 'en',
  projectId: number | undefined,
  removeCaseSuiteFromProject: (case_id: number) => void,
  removeFromProject: (...args: any[]) => any | undefined,
  selectToProject: (...args: any[]) => any | undefined,
  testCases: { withoutTestSuite: any[], withTestSuite: any[] },
  testSuites: any[],
  updateTestSuite: (...args: any[]) => any,
  router: any,
  location: any;
};

type TestingCaseReferenceState = {
  testSuiteId: number,
  testSuiteTitle: string,
  testSuiteDescription: string,
  isTestSuiteModalOpened: boolean,
  selection: number[],
};

export default class TestingCaseReferencePage extends Component<TestingCaseReferenceProp, TestingCaseReferenceState> {

  public state: TestingCaseReferenceState = {
    testSuiteId: 0,
    testSuiteTitle: '',
    testSuiteDescription: '',
    isTestSuiteModalOpened: false,
    selection: [],
  };

  componentDidMount() {
    this.loadAllData();
  }

  loadAllData() {
    const { getAllTestCases, getAllTestSuites } = this.props;

    getAllTestSuites().then(() => {
      getAllTestCases();
    });
  }

  handleNewTestCase = () => {
    this.props.router.push(`/test-case/new`);
  };

  handleTestSuiteModalOpen = ({ id, title, description }: TestSuiteInfo) => {
    this.setState({
      testSuiteId: id || 0,
      testSuiteTitle: title,
      testSuiteDescription: description || '',
      isTestSuiteModalOpened: true,
    });
  };

  handleTestSuiteModalClosing = () => {
    this.setState({ testSuiteId: 0, isTestSuiteModalOpened: false });
    this.loadAllData();
  };

  handleTestSuiteModalSave = (title, description, testSuiteId) => {
    const { updateTestSuite } = this.props;
    updateTestSuite(
      testSuiteId, {
        title,
        description
      }
    ).then(() => this.handleTestSuiteModalClosing());
  };

  render() {
    const { lang, testSuites, testCases, router } = this.props;
    const { testSuiteId, testSuiteTitle, testSuiteDescription, isTestSuiteModalOpened, } = this.state;
    return (
      <>
        <TestingCaseReference
          title="[Epic] - Testing Case Reference"
          header={localize[lang].HEADER}
          lang={lang}
          testCases={[...testCases.withTestSuite, ...testCases.withoutTestSuite]}
          testSuites={testSuites}
          topButtons={() => (
            <Button text={localize[lang].CREATE_TEST_CASE} type="primary" onClick={this.handleNewTestCase} icon="IconPlus" />
          )}
          filterAddPlace={() => (
            <Button text={localize[lang].CREATE_TEST_CASE} type="primary" onClick={this.handleNewTestCase} icon="IconPlus" />
          )}
          cardTitleDraw={(testCase: TestCaseInfo) => (
            <Link
              to={`/test-case/${testCase.id}`}
              className={cn([css.title, 'underline-link'])}
            >
              <h4>{testCase.title}</h4>
            </Link>
          )}
          suiteActionPlace={(suite: TestSuiteInfo, showOnHover: string) => {
            if (!suite.id) return null;
            return (
              <h3 className={cn(showOnHover, css.editSuite)} onClick={(e) => {
                e.stopPropagation();
                this.handleTestSuiteModalOpen(suite);
              }}>
                {localize[lang].EDIT_TEST_SUITE}
              </h3>
            );
          }}
        />
        <TestSuiteFormModal
           onClose={this.handleTestSuiteModalClosing}
           params={{ id: testSuiteId }}
           title={testSuiteTitle}
           description={testSuiteDescription}
           onFinish={this.handleTestSuiteModalSave}
           isOpen={isTestSuiteModalOpened}
           modalId={testSuiteId}
           isCreating={false}
         />
      </>
    );
  }
}
