import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Title from 'react-title-component';
import CollapsibleRow from '../../components/CollapsibleRow';
import * as css from './TestingCaseReference.scss';
import Button from '../../components/Button';
import ScrollTop from '../../components/ScrollTop';
import CreateTestCaseModal from '../../components/CreateTestCaseModal/CreateTestCaseModal';
import withFiltersManager from '../../components/FiltrersManager/FiltersManager';
import ScrollTop from '../../components/ScrollTop';
import TestSuite from '../../components/TestSuite/TestSuite';
import { initialFilters } from './constants';
import { testSuitesMock } from './devMocks';
import TestCasesFilter from './TestCasesFilter';
import localize from './TestingCaseReference.json';
import * as css from './TestingCaseReference.scss';
class TestingCaseReference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFiltersOpened: false,
      testSuites: {},
      isCreateTestCaseModalOpened: false
    };
  }

  handleFiltersOpening = () => {
    this.setState({ isFiltersOpened: !this.state.isFiltersOpened });
  };

  handleModalOpening = () => {
    this.setState({ isCreateTestCaseModalOpened: !this.state.isCreateTestCaseModalOpened });
  };

  getFilteredItems = () => {
    const { filters, testSuites } = this.props;
    const isMatchFilter = (filter, initFilter, value) => {
      return (
        filter === initFilter ||
        filter === value ||
        (typeof filter === 'string' && value.toLowerCase().includes(filter.toLowerCase().trim()))
      );
    };
    return {
      withoutTestSuite: testSuites.withoutTestSuite.filter(testCase => {
        let isMatchFilters = true;
        for (const key in filters) {
          isMatchFilters = isMatchFilter(filters[key], initialFilters[key], testCase[key]);
        }
        return isMatchFilters;
      }),
      withTestSuite: testSuites.withTestSuite.map(testSuite => {
        const testCases = testSuite.testCases.filter(testCase => {
          let isMatchFilters = true;
          for (const key in filters) {
            isMatchFilters = isMatchFilter(filters[key], initialFilters[key], testCase[key]);
          }
          return isMatchFilters;
        });
        if (testCases.length > 0) {
          return { ...testSuite, testCases: testCases };
        }
      })
    };
  };

  renderTestCasesFilter = () => {
    const { filters, clearFilters, isFilterEmpty, setFilterValue } = this.props;
    return (
      <TestCasesFilter
        filters={filters}
        clearFilters={clearFilters}
        isFilterEmpty={isFilterEmpty}
        setFilterValue={setFilterValue}
      />
    );
  };

  render() {
    const { lang, testSuites } = this.props;
    const { isCreateTestCaseModalOpened, isFiltersOpened } = this.state;
    const { withTestSuite, withoutTestSuite } = this.getFilteredItems(testSuites);

    return (
      <div>
        <Title render={'[Epic] - Testing Case Reference'} />
        <section>
          <header className={css.title}>
            <h1 className={css.title}>{localize[lang].TITLE}</h1>
            <div>
              <Button onClick={this.handleModalOpening} text={'Create Test Case'} type="primary" icon="IconPlus" />
            </div>
          </header>
          <hr />
          <CollapsibleRow isOpened={isFiltersOpened} toggleOpen={this.handleFiltersOpening}>
            {this.renderTestCasesFilter()}
          </CollapsibleRow>
          {withoutTestSuite.length > 0 && (
            <TestSuite testSuite={{ title: 'Test cases without suite', testCases: withoutTestSuite }} />
          )}
          {withTestSuite.map(suite => (
            <TestSuite key={suite.id} testSuite={suite} />
          ))}
        </section>
        <CreateTestCaseModal isOpen={isCreateTestCaseModalOpened} onClose={this.handleModalOpening} />
        <ScrollTop />
      </div>
    );
  }
}

TestingCaseReference.propTypes = {
  checkFilterItemEmpty: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  isFilterEmpty: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  setFilterValue: PropTypes.func.isRequired,
  testSuites: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ lang: state.Localize.lang, testSuites: testSuitesMock });

const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFiltersManager(TestingCaseReference, initialFilters));
