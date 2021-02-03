import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { UnmountClosed } from 'react-collapse';

import * as css from './TestSuite.scss';

import { IconArrowUp, IconArrowDown } from '../../../components/Icons';
import TestCaseCard from '../TestCaseCard';
import { TestCaseInfo, TestSuiteInfo } from '../Types';

type TestSuiteProp = {
  lang: 'en' | 'ru',
  testSuite: TestSuiteInfo,
  testCases: TestCaseInfo[],
  testCaseCardTemplateClass?: string,
  preCardPlace?: (testCase: TestCaseInfo) => React.ReactElement | React.ReactElement[] | null,
  postCardPlace?: (testCase: TestCaseInfo) => React.ReactElement | React.ReactElement[] | null,
  cardClick?: (testCase: TestCaseInfo) => void,
  getMeta?: (testCase: TestCaseInfo) => {meta: string, value: string}[],
  suiteActionPlace?: (suite: TestSuiteInfo, showOnHover: string) => React.ReactElement | React.ReactElement[] | null,
  cardActionsPlace?: (testCase: TestCaseInfo, showOnHover: string) => React.ReactElement | React.ReactElement[] | null,
  cardTitleDraw?: (testCase: TestCaseInfo) => React.ReactElement | React.ReactElement[] | null,
  defaultOpen: boolean,
  selection? : {
    selectionElements: number[],
    toggleSelection: (id: number) => void,
  }
}

type TestSuiteState = {
  isOpened: boolean
}

export default class TestSuite extends PureComponent<TestSuiteProp, TestSuiteState> {
  constructor(props) {
    super(props);
  }

  state: TestSuiteState = {
    isOpened: this.props.defaultOpen ?? true
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultOpen !== nextProps.defaultOpen) {
      this.setState({isOpened: nextProps.defaultOpen});
    }
  }

  handleCollapse = () => {
    this.setState(({ isOpened }) => ({ isOpened: !isOpened }));
  };

  render() {
    const {
      lang,
      suiteActionPlace,
      testSuite,
      testCases,
      selection,
      cardActionsPlace,
      cardTitleDraw,
      testCaseCardTemplateClass, preCardPlace, postCardPlace, cardClick, getMeta
    } = this.props;

    if (testCases.length === 0 || !testSuite) return null;

    const { id, title, description } = testSuite;
    const { isOpened } = this.state;

    return (
      <section className={css.container}>
        <div className={css.header} onClick={this.handleCollapse}>
          <div className={css.actions}>
            <h3 className={css.title}>{title}</h3>
            <IconArrowDown className={classnames(css.showMoreIcon, { [css.iconReverse]: isOpened })} />
            { suiteActionPlace && suiteActionPlace(testSuite, css.showOnHover) }
          </div>
          {description &&
            <p className={classnames([css.description, 'text-info'])} dangerouslySetInnerHTML={{ __html: description }} />
          }
        </div>
        <div className={css.testCases}>
          <UnmountClosed isOpened={isOpened} springConfig={{ stiffness: 90, damping: 15 }}>
            {testCases.map(testCase => {
              const elementSelection = selection && {
                isSelected: selection.selectionElements.includes(testCase.id),
                changeSelected: () => selection.toggleSelection(testCase.id)
              };
              return (
                <TestCaseCard
                  lang={lang}
                  key={testCase.id}
                  testCase={testCase}
                  prefix="S"
                  cardTitleDraw={cardTitleDraw}
                  cardActionsPlace={cardActionsPlace}
                  selection={elementSelection}
                  testCaseCardTemplateClass={testCaseCardTemplateClass}
                  preCardPlace={preCardPlace}
                  postCardPlace={postCardPlace}
                  cardClick={cardClick}
                  getMeta={getMeta}
                />
              );
            })}
          </UnmountClosed>
        </div>
      </section>
    );
  }
}
