import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import Button from '../../../components/Button';
import { getLocalizedTestCaseSeverities } from '../../../components/CreateTestCaseModal/devMocks';
import withFiltersManager from '../../../components/FiltrersManager/FiltersManager';
import Input from '../../../components/Input';
import Priority from '../../../components/Priority';
import SelectDropdown from '../../../components/SelectDropdown';
import { removeNumChars } from '../../../utils/formatter';
import layoutAgnosticFilter from '../../../utils/layoutAgnosticFilter';
import { authorsMock, testSuitesMock } from '../devMocks';
import localize from './TestCasesFilter.json';
import * as css from './TestCasesFilter.scss';

const initialFilters = {
  title: '',
  priority: null,
  severityId: 1,
  testSuiteId: null,
  authorId: null
};

class TestCasesFilter extends React.Component {
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
    const { filters, testCases, onFilterChange } = this.props;
    const isMatchFilter = (filter, initFilter, value) => {
      return (
        filter === initFilter ||
        filter === value ||
        (typeof filter === 'string' && value.toLowerCase().startsWith(filter.toLowerCase().trim()))
      );
    };
    const isMatchAllFilters = item => {
      for (const key in filters) {
        if (
          !isMatchFilter(isObject(filters[key]) ? filters[key].value : filters[key], initialFilters[key], item[key])
        ) {
          return false;
        }
      }
      return true;
    };
    onFilterChange({
      withoutTestSuite: testCases.withoutTestSuite.filter(testCase => isMatchAllFilters(testCase)),
      withTestSuite: testCases.withTestSuite.reduce((filteredTestSuites, testSuite) => {
        const filteredTestCases = testSuite.testCases.filter(testCase => isMatchAllFilters(testCase));
        if (filteredTestCases.length > 0) filteredTestSuites.push({ ...testSuite, testCases: filteredTestCases });
        return filteredTestSuites;
      }, [])
    });
  };

  onInputChange = label => event => {
    this.onFilterChange(label)(event.target.value);
  };

  onTitleClear = () => {
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
      onCreateTestCaseClick
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
          <Col xs>
            <SelectDropdown
              name="severityId"
              placeholder={localize[lang].SEVERITY}
              multi={false}
              value={filters.severityId}
              onChange={this.onFilterChange('severityId')}
              noResultsText={localize[lang].NO_RESULTS}
              options={severitiesOptions}
              canClear
              onClear={() => this.onFilterChange('severityId')(initialFilters.severityId)}
            />
          </Col>
          <Col xs>
            <SelectDropdown
              name="testSuiteId"
              placeholder={localize[lang].SELECT_TEST_SUITE}
              multi={false}
              value={filters.testSuiteId}
              onChange={this.onFilterChange('testSuiteId')}
              noResultsText={localize[lang].NO_RESULTS}
              options={testSuitesOptions}
              canClear
              onClear={() => this.onFilterChange('testSuiteId')(initialFilters.testSuiteId)}
            />
          </Col>
          <Col xs>
            <SelectDropdown
              name="authorId"
              placeholder={localize[lang].SELECT_AUTHOR}
              multi={false}
              value={filters.authorId}
              onChange={this.onFilterChange('authorId')}
              onInputChange={removeNumChars}
              noResultsText={localize[lang].NO_RESULTS}
              options={authorsOptions}
              filterOption={layoutAgnosticFilter}
              canClear
              onClear={() => this.onFilterChange('authorId')(initialFilters.authorId)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

TestCasesFilter.propTypes = {
  authorsOptions: PropTypes.array.isRequired,
  clearFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  isFilterEmpty: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  mapFiltersToQuery: PropTypes.func.isRequired,
  onCreateTestCaseClick: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  setFilterValue: PropTypes.func.isRequired,
  severitiesOptions: PropTypes.array.isRequired,
  testCases: PropTypes.object.isRequired,
  testSuitesOptions: PropTypes.array.isRequired
};

const sortedOptions = options => {
  return options
    ? options.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        } else if (a.label > b.label) {
          return 1;
        }
      })
    : null;
};

const dictionaryTypesToOptions = dictionary =>
  dictionary.map(({ name, id }) => ({
    label: name,
    value: id
  }));

const testSuitesToOptions = testSuites => testSuites.map(({ id, title }) => ({ label: title, value: id }));

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  authorsOptions: authorsMock,
  severitiesOptions: dictionaryTypesToOptions(getLocalizedTestCaseSeverities(state)),
  testSuitesOptions: sortedOptions(testSuitesToOptions(testSuitesMock.withTestSuite))
});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFiltersManager(TestCasesFilter, initialFilters));
