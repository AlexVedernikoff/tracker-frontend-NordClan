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
import css from './TestingCaseReference.scss';
import ConfirmModal from '~/components/ConfirmModal/ConfirmModal';

type TestingCaseReferenceProp = {
  addCasesToProject: (ids: number[]) => void | undefined,
  addCaseSuiteToProject: (case_id: number) => void | undefined,
  addToTestPlan: (ids: number[]) => void | undefined,
  addCaseSuiteToTestPlan: (case_id: number) => void | undefined,
  getAllTestCases: (...args: any[]) => any,
  getAllTestSuites: (...args: any[]) => any,
  deleteTestCase: (id: number) => void;
  lang: 'ru' | 'en',
  projectId: number | undefined,
  removeCaseSuiteFromProject: (case_id: number) => void,
  selectToProject: (...args: any[]) => any | undefined,
  testCases: { withoutTestSuite: any[], withTestSuite: any[] },
  testSuites: any[],
  updateTestSuite: (...args: any[]) => any,
  router: any,
  location: any;
  addAccess: boolean;
};

type TestingCaseReferenceState = {
  testSuiteId: number,
  testSuiteTitle: string,
  testSuiteDescription: string,
  isTestSuiteModalOpened: boolean,
  selection: number[],
  testCaseForDelete: number | null,
};

export default class TestingCaseReferencePage extends Component<TestingCaseReferenceProp, TestingCaseReferenceState> {

  public state: TestingCaseReferenceState = {
    testSuiteId: 0,
    testSuiteTitle: '',
    testSuiteDescription: '',
    isTestSuiteModalOpened: false,
    selection: [],
    testCaseForDelete: null,
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

  handleTestSuiteModalSave = async (title, description, testSuiteId) => {
    const { updateTestSuite } = this.props;
    return updateTestSuite(
      testSuiteId, {
        title,
        description
      }
    ).then(() => { this.handleTestSuiteModalClosing() });
  };

  handleConfirmDeleteTestCase = (testCaseId) => {
    this.setState({testCaseForDelete: testCaseId});
  }

  handleCancelConfirmDeleteTestCase = () => {
    this.setState({testCaseForDelete: null});
  }

  handleDeleteTestCase = async () => {
    if (this.state.testCaseForDelete != null) {
      await this.props.deleteTestCase(this.state.testCaseForDelete);
      this.loadAllData();
    }
    this.setState({testCaseForDelete: null});
  }

  render() {
    const { lang, testSuites, testCases, addAccess } = this.props;
    const { testSuiteId, testSuiteTitle, testSuiteDescription, isTestSuiteModalOpened, } = this.state;


    const addButton = addAccess ?
      (
        <Button text={localize[lang].CREATE_TEST_CASE} type="primary" onClick={this.handleNewTestCase} icon="IconPlus" />
      )
      : null;

    return (
      <>
        <TestingCaseReference
          title="[Epic] - Testing Case Reference"
          header={localize[lang].HEADER}
          lang={lang}
          testCases={[...testCases.withTestSuite, ...testCases.withoutTestSuite]}
          testSuites={testSuites}
          topButtons={() => addButton}
          filterAddPlace={() => addButton}
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
          cardActionsPlace={(testCase: TestCaseInfo, showOnHover: string) =>
            (<div className={cn(showOnHover, css.removeCase)} onClick={() => this.handleConfirmDeleteTestCase(testCase.id)}>
              {localize[lang].DELETE_TEST_CASE}
            </div>)
          }
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
        <ConfirmModal
          isOpen={this.state.testCaseForDelete != null}
          contentLabel="modal"
          text={localize[lang].DELETE_TEST_CASE_CONFIRM}
          onCancel={this.handleCancelConfirmDeleteTestCase}
          onConfirm={this.handleDeleteTestCase}
          onRequestClose={this.handleCancelConfirmDeleteTestCase}
        />
      </>
    );
  }
}
