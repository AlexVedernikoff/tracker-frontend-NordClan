import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { UnmountClosed } from 'react-collapse';
import { connect } from 'react-redux';
import { IconArrowUp } from '../Icons';
import TestCaseCard from '../TestCaseCard';
import * as css from './TestSuite.scss';

class TestSuite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false
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
      <section className={css.container}>
        <div className={css.header} onClick={this.handleCollapse}>
          <div className={css.actions}>
            <h3 className={css.title}>{title}</h3>
            <IconArrowUp
              className={classnames({
                [css.showMoreIcon]: true,
                [css.iconReverse]: isOpened
              })}
            />
          </div>
          <p className={classnames({ [css.description]: true, ['text-info']: true })}>{description}</p>
        </div>
        <div className={css.testCases}>
          <UnmountClosed isOpened={isOpened} springConfig={{ stiffness: 90, damping: 15 }}>
            {testCases.map(testCase => (
              <TestCaseCard key={testCase.id} prefix="S" testCase={testCase} />
            ))}
          </UnmountClosed>
        </div>
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
