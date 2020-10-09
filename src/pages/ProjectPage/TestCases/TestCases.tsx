import React, { FC, useState, useCallback, Component, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import localize from './testCases.json'
import { Props } from './types'
import TestingCaseReference from '~/components/TestingCaseReference';
import { TestCaseInfo, TestSuiteInfo } from "~/components/TestingCaseReference/Types";
import Modal from '~/components/Modal';
import Button from '~/components/Button';
import TestSuiteFormModal from '~/components/TestSuiteEditModal';

const TestCases: FC<Props> = (props: Props) => {
  const {
    getAllTestCases,
    getAllTestSuites,
    getTestSuitesReference,
    getTestCasesReference,
    updateTestSuite,
    deleteTestCase,
    copyTestCase,
    copyTestSuite,
    showNotification,
    lang,
    testSuitesByProject,
    testCasesByProject,
    testCasesReference,
    testSuitesReference,
    router,
    css,
    params,
  } = props;

  const projectId = params.projectId;

  //table
  const testCases = testCasesByProject[projectId] || { withTestSuite: [], withoutTestSuite: [] };
  const testSuites = testSuitesByProject[projectId] || [];

  const [currentSuiteModal, setCurrentSuiteModal] = useState<TestSuiteInfo | null>(null);

  const getProjectTestData = useCallback(() => {
    getAllTestSuites(projectId).then(() => getAllTestCases(projectId));
  }, [projectId, getAllTestSuites, getAllTestCases]);

  useEffect(() => {
    getProjectTestData();
  }, [getProjectTestData]);

  const onCreateCaseClick = useCallback(() => {
    router.push(`/projects/${projectId}/test-case/new`);
  }, [router, projectId]);

  const onDeleteCaseClick = useCallback((testCase) => {
    deleteTestCase(testCase.id).then(() => getProjectTestData());
  }, [deleteTestCase, getAllTestSuites]);

  const onTestSuiteSave = useCallback((title, description, testSuiteId) => {
    const data = { ...currentSuiteModal, title, description };
    updateTestSuite(testSuiteId, data).then(() => {
      getProjectTestData();
      setCurrentSuiteModal(null);
    });
  }, [updateTestSuite, getProjectTestData, setCurrentSuiteModal]);

  //selection
  const [isSelectCaseOpened, setSelectCaseOpened] = useState<boolean>(false);
  const selectTestCaseReference = useRef<TestingCaseReference | null>(null);

  const testCasesReferenceList = useMemo(() => {
    return [...testCasesReference.withTestSuite, ...testCasesReference.withoutTestSuite]
  }, [testCasesReference]);

  const updateReference = useCallback(() => {
    getTestSuitesReference().then(() => getTestCasesReference());
  }, [getTestSuitesReference, getTestCasesReference]);

  useEffect(() => {
    updateReference();
  }, []);

  const onAddSelectedClick = useCallback(() => {
    const selection = selectTestCaseReference.current?.selection ?? [];
    Promise.all(
      testCasesReferenceList
        .filter(item => selection.includes(item.id))
        .map(item => copyTestCase({ ...item, projectId, testSuiteId: null }))
    ).then(() => {
      setSelectCaseOpened(false);
      getProjectTestData();
    });
  }, [testCasesReferenceList, selectTestCaseReference.current]);

  const onAddCaseToProjectClick = useCallback((testCase: TestCaseInfo) => {
    copyTestCase({ ...testCase, projectId, testSuiteId: null }).then(() => {
      showNotification({ message: `«${testCase.title}» ${localize[props.lang].COPIED_SUCCESSFULLY}`, type: 'success' });
      getProjectTestData();
    });
  }, []);

  const onAddSuiteToProjectClick = useCallback((suite: TestSuiteInfo) => {
    copyTestSuite({ ...suite, projectId, testSuiteId: null }).then(() => {
      showNotification({ message: `«${suite.title}» ${localize[props.lang].COPIED_SUCCESSFULLY}`, type: 'success' });
      getProjectTestData();
    });
  }, []);

  return (
    <>
      <TestingCaseReference
        title="[Epic] - Testing Case Reference"
        lang={lang}
        testCases={[...testCases.withTestSuite, ...testCases.withoutTestSuite]}
        testSuites={testSuites}
        topButtons={() => (
          <>
            <Button text={localize[lang].CREATE_BUTTON} type="primary" onClick={onCreateCaseClick} icon="IconPlus" />
            &nbsp;
            <Button text={localize[lang].SELECT_BUTTON} type="primary" onClick={() => setSelectCaseOpened(true)} icon="IconPlus" />
          </>
        )}
        filterAddPlace={() => (
          <Button text={localize[lang].CREATE_BUTTON} type="primary" onClick={onCreateCaseClick} icon="IconPlus" />
        )}
        cardTitleDraw={(testCase: TestCaseInfo) => (
          <Link
            to={`/projects/${projectId}/test-case/${testCase.id}`}
            className="underline-link"
          >
            <h4>{testCase.title}</h4>
          </Link>
        )}
        cardActionsPlace={(testCase: TestCaseInfo, showOnHover: string) => (
          <div className={cn(showOnHover, css.deleteCase)} onClick={() => onDeleteCaseClick(testCase)}>
            {localize[lang].DELETE_TEST_CASE}
          </div>
        )}
        suiteActionPlace={(suite: TestSuiteInfo, showOnHover: string) => {
          if (!suite.id) return null;
          return (
            <h3 className={cn(showOnHover, css.suiteGreenAction)} onClick={(e) => {
              e.stopPropagation();
              setCurrentSuiteModal(suite)
            }}>
              {localize[lang].EDIT_TEST_SUITE}
            </h3>
          );
        }}
      />
      <TestSuiteFormModal
         onClose={() => setCurrentSuiteModal(null)}
         params={{ id: currentSuiteModal?.id }}
         title={currentSuiteModal?.title || ''}
         description={currentSuiteModal?.description || ''}
         onFinish={onTestSuiteSave}
         isOpen={!!currentSuiteModal}
         modalId={currentSuiteModal?.id || 0}
         isCreating={false}
       />

       <Modal isOpen={isSelectCaseOpened} contentLabel="modal" className={css.modalWrapper} onRequestClose={() => setSelectCaseOpened(false)}>
         <TestingCaseReference
            header={localize[lang].ADD_TO_PROJECT_TITLE}
            lang={lang}
            testCases={testCasesReferenceList}
            testSuites={testSuitesReference}
            topButtons={() => (
              <Button text={localize[lang].ADD_SELECTED_CASES_TO_PROJECT} type="primary" onClick={onAddSelectedClick} icon="IconPlus" />
            )}
            cardTitleDraw={(testCase: TestCaseInfo) => (
              <Link
                to={`/test-case/${testCase.id}`}
                className="underline-link"
              >
                <h4>{testCase.title}</h4>
              </Link>
            )}
            cardActionsPlace={(testCase: TestCaseInfo, showOnHover: string) => (
              <div className={cn(showOnHover, css.addCase)} onClick={(e) => {
                e.stopPropagation();
                onAddCaseToProjectClick(testCase);
              }}>
                {localize[lang].ADD_TO_PROJECT}
              </div>
            )}
            suiteActionPlace={(suite: TestSuiteInfo, showOnHover: string) => {
              if (!suite.id) return null;
              return (
                <h3 className={cn(showOnHover, css.suiteGreenAction)} onClick={(e) => {
                  e.stopPropagation();
                  onAddSuiteToProjectClick(suite);
                }}>
                  {localize[lang].ADD_TO_PROJECT}
                </h3>
              );
            }}
            ref={selectTestCaseReference}
            selectable
          />
       </Modal>
    </>
  );
}

export default TestCases;
