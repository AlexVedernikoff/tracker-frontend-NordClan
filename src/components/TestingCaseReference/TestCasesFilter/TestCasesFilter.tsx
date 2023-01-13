import React, { Component } from 'react';
import { array, func, object, bool, string } from 'prop-types';
import { Col, Row } from 'react-flexbox-grid/lib';

import localize from './TestCasesFilter.json';
import css from './TestCasesFilter.scss';

import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Priority from '../../../components/Priority';
import { removeNumChars } from '../../../utils/formatter';
import layoutAgnosticFilter from '../../../utils/layoutAgnosticFilter';
import Select from 'react-select';
import { TestCaseInfo, TestSuiteInfo } from '../Types';
import { getOptionsFrom } from '~/helpers/selectOptions';

export type FiltersType = {
  title: string,
  priority: number,
  severityId: {label: string, value: string},
  testSuiteId: {label: string, value: string},
  authorId: {label: string, value: string},
};

type TestCasesFilterProp = {
  lang: 'ru' | 'en',
  testCases: TestCaseInfo[],
  testSuites: TestSuiteInfo[],
  onFilterChange: (filteredTestCases: TestCaseInfo[]) => void,
  filterAddPlace?: () => React.ReactElement | React.ReactElement[] | null,
  initialFilters: FiltersType,
  getFilteredData: (data: TestCaseInfo[]) => TestCaseInfo[],
  filters: FiltersType,
  setFilterValue: (label: keyof FiltersType, value: any, callback: () => void) => void,
  clearFilters: (customFields?: Partial<FiltersType>, callback?: () => void) => void,
  checkFilterItemEmpty: (filterName: string) => boolean,
  isFilterEmpty: boolean,
  mapFiltersToUrl: () => string,
  mapFiltersToQuery: () => string,
}

export default class TestCasesFilter extends Component<TestCasesFilterProp, any> {
  title: any;

  componentDidUpdate(prevProps) {
    if (prevProps.testCases !== this.props.testCases || prevProps.filters !== this.props.filters) {
      this.updateFilteredTestCases();
    }
  }

  onFilterChange = label => value => {
    const { setFilterValue } = this.props;
    setFilterValue(label, value, this.updateFilteredTestCases);
  };

  onPriorityChange = option => {
    this.onFilterChange('priority')(option.prioritiesId ? option.prioritiesId : null);
  };

  onClearAll = () => {
    const { clearFilters, onFilterChange, testCases } = this.props;

    this.onTitleClear();
    clearFilters();
    onFilterChange(testCases);
  };

  updateFilteredTestCases = () => {
    const { testCases, onFilterChange, getFilteredData } = this.props;
    const filtredTestSuite = getFilteredData(testCases);
    onFilterChange( filtredTestSuite );
  };

  onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.onFilterChange("title")(event.target?.value);
  };

  onTitleClear = () => {
    const { initialFilters } = this.props;

    this.title.value = initialFilters.title;
    this.onFilterChange('title')(initialFilters.title);
  };

  render() {
    const {
      lang,
      filters,
      testCases,
      testSuites,
      isFilterEmpty,
      filterAddPlace,
      initialFilters
    } = this.props;

    const optDict = testCases.reduce(({authors, severities}, testCase) => {
      if (testCase.authorId != undefined && !(testCase.authorId in authors) ) {
        authors = { ... authors, [testCase.authorId]: { ... testCase.authorInfo, id: testCase.authorId }};
      }
      if (testCase.severityId != undefined && !(testCase.severityId in severities) ) {
        severities = { ... severities, [testCase.severityId]: {...testCase.testCaseSeverity, id: testCase.severityId}};
      }
      return {authors, severities, testSuites};
    }, {
      authors: {} as Record<string, any>,
      severities: {} as Record<string, any>,
    });

    const authorsOptions = getOptionsFrom<string, string>(Object.values(optDict.authors), lang === 'ru' ? 'fullNameRu' : 'fullNameEn', 'id')
    const severitiesOptions = getOptionsFrom<string, string>(Object.values(optDict.severities), lang === 'ru' ? 'name' : 'nameEn', 'id')
    const testSuitesOptions = getOptionsFrom<string, string>(testSuites, 'title', 'id')


    return (
      <div>
        <Row className={css.filtersRow}>
          <Col className={css.filterButtonCol}>
            <Priority onChange={this.onPriorityChange} priority={filters.priority} canEdit priorityTitle=''/>
          </Col>
          <Col xs>
            <Input
              placeholder={localize[lang].TITLE}
              value={filters.title}
              inputRef={ref => (this.title = ref)}
              onChange={this.onTitleChange}
              canClear
              onClear={this.onTitleClear}
            />
          </Col>
          <Col className={css.filterButtonCol}>
            <Button
              onClick={this.onClearAll}
              type="primary"
              text={localize[lang].CLEAR_FILTERS}
              icon="IconBroom"
              name="right"
              disabled={isFilterEmpty}
            />
          </Col>
          <Col className={css.filterButtonCol}>
            { filterAddPlace &&  filterAddPlace() }
          </Col>
        </Row>
        <Row className={css.filtersRow}>
          <Col xs key="severityId">
            <Select
              name="severityId"
              placeholder={localize[lang].SEVERITY}
              multi={false}
              value={filters.severityId}
              onChange={this.onFilterChange('severityId')}
              noResultsText={localize[lang].NO_RESULTS}
              options={severitiesOptions}
              isClearable
              onClear={() => this.onFilterChange('severityId')(initialFilters.severityId)}
            />
          </Col>
          <Col xs key="testSuiteId">
            <Select
              name="testSuiteId"
              placeholder={localize[lang].SELECT_TEST_SUITE}
              multi={false}
              value={filters.testSuiteId}
              onChange={this.onFilterChange('testSuiteId')}
              noResultsText={localize[lang].NO_RESULTS}
              options={testSuitesOptions}
              isClearable
              onClear={() => this.onFilterChange('testSuiteId')(initialFilters.testSuiteId)}
            />
          </Col>
          <Col xs key="authorId">
            <Select
              name="authorId"
              placeholder={localize[lang].SELECT_AUTHOR}
              multi={false}
              value={filters.authorId}
              onChange={this.onFilterChange('authorId')}
              onInputChange={removeNumChars}
              noResultsText={localize[lang].NO_RESULTS}
              options={authorsOptions}
              filterOption={layoutAgnosticFilter}
              isClearable
              onClear={() => this.onFilterChange('authorId')(initialFilters.authorId)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
