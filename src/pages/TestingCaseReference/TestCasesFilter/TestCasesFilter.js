import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import Button from '../../../components/Button';
import { getLocalizedTestCaseSeverities } from '../../../components/CreateTestCaseModal/devMocks';
import Input from '../../../components/Input';
import Priority from '../../../components/Priority';
import SelectDropdown from '../../../components/SelectDropdown';
import { removeNumChars } from '../../../utils/formatter';
import layoutAgnosticFilter from '../../../utils/layoutAgnosticFilter';
import { authorsMock, testSuitesMock } from '../devMocks';
import localize from './TestCasesFilter.json';
import * as css from './TestCasesFilter.scss';

class TestCasesFilter extends React.Component {
  onFilterChange = label => value => {
    const { setFilterValue } = this.props;
    setFilterValue(label, value);
  };

  render() {
    const {
      lang,
      filters,
      isFilterEmpty,
      clearFilters,
      authorsOptions,
      severitiesOptions,
      testSuitesOptions
    } = this.props;
    return (
      <div className={css.filtersRowWrapper}>
        <Row className={css.filtersRow}>
          <Col className={css.filterButtonCol}>
            <Priority
              onChange={this.onFilterChange('priorityId')}
              priority={filters.priorityId}
              priorityTitle={localize[lang].PRIORITY}
              canEdit
            />
          </Col>
          <Col className={css.filterButtonCol}>
            <Input
              placeholder={localize[lang].TITLE}
              defaultValue={filters.title}
              onChange={this.onFilterChange('title')}
              canClear
              onClear={() => this.onFilterChange('title')('')}
            />
          </Col>
          <Col className={css.filterButtonCol}>
            <Button
              onClick={() => {}}
              type="primary"
              text={localize[lang].CREATE_TEST_CASE}
              icon="IconPlus"
              name="right"
            />
          </Col>
          <Col className={css.filterButtonCol}>
            <Button
              onClick={clearFilters}
              type="primary"
              text={localize[lang].CLEAR_FILTERS}
              icon="IconBroom"
              name="right"
              disabled={isFilterEmpty}
            />
          </Col>
        </Row>
        <Row className={css.filtersRow}>
          <SelectDropdown
            name="severityId"
            placeholder={localize[lang].SEVERITY}
            multi={false}
            value={filters.severityId}
            onChange={this.onFilterChange('severityId')}
            noResultsText={localize[lang].NO_RESULTS}
            options={severitiesOptions}
            canClear
            onClear={() => this.onFilterChange('severityId')(null)}
          />
          <SelectDropdown
            name="testSuiteId"
            placeholder={localize[lang].SELECT_TEST_SUITE}
            multi={false}
            value={filters.testSuiteId}
            onChange={this.onFilterChange('testSuiteId')}
            noResultsText={localize[lang].NO_RESULTS}
            options={testSuitesOptions}
            canClear
            onClear={() => this.onFilterChange('testSuiteId')(null)}
          />
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
            onClear={() => this.onFilterChange('authorId')(null)}
          />
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
  setFilterValue: PropTypes.func.isRequired,
  severitiesOptions: PropTypes.array.isRequired,
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
)(TestCasesFilter);
