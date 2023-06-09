import React, { FC, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";
import Title from "~/components/Title";
import store, { TestCasesExecutionStatus } from "./store";
import { Col, Row } from "react-flexbox-grid";
import css from './TestRunExecute.scss';
import Button from "~/components/Button";
import TestingCaseReference from "~/components/TestingCaseReference";
import { TestCaseInfo } from "~/components/TestingCaseReference/Types";
import ReactTooltip from 'react-tooltip';
import HttpError from "~/components/HttpError";
import localize from "./TestRunExecute.json";
import TestRunExecuteCaseStatus from "./TestRunExecuteCaseStatus";
import TestRunExecuteInfoBlock from "./TestRunExecuteInfoBlock";
import LoadingMockup from "./LoadingMockup";
import { useConfirmModal } from "~/components/ConfirmModal";
import TestCaseInfoModal from "./TestCaseInfo";
import ActionPlace from "./ActionPlace";
import { useModalState } from "~/components/Modal";

type TestRunExecuteProp = {
    goTestPlans: () => void;
    editTestRunExecution: () => void;
}

const TestRunExecute: FC<TestRunExecuteProp> = ({editTestRunExecution, goTestPlans}) => {

    const { lang, storeInit, userId,
        testRunExecutionLoadingError, dictionaryLoadingError,
        testRunExecution, testCases, usedTestSuites,
        testCasesExecutionDict,
        setTestCaseStatus,
        testCasesExecutionStatus,
        deleteTestRunExecution,
        loadTestCaseInfo
    } = useContext(store);

    const handleDeleteTestRunExecution = async () => {
        await deleteTestRunExecution();
        goTestPlans();
    }

    const local = localize[lang];

    const [confirmDeleteComponent,  confirmDelete] = useConfirmModal(local.DELETE_SUBMIT_CONFIRM, handleDeleteTestRunExecution);
    const [isOpenTestCaseInfo, openTestCaseInfo, closeTestCaseInfo ] = useModalState(false);

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    if (testRunExecutionLoadingError || dictionaryLoadingError) {
        return <HttpError
            error={{
                status: '',
                name: local.FAIL_LOAD.TITILE,
                message: local.FAIL_LOAD.DESCRIPTION,
            }}
        />
    }

    if (!storeInit) {
        return <LoadingMockup lang={lang}/>
    }

    const handleOpenTestCaseSteps = async (testCaseId) => {
        loadTestCaseInfo(testCaseId);
        openTestCaseInfo();
    }

    const getTestCaseMeta = (testCase) => {
        const authorMeta = {
            meta: local.META.AUTHOR,
            value: (lang == 'en' ? testCase.authorInfo?.fullNameEn : testCase.authorInfo?.fullNameRu) ?? '',
        }
        const closedUserInfo = testCasesExecutionDict[testCase.id].closedUserInfo;
        if (closedUserInfo == null) return [authorMeta];
        const closer = {
            meta: local.META.CLOSER,
            value: lang == 'en' ? closedUserInfo.fullNameEn : closedUserInfo.fullNameRu,
        };
        return [ authorMeta, closer, ];
    }

    const canChanged = testRunExecution.executor && testRunExecution.executor?.id == userId;

    return (
        <div>
            <Title render={`[Epic] - ${testRunExecution.title}`} />
            <header className={css.header}>
                <h1>{testRunExecution.title}</h1>
                <h3>{testRunExecution.description ?? ''}</h3>
            </header>
            <Row>
                <Col xs={12} className={css.topActionPlace}>
                    <Button
                        text={local.SAVE}
                        type="green"
                        onClick={goTestPlans}
                    />
                    <Button
                        text={local.BUTTONS.EDIT}
                        onClick={editTestRunExecution}
                        icon="IconEdit"
                        type="green"
                    />
                    <Button
                        addedClassNames={{ [css.pointer]: css.pointer }}
                        text={local.BUTTONS.DELETE}
                        onClick={confirmDelete}
                        icon="IconDelete"
                        type="red"
                    />
                </Col>
            </Row>
            <hr />
            <TestRunExecuteInfoBlock lang={lang} testCasesExecutionStatus={testCasesExecutionStatus} />
            <Row>
                <Col xs={12}>
                    <TestingCaseReference
                        lang={lang}
                        testCases={testCases}
                        testSuites={usedTestSuites}
                        testCaseCardTemplateClass={css["testCaseCard--four_template"]}
                        getMeta={(testCase) => getTestCaseMeta(testCase)}
                        cardClick={(testCase) => {
                            handleOpenTestCaseSteps(testCase.id);
                        }}
                        preCardPlace={(testCase: TestCaseInfo) => {
                            const status = testCase.id in testCasesExecutionDict ? testCasesExecutionDict[testCase.id].status : null;
                            return (
                                <div>
                                    <TestRunExecuteCaseStatus lang={lang} status={status} />
                                </div>
                            );
                        }}
                        postCardPlace={(testCase: TestCaseInfo) => {
                            if (!canChanged) return <div />
                            const status = testCasesExecutionDict[testCase.id].status;
                            if (status != null && status != TestCasesExecutionStatus.SKIPED) return <div/>;
                            return (
                                <ActionPlace lang={lang} action={(status) => {
                                    setTestCaseStatus(testCase.id, status);
                                }} />
                            );
                        }}
                    />
                </Col>
            </Row>
            <Row className={css.bottomActionPlace}>
                <Col>
                    <Button
                        text={local.SAVE}
                        type="green"
                        onClick={goTestPlans}
                    />
                </Col>
            </Row>
            { confirmDeleteComponent }
            <TestCaseInfoModal isOpen={isOpenTestCaseInfo} close={closeTestCaseInfo} canChanged={canChanged} />
        </div>
    );
};

export default observer(TestRunExecute);
