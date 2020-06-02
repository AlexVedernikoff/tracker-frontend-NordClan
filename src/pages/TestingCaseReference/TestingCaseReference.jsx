import React, { Component } from 'react';
import { func, string, object } from 'prop-types';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import Title from 'react-title-component';

import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/fp/map';
import flow from 'lodash//fp/flow';

import TestCasesFilter from './TestCasesFilter';
import TestSuite from './TestSuite';
import localize from './TestingCaseReference.json';
import * as css from './TestingCaseReference.scss';

import Button from '../../components/Button';
import CollapsibleRow from '../../components/CollapsibleRow';
import CreateTestCaseModal from './CreateTestCaseModal';
import ScrollTop from '../../components/ScrollTop';

export default class TestingCaseReference extends Component {
  static propTypes = {
    getAllTestCases: func.isRequired,
    lang: string.isRequired,
    testCases: object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isFiltersOpened: false,
      filteredTestCases: null,
      isCreateTestCaseModalOpened: false
    };
  }

  componentDidMount() {
    const { getAllTestCases } = this.props;

    getAllTestCases();
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
    this.setState(({ isCreateTestCaseModalOpened }) => ({ isCreateTestCaseModalOpened: !isCreateTestCaseModalOpened }));
  };
  render() {
    const { lang, testCases } = this.props;
    const { isCreateTestCaseModalOpened, isFiltersOpened } = this.state;

    const { withTestSuite, withoutTestSuite } = this.state.filteredTestCases ? this.state.filteredTestCases : testCases;

    return (
      <div>
        <Title render="[Epic] - Testing Case Reference" />
        <section>
          <header className={css.title}>
            <h1 className={css.title}>{localize[lang].TITLE}</h1>
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
              </Col>
            </Row>
          </CollapsibleRow>
          {withoutTestSuite.length > 0 ? (
            <TestSuite
              defaultOpen
              title={localize[lang].TEST_CASE_WITHOUT_SUITE}
              testSuite={{ testCasesData: withoutTestSuite }}
            />
          ) : null}
          {withTestSuite.length > 0
            ? flow(
                groupBy('title'),
                Object.entries,
                map(([key, value]) => (
                  <TestSuite defaultOpen title={key} key={key} testSuite={{ testCasesData: value }} />
                ))
              )(withTestSuite)
            : null}
        </section>
        <CreateTestCaseModal isOpen={isCreateTestCaseModalOpened} onClose={this.handleModalOpening} />
        <ScrollTop />
      </div>
    );
  }
}
