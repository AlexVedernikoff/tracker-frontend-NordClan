import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { object, bool, string, func, number } from 'prop-types';
import { UnmountClosed } from 'react-collapse';

import * as css from './TestSuite.scss';

import { IconArrowUp } from '../../../components/Icons';
import TestCaseCard from '../TestCaseCard';
import localize from './TestSuite.json';

type TestSuiteProp = {
  lang: string,
  title: string
  handleModalTestCaseEditing: (...args: any[]) => any,
  testSuite: { testCasesData: any[] },
  addCasesToProject?: (...args: any[]) => any,
  addCaseSuiteToProject?: (case_id: number) => void,
  defaultOpen?: boolean,
  description?: string,
  handleTestSuiteModalOpen?: (...args: any[]) => any,
  modalId?: string,
  projectId?: number,
  removeCaseSuiteFromProject: (case_id: number) => void,
  removeFromProject?: (...args: any[]) => any,
  selection : number[],
  toggleSelection: (id) => void,
}

type TestSuiteState = {
  isOpened: boolean
}

export default class TestSuite extends PureComponent<TestSuiteProp, TestSuiteState> {
  static propTypes = {
    addCasesToProject: func,
    addCaseSuiteToProject: func,
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

    if (handleTestSuiteModalOpen) handleTestSuiteModalOpen(title, description, modalId);
  };

  handleAddCaseSuiteToProject = (e) => {
    const { modalId, addCaseSuiteToProject } = this.props;

    if (addCaseSuiteToProject) addCaseSuiteToProject(Number(modalId));
  };

  handleRemoveCaseSuiteFromProject = (e) => {
    const { modalId, removeCaseSuiteFromProject } = this.props;
    if (removeCaseSuiteFromProject)  removeCaseSuiteFromProject(Number(modalId));
  };


  render() {
    const {
      testSuite: { testCasesData },
      handleModalTestCaseEditing,
      handleTestSuiteModalOpen,
      lang,
      addCasesToProject,
      addCaseSuiteToProject,
      removeCaseSuiteFromProject,
      removeFromProject,
      description,
      selection,
      toggleSelection,
      title
    } = this.props;
    const { isOpened } = this.state;

    const filtered = testCasesData.filter(testCase => (!addCasesToProject || testCase.projectId === null || testCase.projectId === undefined));
    if (filtered.length === 0) return null;

    const isSelected = (id) => selection && selection.includes(id);

    const changeSelected = ((id: number) => addCasesToProject && toggleSelection && (() => {
      toggleSelection(id);
    }));

    const handleCaseToProject =  addCasesToProject && ((id: number) => {
      addCasesToProject([id]);
    });

    return (
      <section className={css.container}>
        <div className={css.header} onClick={this.handleCollapse}>
          <div className={css.actions}>
            <h3 className={css.title}>{title}</h3>
            <IconArrowUp className={classnames(css.showMoreIcon, { [css.iconReverse]: isOpened })} />
            { handleTestSuiteModalOpen &&
              <h3 className={css.edit} onClick={this.handleEdit}>{localize[lang].EDIT}</h3>
            }
            { addCaseSuiteToProject &&
              <h3 className={css.add_all} onClick={this.handleAddCaseSuiteToProject}>{localize[lang].ADD_ALL}</h3>
            }
            { removeCaseSuiteFromProject &&
              <h3 className={css.remove_all} onClick={this.handleRemoveCaseSuiteFromProject}>{localize[lang].REMOVE_ALL}</h3>
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
                  selected = {isSelected(id)}
                  changeSelected = {changeSelected(id)}
                  handleModalTestCaseEditing={handleModalTestCaseEditing}
                  addToProject={handleCaseToProject}
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
