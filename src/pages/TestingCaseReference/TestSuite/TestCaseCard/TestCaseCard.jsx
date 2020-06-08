import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { bool, string, oneOf, number, exact } from 'prop-types';
import { Col, Row } from 'react-flexbox-grid/lib';
import { Link } from 'react-router';

import localize from './TestCaseCard.json';
import * as css from './TestCaseCard.scss';

export default class TestCaseCard extends PureComponent {
  static propTypes = {
    authorInfo: exact({
      fullNameEn: string.isRequired,
      fullNameRu: string.isRequired
    }),
    card: bool,
    id: number.isRequired,
    lang: oneOf(['en', 'ru']).isRequired,
    prefix: string.isRequired,
    priority: number,
    testCaseSeverity: exact({
      id: number.isRequired,
      name: string.isRequired,
      nameEn: string.isRequired
    }),
    testSuiteInfo: undefined,
    title: string.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { prefix, id, title, priority, authorInfo, testSuiteInfo, testCaseSeverity, card, lang } = this.props;

    return (
      <div className={classnames(css.testCaseCard, css[`priority-${priority}`], { [css.card]: card })}>
        <Row>
          <Col xs={12} sm={6}>
            <div className={css.header}>
              <div>
                <div className={css.priorityMarker} data-tip={`${localize[lang].PRIORITY} ${priority}`}>
                  {priority}
                </div>
              </div>
              {testCaseSeverity && (
                <div className={css.redText}>{lang === 'ru' ? testCaseSeverity.name : testCaseSeverity.nameEn}</div>
              )}
              {testSuiteInfo && <div className={css.suite}>{`${localize[lang].SUITE} ${testSuiteInfo.title}`}</div>}
              <div className={css.id}>{`${prefix}-${id}`}</div>
            </div>
            <Link to={`/test-case/${id}`} className={classnames([css.title, 'underline-link'])}>
              <h4>{title}</h4>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            {authorInfo && (
              <div className={css.metabox}>
                <p className={css.meta}>
                  <span className={css.metaKey}>{localize[lang].AUTHOR}</span>
                  <span>{lang === 'ru' ? authorInfo.fullNameRu : authorInfo.fullNameEn}</span>
                </p>
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
