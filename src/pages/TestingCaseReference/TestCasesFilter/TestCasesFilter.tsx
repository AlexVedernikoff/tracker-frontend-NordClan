import React, { Component } from 'react';
import { array, func, object, bool, string } from 'prop-types';
import { Col, Row } from 'react-flexbox-grid/lib';

import localize from './TestCasesFilter.json';
import * as css from './TestCasesFilter.scss';

import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Priority from '../../../components/Priority';
import Select from 'react-select';
import { removeNumChars } from '../../../utils/formatter';
import layoutAgnosticFilter from '../../../utils/layoutAgnosticFilter';

export default class TestCasesFilter extends Component<any, any> {
  static propTypes = {
    authorsOptions: array.isRequired,
    clearFilters: func.isRequired,
    filters: object.isRequired,
    getFilteredData: func.isRequired,
    initialFilters: object.isRequired,
    isFilterEmpty: bool.isRequired,
    lang: string.isRequired,
    mapFiltersToQuery: func.isRequired,
    onCreateTestCaseClick: func.isRequired,
    onFilterChange: func.isRequired,
    setFilterValue: func.isRequired,
    severitiesOptions: array.isRequired,
    testCases: object.isRequired,
    testSuitesOptions: array.isRequired
  };

  componentDidUpdate(prevProps) {
    if (prevProps.testCases !== this.props.testCases) {
      this.updateFilteredTestCases();
    }
  }

  onFilterChange = label => valued => {
    const { setFilterValue } = this.props;
    const value = valued ? { ...valued } : null;

    if (value && label === 'testSuiteId' && value.value === 'default') value.value = null;
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

    const withoutTestSuite = getFilteredData(testCases.withoutTestSuite);
    const withTestSuite = getFilteredData(testCases.withTestSuite);

    onFilterChange({ withoutTestSuite, withTestSuite });
  };

  onInputChange = label => event => {
    this.onFilterChange(label)(event.target.value);
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
      isFilterEmpty,
      authorsOptions,
      severitiesOptions,
      testSuitesOptions,
      onCreateTestCaseClick,
      initialFilters
    } = this.props;

    return (
      <div>
        <Row className={css.filtersRow}>
          <Col className={css.filterButtonCol}>
            <Priority onChange={this.onPriorityChange} priority={filters.priority} canEdit />
          </Col>
          <Col xs>
            <Input
              placeholder={localize[lang].TITLE}
              value={filters.title}
              inputRef={ref => (this.title = ref)}
              onChange={this.onInputChange('title')}
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
            <Button
              onClick={onCreateTestCaseClick}
              type="primary"
              text={localize[lang].CREATE_TEST_CASE}
              icon="IconPlus"
              name="right"
            />
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
