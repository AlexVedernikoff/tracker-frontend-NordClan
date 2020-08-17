import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { object, bool, string, func, number } from 'prop-types';
import { UnmountClosed } from 'react-collapse';

import * as css from './TestSuite.scss';

import { IconArrowUp } from '../../../components/Icons';
import TestCaseCard from './TestCaseCard';

export default class TestSuite extends PureComponent {
  static propTypes = {
    addToProject: func,
    defaultOpen: bool,
    handleModalTestCaseEditing: func.isRequired,
    projectId: number,
    removeFromProject: func,
    testSuite: object,
    title: string.isRequired
  };

  static defaultProps = {
    defaultOpen: false
  };

  constructor(props) {
    super(props);
    const { defaultOpen } = props;

    this.state = {
      isOpened: defaultOpen
    };
  }

  handleCollapse = () => {
    this.setState(({ isOpened }) => ({ isOpened: !isOpened }));
  };

  render() {
    const {
      testSuite: { description, testCasesData },
      handleModalTestCaseEditing,
      projectId,
      addToProject,
      removeFromProject,
      title
    } = this.props;
    const { isOpened } = this.state;

    return (
      <section className={css.container}>
        <div className={css.header} onClick={this.handleCollapse}>
          <div className={css.actions}>
            <h3 className={css.title}>{title}</h3>
            <IconArrowUp className={classnames(css.showMoreIcon, { [css.iconReverse]: isOpened })} />
          </div>
          <p className={classnames([css.description, 'text-info'])}>{description}</p>
        </div>
        <div className={css.testCases}>
          <UnmountClosed isOpened={isOpened} springConfig={{ stiffness: 90, damping: 15 }}>
            {testCasesData.map(testCase => {
              const { id, title: cardTitle, priority, authorInfo, testSuiteInfo, testCaseSeverity } = testCase;
              if (testCase.projectId !== null && testCase.projectId !== undefined && addToProject) return null;

              return (
                <TestCaseCard
                  key={id}
                  prefix="S"
                  id={id}
                  title={cardTitle}
                  priority={priority}
                  authorInfo={authorInfo}
                  testSuiteInfo={testSuiteInfo}
                  testCaseSeverity={testCaseSeverity}
                  handleModalTestCaseEditing={handleModalTestCaseEditing}
                  addToProject={addToProject}
                  removeFromProject={removeFromProject}
                />
              );
            })}
          </UnmountClosed>
        </div>
      </section>
    );
  }
}
