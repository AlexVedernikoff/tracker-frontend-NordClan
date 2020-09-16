import React, { Component } from 'react';
import { func, string, object, array, number } from 'prop-types';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import Title from '../../components/Title';

import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/fp/map';
import flow from 'lodash//fp/flow';

import TestCasesFilter from './TestCasesFilter';
import TestSuite from './TestSuite';
import localize from './TestingCaseReference.json';
import * as css from './TestingCaseReference.scss';

import Button from '../../components/Button';
import CollapsibleRow from '../../components/CollapsibleRow';
import ScrollTop from '../../components/ScrollTop';
import Modal from '../../components/Modal';
import TestingCase from '../../pages/TestingCase';
import TestSuiteFormModal from '../../components/TestSuiteEditModal';

type TestingCaseReferenceProp = {
  addCasesToProject: (ids: number[]) => void | undefined,
  addCaseSuiteToProject: (case_id: number) => void | undefined,
  getAllTestCases: (...args: any[]) => any,
  getAllTestSuites: (...args: any[]) => any,
  lang: string,
  projectId: number | undefined,
  removeFromProject: (...args: any[]) => any | undefined,
  selectToProject: (...args: any[]) => any | undefined,
  testCases: { withoutTestSuite: any[], withTestSuite: any[] },
  testSuites: any[],
  updateTestSuite: (...args: any[]) => any,
};

type TestingCaseReferenceState = {
  isFiltersOpened: boolean,
  filteredTestCases: { withoutTestSuite: any[], withTestSuite: any[] } | null,
  modalKey: number,
  modalId: number,
  testSuiteTitle: string,
  testSuiteDescription: string,
  isTestSuiteModalOpened: boolean,
  isTestCaseModalOpened: boolean,
  selection: number[],
};

export default class TestingCaseReference extends Component<TestingCaseReferenceProp, TestingCaseReferenceState> {

  public filters?: { onClearAll: () => void };

  public state: TestingCaseReferenceState = {
    isFiltersOpened: false,
    filteredTestCases: null,
    modalKey: Math.random(),
    modalId: 0,
    testSuiteTitle: '',
    testSuiteDescription: '',
    isTestSuiteModalOpened: false,
    isTestCaseModalOpened: false,
    selection: [],
  };

  static propTypes = {
    addCasesToProject: func,
    addCaseSuiteToProject: func,
    getAllTestCases: func.isRequired,
    getAllTestSuites: func.isRequired,
    lang: string.isRequired,
    projectId: number,
    removeFromProject: func,
    selectToProject: func,
    testCases: object.isRequired,
    testSuites: array.isRequired,
    updateTestSuite: func.isRequired
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

  handleClearFilters = () => {
    this.filters?.onClearAll();
  };

  handleFilterChange = filteredTestCases => {
    this.setState({ filteredTestCases });
  };

  handleFiltersOpening = () => {
    this.setState(({ isFiltersOpened }) => ({ isFiltersOpened: !isFiltersOpened }));
  };

  handleModalOpening = () => {
    this.setState(() => ({ modalKey: Math.random(), modalId: -1, isTestCaseModalOpened: true }));
  };

  handleModalClosing = () => {
    this.setState(() => ({ modalKey: Math.random(), modalId: 0, isTestCaseModalOpened: false }));
    this.loadAllData();
  };

  handleTestSuiteModalOpen = (testSuiteTitle, testSuiteDescription, modalId) => {
    this.setState(() => ({ modalKey: Math.random(), modalId, testSuiteTitle, testSuiteDescription, isTestSuiteModalOpened: true }));
  };

  handleTestSuiteModalClosing = () => {
    this.setState(() => ({ modalKey: Math.random(), modalId: 0, isTestSuiteModalOpened: false }));
    this.loadAllData();
  };

  handleTestSuiteModalSave = (title, description, modalId) => {
    const { updateTestSuite } = this.props;
    updateTestSuite(
      modalId, {
        title,
        description
      }
    ).then(() => this.handleTestSuiteModalClosing());
  };

  handleModalTestCaseEditing = id => {
    this.setState(() => ({ modalKey: Math.random(), modalId: id, isTestCaseModalOpened: true }));
  };

  handleToggleSelection = (id: number) => {
    this.setState(({selection}) => {
      if (selection.includes(id)) {
        return { selection: selection.filter(s => s != id), };
      } else {
        return { selection: [...selection, id], };
      }
    });
  };

  getTestSuiteName = id => {
    const { testSuites } = this.props;
    const found = testSuites.find(el => el.id.toString() === id.toString());
    if (!found) return '#' + id;
    return found.title;
  };

  getTestSuiteDescription = id => {
    const { testSuites } = this.props;
    const found = testSuites.find(el => el.id.toString() === id.toString());
    if (!found) return null;
    if (found.description === found.title) return null;
    return (found.description || '').trim() || null;
  };

  render() {
    const { lang, addCasesToProject, addCaseSuiteToProject, removeFromProject, selectToProject, projectId, testCases } = this.props;
    const {
      isTestSuiteModalOpened,
      isTestCaseModalOpened,
      testSuiteTitle,
      testSuiteDescription,
      isFiltersOpened,
      selection,
    } = this.state;

    const { modalKey, modalId } = this.state;

    let { withTestSuite, withoutTestSuite } = this.state.filteredTestCases ? this.state.filteredTestCases : testCases;

    if (projectId !== undefined && withTestSuite.filter) {
      withTestSuite = withTestSuite.filter(el => el.projectId === projectId);
      withoutTestSuite = withoutTestSuite.filter(el => el.projectId === projectId);
    }

    const selectionToProject = ()=> {
      addCasesToProject(selection);
    }

    return (
      <div>
        {!addCasesToProject && <Title render="[Epic] - Testing Case Reference" />}
        <section>
          <header className={css.title}>
            {!removeFromProject && <h1 className={css.title}>{localize[lang].TITLE}</h1>}
          </header>
          <hr />
          <CollapsibleRow isOpened={isFiltersOpened} toggleOpen={this.handleFiltersOpening}>
            <TestCasesFilter
              testCases={testCases}
              onFilterChange={this.handleFilterChange}
              onCreateTestCaseClick={this.handleModalOpening}
            />
            <Row className={css.row}>
              <Col className={css.buttonCol}>
                {addCasesToProject && (
                  <>
                    <Button
                      onClick={selectionToProject}
                      type="primary"
                      text={localize[lang].SELECTION_TO_CASE}
                      icon="IconPlus"
                      name="right"
                    />
                    &nbsp;
                  </>
                )}
                <Button
                  onClick={this.handleModalOpening}
                  type="primary"
                  text={localize[lang].CREATE_TEST_CASE}
                  icon="IconPlus"
                  name="right"
                />
                {selectToProject && <React.Fragment>&nbsp;</React.Fragment>}
                {selectToProject && (
                  <Button
                    onClick={selectToProject}
                    type="primary"
                    text={localize[lang].SELECT_TEST_CASE}
                    icon="IconPlus"
                    name="right"
                  />
                )}
              </Col>
            </Row>
          </CollapsibleRow>
          {withoutTestSuite.length > 0 ? (
            <TestSuite
              defaultOpen
              title={localize[lang].TEST_CASE_WITHOUT_SUITE}
              description={null}
              testSuite={{ testCasesData: withoutTestSuite }}
              handleModalTestCaseEditing={this.handleModalTestCaseEditing}
              addCasesToProject={addCasesToProject}
              selection={selection}
              toggleSelection={this.handleToggleSelection}
              removeFromProject={removeFromProject}
              projectId={projectId}
            />
          ) : null}
          {withTestSuite.length > 0
            ? flow(
                groupBy('testSuiteId'),
                Object.entries,
                map(([key, value]) => (
                  <TestSuite
                    defaultOpen
                    title={this.getTestSuiteName(key)}
                    description={this.getTestSuiteDescription(key)}
                    modalId={key}
                    key={key}
                    testSuite={{ testCasesData: value }}
                    handleModalTestCaseEditing={this.handleModalTestCaseEditing}
                    handleTestSuiteModalOpen={this.handleTestSuiteModalOpen}
                    addCasesToProject={addCasesToProject}
                    addCaseSuiteToProject={addCaseSuiteToProject}
                    removeFromProject={removeFromProject}
                    selection={selection}
                    toggleSelection={this.handleToggleSelection}
                    projectId={projectId}
                  />
                ))
              )(withTestSuite)
            : null}
        </section>
        <Modal key='modal-case' isOpen={isTestCaseModalOpened} onRequestClose={this.handleModalClosing} closeTimeoutMS={200}>
          {(isTestCaseModalOpened && (
            <TestingCase
              key={modalKey}
              onClose={this.handleModalClosing}
              params={{ id: modalId }}
              projectId={projectId}
            />
          )) ||
            null}
        </Modal>
        <TestSuiteFormModal
          onClose={this.handleTestSuiteModalClosing}
          params={{ id: modalId }}
          title={testSuiteTitle}
          description={testSuiteDescription}
          isCreating
          onFinish={this.handleTestSuiteModalSave}
          isOpen={isTestSuiteModalOpened}
          modalId={modalId}
        />
        <ScrollTop />
      </div>
    );
  }
}
