import React, { FC, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";
import Title from "~/components/Title";
import store, { TestCasesExecutionStatus } from "./store";
import { Col, Row } from "react-flexbox-grid";
import * as css from './TestRunExecute.scss';
import Button from "~/components/Button";
import TestingCaseReference from "~/components/TestingCaseReference";
import { TestCaseInfo } from "~/components/TestingCaseReference/Types";
import ReactTooltip from 'react-tooltip';
import HttpError from "~/components/HttpError";
import { localize } from "./localize";
import TestRunExecuteCaseStatus from "./TestRunExecuteCaseStatus";
import TestRunExecuteInfoBlock from "./TestRunExecuteInfoBlock";
import LoadingMockup from "./LoadingMockup";
import ConfirmModal from "~/components/ConfirmModal/ConfirmModal";

type TestRunExecuteProp = {
    goTestPlans: () => void;
    editTestRunExecution: () => void;
}

const useModalState = (initialState: boolean): [boolean, ()=>void, ()=>void] => {
    const [state, setstate] = useState(initialState);
    const open = () => setstate(true);
    const close = () => setstate(false);
    return [state, open, close];
}


const TestRunExecute: FC<TestRunExecuteProp> = ({editTestRunExecution, goTestPlans}) => {

    const { lang, storeInit,
        testRunExecutionLoadingError, dictionaryLoadingError,
        testRunExecution, testCases, testSuites,
        testCasesExecutionDict,
        setTestCaseStatus,
        testCasesExecutionStatus,
        deleteTestRunExecution
    } = useContext(store);

    const [isConfirmDelete, confirmDelete, closeConfirmDelete ] = useModalState(false);

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    const local = localize[lang];

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

    const handleDeleteTestRunExecution = async () => {
        await deleteTestRunExecution();
        closeConfirmDelete();
        goTestPlans();
    }


    return (
        <div>
            <Title render={`[Epic] - ${testRunExecution.title}`} />
            <header className={css.header}>
                <h1>{testRunExecution.title}</h1>
                <h3>{testRunExecution.description ?? ''}</h3>
            </header>
            <Row>
                <Col xs={12} className={css.actionPlace}>
                    <Button
                        text={local.BUTTONS.EDIT}
                        onClick={editTestRunExecution}
                        icon="IconEdit"
                        type="green"
                    />
                    <Button
                        text={local.BUTTONS.DELETE}
                        onClick={confirmDelete}
                        icon="IconDelete"
                        type="red"
                    />
                    <Button
                        text={local.BUTTONS.CANCEL}
                        onClick={goTestPlans}
                        icon="IconArrowLeft"
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
                        testSuites={testSuites}
                        testCaseCardTemplateClass={css["testCaseCard--four_template"]}
                        preCardPlace={(testCase: TestCaseInfo) => {
                            const status = testCase.id in testCasesExecutionDict ? testCasesExecutionDict[testCase.id].status : null;
                            return (
                                <div>
                                    <TestRunExecuteCaseStatus lang={lang} status={status} />
                                </div>
                            );
                        }}
                        postCardPlace={(testCase: TestCaseInfo) => {
                            const status = testCasesExecutionDict[testCase.id].status;
                            if (status != null && status != TestCasesExecutionStatus.SKIPED) return <div/>;
                            return (
                                <div className={css.testCaseCard__actionPlace}>
                                    <Button
                                        data-tip={local.CASE_STATUS.SKIPED}
                                        icon="IconTime"
                                        type="grey"
                                        onClick={() => setTestCaseStatus(testCase.id, TestCasesExecutionStatus.SKIPED)}
                                    />
                                    <Button
                                        data-tip={local.CASE_STATUS.FAIL}
                                        icon="IconClose"
                                        addedClassNames={{[css.red_button]: true}}
                                        onClick={() => setTestCaseStatus(testCase.id, TestCasesExecutionStatus.FAIL)}
                                    />
                                    <Button
                                        data-tip={local.CASE_STATUS.SUCCESS}
                                        icon="IconCheck"
                                        type="green"
                                        onClick={() => setTestCaseStatus(testCase.id, TestCasesExecutionStatus.SUCCESS)}
                                    />
                                    <Button
                                        data-tip={local.CASE_STATUS.BLOCKED}
                                        icon="IconError"
                                        addedClassNames={{[css.orange_button]: true}}
                                        onClick={() => setTestCaseStatus(testCase.id, TestCasesExecutionStatus.BLOCKED)}
                                    />
                                </div>
                            );
                        }}
                    />
                </Col>
            </Row>
            <ConfirmModal
                isOpen={isConfirmDelete}
                contentLabel="modal"
                text={local.DELETE_SUBMIT_CONFIRM}
                onCancel={closeConfirmDelete}
                onConfirm={event => { event.stopPropagation(); handleDeleteTestRunExecution(); }}
            />
        </div>
    );
};

export default observer(TestRunExecute);