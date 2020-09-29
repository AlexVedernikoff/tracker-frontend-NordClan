import React, { PureComponent, SyntheticEvent } from 'react';
import classnames from 'classnames';
import { Col, Row } from 'react-flexbox-grid/lib';
import cn from 'classnames';
import localize from './TestCaseCard.json';
import * as css from './TestCaseCard.scss';
import Checkbox from '~/components/Checkbox';
import { TestCaseInfo } from '../Types';

type TestCaseCardProp = {
  lang: 'en' | 'ru',
  testCase: TestCaseInfo,
  cardTitleDraw?: (testCase: TestCaseInfo) => React.ReactElement | React.ReactElement[] | null,
  cardActionsPlace?: (testCase: TestCaseInfo, showOnHover: string) => React.ReactElement | React.ReactElement[] | null,
  prefix: string,
  selection?:
  {
    isSelected: boolean,
    changeSelected: () => void
  }
}

export default class TestCaseCard extends PureComponent<TestCaseCardProp, {}> {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      cardTitleDraw,
      cardActionsPlace,
      prefix,
      testCase,
      selection,
      lang,
    } = this.props;

    const {id, priority, testCaseSeverity, authorInfo, testSuiteInfo} = testCase;

    const checked = (e: SyntheticEvent) => {
      if (selection) selection.changeSelected();
    }

    const titleDraw = cardTitleDraw || (({title}) => (<h4>{title}</h4>));

    return (
      <div className={classnames(css.testCaseCard, css[`priority-${priority}`])} onClick={checked}>
        <Row>
          <Col xs={12} sm={6}>
            { selection &&
              <div className={css.checkbox} >
                <Checkbox onChange={checked} checked={selection.isSelected}/>
              </div>
            }
            <div>
              <div className={css.header}>
                <div>
                  <div className={css.priorityMarker} data-tip={`${localize[lang].PRIORITY} ${priority}`}>
                    {priority}
                  </div>
                </div>
                {testCaseSeverity && (
                  <div className={cn(css.severity, css[`severity_${testCaseSeverity?.id ?? ''}`])}>{lang === 'ru' ? testCaseSeverity.name : testCaseSeverity.nameEn}</div>
                )}
                {testSuiteInfo && <div className={css.suite}>{`${localize[lang].SUITE} ${testSuiteInfo.title}`}</div>}
                <div className={css.id}>{`${prefix}-${id}`}</div>
              </div>
              { titleDraw(testCase) }
              { cardActionsPlace && cardActionsPlace(testCase, css.showOnHover) }
            </div>
          </Col>
          <Col xs={12} sm={6}>
            {authorInfo && (
              <div className={css.metabox}>
                <p className={css.meta}>
                  <span className={css.metaKey}>{localize[lang].AUTHOR}</span>
                  <span>
                    {lang === 'ru'
                      ? authorInfo.fullNameRu || authorInfo.fullNameEn
                      : authorInfo.fullNameEn || authorInfo.fullNameRu}
                  </span>
                </p>
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
