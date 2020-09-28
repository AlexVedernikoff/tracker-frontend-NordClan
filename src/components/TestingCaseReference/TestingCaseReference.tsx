import React, { Component } from 'react';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import Title from '../../components/Title';

import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/fp/map';
import flow from 'lodash//fp/flow';

import TestCasesFilter from './TestCasesFilter';
import TestSuite from './TestSuite';
import localize from './TestingCaseReference.json';
import * as css from './TestingCaseReference.scss';

import CollapsibleRow from '../../components/CollapsibleRow';
import ScrollTop from '../../components/ScrollTop';
import { TestCaseInfo, TestSuiteInfo } from './Types';

type TestingCaseReferenceProp = {
  lang: 'ru' | 'en',
  title?: string,
  header?: string,
  selectable?: boolean,
  testCases: TestCaseInfo[],
  testSuites: TestSuiteInfo[],
  filterAddPlace?: () => React.ReactElement | React.ReactElement[] | null,
  topButtons?: () => React.ReactElement | React.ReactElement[] | null,
  suiteActionPlace?: (testSuite: TestSuiteInfo, showOnHover: string) => React.ReactElement | React.ReactElement[] | null,
  cardTitleDraw?: (testCase: TestCaseInfo) => React.ReactElement | React.ReactElement[] | null,
  cardActionsPlace?: (testCase: TestCaseInfo, showOnHover: string) => React.ReactElement | React.ReactElement[] | null,
};


export default class TestingCaseReference extends Component<TestingCaseReferenceProp, any> {

  public filters?: { onClearAll: () => void };

  public state: any = {
    isFiltersOpened: false,
    filteredTestCases: null,
    selection: [],
  };

  public get selection() {
    return this.state.selection;
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

  handleToggleSelection = (id: number) => {
    this.setState(({selection}) => {
      if (selection.includes(id)) {
        return { selection: selection.filter(s => s != id), };
      } else {
        return { selection: [...selection, id], };
      }
    });
  };

  render() {
    const {
      lang, title, header, testCases, testSuites, selectable,
      suiteActionPlace, cardActionsPlace, filterAddPlace, cardTitleDraw
    } = this.props;


    const testSuiteMap = testSuites.reduce((p, suite) => {
      if (suite.id == null || suite.id == undefined) return p;
      return {...p, [suite.id] : suite};
    }, {});
    const getTestSuiteById = (suiteId: number): TestSuiteInfo | undefined => {
      if (suiteId in testSuiteMap) return testSuiteMap[suiteId];
      return undefined;
    }

    const {
      filteredTestCases,
      isFiltersOpened,
      selection,
    } = this.state;

    let { withTestSuite, withoutTestSuite } = (filteredTestCases ?? testCases).reduce((p, testCase: TestCaseInfo) => {
      if (testCase.testSuiteId == null) {
        p.withoutTestSuite.push(testCase);
      } else {
        p.withTestSuite.push(testCase);
      }
      return p;
    }, { withTestSuite: [] as TestCaseInfo[], withoutTestSuite: [] as TestCaseInfo[] } );

    const selectionAttr = selectable ? {
      selectionElements: selection,
      toggleSelection: this.handleToggleSelection
    } : undefined;

    return (
      <div>
        {title && <Title render={title} />}
        <section>
          <header className={css.title}>
            {header && (<h1 className={css.title}>{header}</h1>)}
          </header>
          <hr />
          <CollapsibleRow isOpened={isFiltersOpened} toggleOpen={this.handleFiltersOpening}>
            <TestCasesFilter
              lang={lang}
              testCases={testCases}
              testSuites={testSuites}
              onFilterChange={this.handleFilterChange}
              filterAddPlace={filterAddPlace}
            />
            <Row className={css.row}>
              <Col className={css.buttonCol}>
                {
                  this.props.topButtons && this.props.topButtons()
                }
              </Col>
            </Row>
          </CollapsibleRow>
          {withoutTestSuite.length > 0 ? (
            <TestSuite
              lang={lang}
              defaultOpen
              testSuite={{
                title: localize[lang].TEST_CASE_WITHOUT_SUITE,
              }}
              testCases={withoutTestSuite}
              selection={selectionAttr}
              suiteActionPlace={suiteActionPlace}
              cardActionsPlace={cardActionsPlace}
              cardTitleDraw={cardTitleDraw}
            />
          ) : null}
          {withTestSuite.length > 0
            ? flow(
                groupBy('testSuiteId'),
                Object.entries,
                map(([suiteId, testCases]) => (
                  <TestSuite
                    lang={lang}
                    key={suiteId}
                    defaultOpen
                    testSuite={getTestSuiteById(suiteId)!}
                    testCases={testCases}
                    selection={selectionAttr}
                    suiteActionPlace={suiteActionPlace}
                    cardActionsPlace={cardActionsPlace}
                    cardTitleDraw={cardTitleDraw}
                  />
                ))
              )(withTestSuite)
            : null}
        </section>
        <ScrollTop />
      </div>
    );
  }
}
