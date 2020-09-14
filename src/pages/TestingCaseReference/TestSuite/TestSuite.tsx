import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { object, bool, string, func, number } from 'prop-types';
import { UnmountClosed } from 'react-collapse';

import * as css from './TestSuite.scss';

import { IconArrowUp } from '../../../components/Icons';
import TestCaseCard from './TestCaseCard';
import localize from './TestSuite.json';

export default class TestSuite extends PureComponent<any, any> {
  static propTypes = {
    addToProject: func,
    defaultOpen: bool,
    description: string,
    handleModalTestCaseEditing: func.isRequired,
    handleTestSuiteModalOpen: func,
    lang: string.isRequired,
    modalId: string,
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

  handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const {
      description,
      title,
      modalId,
      handleTestSuiteModalOpen
    } = this.props;

    handleTestSuiteModalOpen(title, description, modalId);
  };

  render() {
    const {
      testSuite: { testCasesData },
      handleModalTestCaseEditing,
      handleTestSuiteModalOpen,
      lang,
      addToProject,
      removeFromProject,
      description,
      title
    } = this.props;
    const { isOpened } = this.state;

    const filtered = testCasesData.filter(testCase => {
      if (testCase.projectId !== null && testCase.projectId !== undefined && addToProject) return false;
      return true;
    });

    if (filtered.length === 0) return null;

    return (
      <section className={css.container}>
        <div className={css.header} onClick={this.handleCollapse}>
          <div className={css.actions}>
            <h3 className={css.title}>{title}</h3>
            <IconArrowUp className={classnames(css.showMoreIcon, { [css.iconReverse]: isOpened })} />
            { handleTestSuiteModalOpen &&
              <h3 className={css.edit} onClick={this.handleEdit}>{localize[lang].EDIT}</h3>
            }
          </div>
          { description &&
            <p className={classnames([css.description, 'text-info'])} dangerouslySetInnerHTML={{ __html: description }}></p>
          }
        </div>
        <div className={css.testCases}>
          <UnmountClosed isOpened={isOpened} springConfig={{ stiffness: 90, damping: 15 }}>
            {filtered.map(testCase => {
              const { id, title: cardTitle, priority, authorInfo, testSuiteInfo, testCaseSeverity } = testCase;

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
