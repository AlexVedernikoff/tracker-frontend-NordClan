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

export default class TestingCaseReference extends Component {
  static propTypes = {
    addToProject: func,
    getAllTestCases: func.isRequired,
    getAllTestSuites: func.isRequired,
    lang: string.isRequired,
    projectId: number,
    removeFromProject: func,
    selectToProject: func,
    testCases: object.isRequired,
    testSuites: array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isFiltersOpened: false,
      filteredTestCases: null,
      modalKey: Math.random(),
      modalId: 0,
      isTestCaseModalOpened: false
    };
  }

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
    this.filters.onClearAll();
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

  handleModalTestCaseEditing = id => {
    this.setState(() => ({ modalKey: Math.random(), modalId: id, isTestCaseModalOpened: true }));
  };

  getTestSuiteName = id => {
    const { testSuites } = this.props;
    const found = testSuites.find(el => el.id.toString() === id.toString());
    if (!found) return '#' + id;
    return found.title;
  };

  render() {
    const { lang, addToProject, removeFromProject, selectToProject, projectId, testCases } = this.props;
    const { isTestCaseModalOpened, isFiltersOpened } = this.state;
    const { modalKey, modalId } = this.state;

    let { withTestSuite, withoutTestSuite } = this.state.filteredTestCases ? this.state.filteredTestCases : testCases;

    if (projectId !== undefined && withTestSuite.filter) {
      withTestSuite = withTestSuite.filter(el => el.projectId === projectId);
      withoutTestSuite = withoutTestSuite.filter(el => el.projectId === projectId);
    }

    return (
      <div>
        {!addToProject && <Title render="[Epic] - Testing Case Reference" />}
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
              testSuite={{ testCasesData: withoutTestSuite }}
              handleModalTestCaseEditing={this.handleModalTestCaseEditing}
              addToProject={addToProject}
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
                    key={key}
                    testSuite={{ testCasesData: value }}
                    handleModalTestCaseEditing={this.handleModalTestCaseEditing}
                    addToProject={addToProject}
                    removeFromProject={removeFromProject}
                    projectId={projectId}
                  />
                ))
              )(withTestSuite)
            : null}
        </section>
        <Modal isOpen={isTestCaseModalOpened} onRequestClose={this.handleModalClosing} closeTimeoutMS={200}>
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
        <ScrollTop />
      </div>
    );
  }
}
