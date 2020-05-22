import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';
import Title from 'react-title-component';
import CollapsibleRow from '../../components/CollapsibleRow';
import * as css from './TestingCaseReference.scss';
import Button from '../../components/Button';
import ScrollTop from '../../components/ScrollTop';
import CreateTestCaseModal from '../../components/CreateTestCaseModal/CreateTestCaseModal';
import ScrollTop from '../../components/ScrollTop';
import TestSuite from '../../components/TestSuite/TestSuite';
import { testSuitesMock } from './devMocks';
import TestCasesFilter from './TestCasesFilter';
import localize from './TestingCaseReference.json';
import * as css from './TestingCaseReference.scss';
class TestingCaseReference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFiltersOpened: false,
      filteredTestCases: props.testCases,
      isCreateTestCaseModalOpened: false
    };
  }

  handleClearFilters = () => {
    this.filters.onClearAll();
  };
  handleFilterChange = filteredTestCases => {
    this.setState({ filteredTestCases: filteredTestCases });
  };

  handleFiltersOpening = () => {
    this.setState({ isFiltersOpened: !this.state.isFiltersOpened });
  };

  handleModalOpening = () => {
    this.setState({ isCreateTestCaseModalOpened: !this.state.isCreateTestCaseModalOpened });
  };
  render() {
    const { lang, testCases } = this.props;
    const { isCreateTestCaseModalOpened, isFiltersOpened } = this.state;
    const { withTestSuite, withoutTestSuite } = this.state.filteredTestCases;
    return (
      <div>
        <Title render={'[Epic] - Testing Case Reference'} />
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
  lang: PropTypes.string.isRequired,
  testCases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ lang: state.Localize.lang, testCases: testSuitesMock });

const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingCaseReference);
