import React, { PureComponent, SyntheticEvent } from 'react';
import classnames from 'classnames';
import { Col, Row } from 'react-flexbox-grid/lib';
import cn from 'classnames';
import localize from './TestCaseCard.json';
import * as css from './TestCaseCard.scss';
import Checkbox from '~/components/Checkbox';
import { AuthorInfo, TestCaseInfo } from '../Types';

type TestCaseCardProp = {
  lang: 'en' | 'ru',
  testCase: TestCaseInfo,
  testCaseCardTemplateClass?: string,
  preCardPlace?: (testCase: TestCaseInfo) => React.ReactElement | React.ReactElement[] | null,
  postCardPlace?: (testCase: TestCaseInfo) => React.ReactElement | React.ReactElement[] | null,
  cardClick?: (testCase: TestCaseInfo) => void,
  cardTitleDraw?: (testCase: TestCaseInfo) => React.ReactElement | React.ReactElement[] | null,
  cardActionsPlace?: (testCase: TestCaseInfo, showOnHover: string) => React.ReactElement | React.ReactElement[] | null,
  prefix: string,
  selection?:
  {
    isSelected: boolean,
    changeSelected: () => void
  }
}

export class TestCaseCardAuthorInfo  extends PureComponent<{lang: 'en' | 'ru', authorInfo: AuthorInfo}, {}> {
  render() {

    const { lang, authorInfo } = this.props;
    const fullName = lang === 'ru' ? authorInfo.fullNameRu || authorInfo.fullNameEn : authorInfo.fullNameEn || authorInfo.fullNameRu;
    return (
      <div className={css.metabox}>
        <p className={css.meta}>
          <span className={css.metaKey}>{localize[lang].AUTHOR}</span>
          <span> {fullName} </span>
        </p>
      </div>
    );
  }
}

export default class TestCaseCard extends PureComponent<TestCaseCardProp, {}> {

  render() {
    const {
      cardTitleDraw,
      cardActionsPlace,
      prefix,
      testCase,
      selection,
      lang,
      testCaseCardTemplateClass,
      preCardPlace, postCardPlace, cardClick
    } = this.props;

    const {id, priority, testCaseSeverity, authorInfo, testSuiteInfo} = testCase;

    const checked = (e: SyntheticEvent) => {
      e.stopPropagation();
      if (cardClick) {
        cardClick(testCase);
      }
      else {
        if (selection) selection.changeSelected();
      }
    }

    const titleDraw = cardTitleDraw || (({title}) => (<h4>{title}</h4>));

    const templateClass = testCaseCardTemplateClass ?? css["testCaseCard--default_template"];

    return (
      <div className={classnames(css.testCaseCard, css[`priority-${priority}`], templateClass)} onClick={checked}>
        {preCardPlace && preCardPlace(testCase)}
        <div>
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
        </div>
        <div>
            {authorInfo && <TestCaseCardAuthorInfo lang={lang} authorInfo={authorInfo} />}
        </div>
        {postCardPlace && postCardPlace(testCase)}
      </div>
    );
  }
}
