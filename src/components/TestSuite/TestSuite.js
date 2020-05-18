import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as css from './TestSuite.scss';
import localize from './TestSuite.json';
import TestCaseCard from '../TestCaseCard';
import { UnmountClosed } from 'react-collapse';

class TestSuite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: true
    };
  }

  handleCollapse = () => {
    this.setState(state => {
      return { isOpened: !state.isOpened };
    });
  };

  render() {
    const {
      testSuite: { title, description, testCases }
    } = this.props;
    const { isOpened } = this.state;
    return (
      <section>
        <UnmountClosed isOpened={isOpened}>
          {testCases.map(testCase => (
            <TestCaseCard testCase={testCase} />
          ))}
        </UnmountClosed>
      </section>
    );
  }
}

TestSuite.propTypes = {
  testSuite: PropTypes.object
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  {}
)(TestSuite);
