import TestingCase from './TestingCase';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { testCasesSelector } from '../../selectors/testingCaseReference';
import { getAllTestCases, updateTestCase, createTestCase } from '../../actions/TestCase';
import { getOptionsFrom } from '../../helpers/selectOptions';
import { getLocalizedTestCaseSeverities, getLocalizedTestCaseStatuses } from '../../selectors/dictionaries';
import { testSuitesOptionsSelector } from '../../selectors/testingCaseReference';
import { history } from '../../History';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  isLoading: !!state.Loading.loading,
  statuses: getOptionsFrom(getLocalizedTestCaseStatuses(state), 'name', 'id'),
  severities: getOptionsFrom(getLocalizedTestCaseSeverities(state), 'name', 'id'),
  testSuites: testSuitesOptionsSelector(state),
  authorId: state.Auth.user.id,
  testCases: testCasesSelector(state)
});

const mapDispatchToProps = {
  updateTestCase,
  createTestCase,
  getAllTestCases
};

// Fix for Router
class TestingCaseRouter extends Component {
  componentDidMount() {
    this.props.getAllTestCases();
    if (this.props.params.id === undefined) {
      setTimeout(function() {
        history.push('/testing-case-reference');
      }, 1000);
    }
  }

  render() {
    if (this.props.params.id === undefined) {
      return <span>No test case selected.</span>;
    }

    // withTestSuite is {} when not loaded
    const loaded = (this.props.testCases.withTestSuite.length || 0) + this.props.testCases.withoutTestSuite.length;
    console.log(this.props.testCases, loaded);
    if (loaded === 0) {
      return <span>{}</span>;
    }
    return <TestingCase {...this.props} key={this.props.params.id} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingCaseRouter);
