import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import * as css from './TestCaseCard.scss';
import localize from './TestCaseCard.json';

class TestCaseCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      prefix,
      testCase: { id, title, priority, severity, authorInfo, testSuiteInfo },
      card,
      lang,
      ...other
    } = this.props;

    const classPriority = 'priority-' + priority;

    const authorName = lang === 'ru' ? authorInfo.fullNameRu : authorInfo.fullNameEn;

    return (
      <div
        className={classnames({
          [css.testCaseCard]: true,
          [css[classPriority]]: true,
          [css.card]: card
        })}
        {...other}
      >
        <Row>
          <Col xs={12} sm={6}>
            <div className={css.header}>
              <div>
                <div className={css.priorityMarker} data-tip={`${localize[lang].PRIORITY} ${status}`}>
                  {priority}
                </div>
              </div>
              <div className={css.redText}>{`${severity}`}</div>
              <div className={css.suite}>{`${localize[lang].SUITE} ${testSuiteInfo.title}`}</div>
              <div className={css.id}>{`${prefix}-${id}`}</div>
            </div>
            <Link to={`/test-case/${id}`} className={classnames([css.title, 'underline-link'])}>
              <h4>{title}</h4>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <div className={css.metabox}>
              <p className={css.meta}>
                <span className={css.metaKey}>{localize[lang].AUTHOR}</span>
                <span>{authorName}</span>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

TestCaseCard.propTypes = {
  card: PropTypes.bool,
  prefix: PropTypes.string,
  testCase: PropTypes.object
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  {}
)(TestCaseCard);
