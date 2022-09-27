import React, { FC, useContext, useEffect } from "react";
import { observer } from "mobx-react";
import cn from 'classnames'
import { Col, Row } from "react-flexbox-grid";
import { Router } from 'react-router';

import Button from "~/components/Button";
import Modal from "~/components/Modal";
import TestingCaseReference from "~/components/TestingCaseReference";
import { TestCaseInfo, TestSuiteInfo } from "~/components/TestingCaseReference/Types";
import Title from "~/components/Title";
import ValidatedAutosizeInput from "~/components/ValidatedAutosizeInput";
import Validator from "~/components/ValidatedInput/Validator";
import HttpError from "~/components/HttpError";
import InlineHolder from "~/components/InlineHolder";

import store from './store';
import css from './TestPlan.scss';
import localize from './TestPlan.json';

type TestPlanProp = {
    params: {projectId: string, testRunId: string},
    lang: 'en' | 'ru',
    router: Router,
}

const TestPlan: FC<TestPlanProp> = (props) => {
    const { lang, params: {projectId, testRunId}, router } = props;

    const {
        initStore, preTitle, title, description, creating,
        titleTooShort, titleTooLong, titleInvalidate, descriptionInvalidate, hasSave,
        testCases, testSuites, allTestCases, unusedTestCases, casesCount, usedTestSuites,
        setTitle, setDescription,
        isAddToPlan, addToPlan, closeAddToPlan,
        addTestCasesToPlan, removeTstCasesToPlan,
        testPlanErrorLoading, testPlanDataErrorLoading, testPlanLoading, testPlanDataLoading,
        isSaveData, saveTestPlan, createTestPlan,
    } = useContext(store);

    useEffect(() => {
        initStore(lang, Number(projectId), testRunId == 'create' ? testRunId : Number(testRunId));
    }, [lang, projectId, testRunId]);

    const local = localize[lang];

    if (testPlanErrorLoading || testPlanDataErrorLoading) {
        return (
            <HttpError
                error={{
                    status: '',
                    name: local.FAIL_LOAD.TITILE,
                    message: local.FAIL_LOAD.DESCRIPTION,
                }}
            />
        )
    }

    const header = creating ? local.CREATE_TITLE : preTitle;
    const button = creating ? local.CREATE : local.EDIT;

    if (testPlanLoading || testPlanDataLoading) {
        return (
            <div>
                <Title render={`[Epic] - ${header}`} />
                <h1><InlineHolder length="40%" /></h1>
                <Row className={css.submitRow}>
                    <Col>
                        <Button
                            text={local.CANCEL}
                            loading={true}
                        />
                        <Button
                            text={button}
                            type="green"
                            loading={true}
                        />
                    </Col>
                </Row>
                <hr />
                <InlineHolder length="60%" />
                <InlineHolder length="60%" />
                <InlineHolder length="80%" />
            </div>
        )
    }

    const validator = new Validator();

    const titleError = titleInvalidate ? (titleTooShort ? local.TITLE_ERROR.TOO_SHORT : titleTooLong ? local.TITLE_ERROR.TOO_LONG : '---') : '';
    const textError = descriptionInvalidate ? local.TEXT_ERROR_TOO_LONG : '';

    let addTestingCaseReferenceRef: TestingCaseReference | null = null;

    const handleAddTestCaseToPlan = (testCase: TestCaseInfo)  => {
        addTestCasesToPlan(testCase);
    }

    const handleAddTestSuiteToPlan = (testSuiteId: number) => {
        const existTestCases = new Set(testCases.map(tc => tc.id));
        const addCases = allTestCases.filter(tc => tc.testSuiteId == testSuiteId && !existTestCases.has(tc.id));
        addTestCasesToPlan(...addCases);
    }

    const handleAddManyTestCaseToPlan = ()  => {
        const existTestCases = new Set(testCases.map(tc => tc.id));
        const selection = (addTestingCaseReferenceRef?.selection ?? []).filter(id => !existTestCases.has(id));
        allTestCases
            .filter((testCase) => selection.includes(testCase.id))
            .forEach((testCase) => addTestCasesToPlan(testCase));
        closeAddToPlan();
    }

    const handleRemoveTestCaseFromPlan = (testCase: TestCaseInfo) => {
        removeTstCasesToPlan(testCase.id);
    }

    const handleCancel = () => {
        router.push(`/projects/${projectId}/tests/plans`);
    }

    const handleSavePlan = async () => {
        if (testRunId == "create") {
            await createTestPlan();
        } else {
            await saveTestPlan();
        }
        router.push(`/projects/${projectId}/tests/plans`)
    }

    return (
        <div>
            <Title render={`[Epic] - ${header}`} />
            <h1>{header}</h1>
            <Row className={css.submitRow}>
                <Col>
                    <Button
                        text={local.CANCEL}
                        onClick={handleCancel}
                        loading={isSaveData}
                    />
                    <Button
                        text={button}
                        type="green"
                        htmlType="submit"
                        disabled={!hasSave}
                        onClick={handleSavePlan}
                        loading={isSaveData}
                    />
                </Col>
            </Row>
            <hr />
            <form>
            <Row>
                <Col xs={12} sm={8}>
                    <Row>
                        <Col xs={12} sm={2}>
                            <p>{local.TITLE} *</p>
                        </Col>
                        <Col xs={12} sm={10}>
                            {validator.validate(
                                    (handleBlur, shouldMarkError) => (
                                        <ValidatedAutosizeInput
                                            maxRows={5}
                                            name="title"
                                            placeholder={local.TITLE_PLACEHOLDER}
                                            value={title}
                                            onBlur={handleBlur}
                                            onChange={setTitle}
                                            shouldMarkError={shouldMarkError}
                                            errorText={titleError}
                                        />
                                    ),
                                'title',
                                titleInvalidate
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={2}>
                            <p>{local.DESCRIPTION}</p>
                        </Col>
                        <Col xs={12} sm={10}>
                            {validator.validate(
                                    (handleBlur, shouldMarkError) => (
                                        <ValidatedAutosizeInput
                                            maxRows={5}
                                            name="description"
                                            placeholder={local.DESCRIPTION_PLACEHOLDER}
                                            value={description}
                                            onBlur={handleBlur}
                                            onChange={setDescription}
                                            shouldMarkError={shouldMarkError}
                                            errorText={textError}
                                        />
                                    ),
                                'description',
                                descriptionInvalidate
                            )}
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={4}>
                    <div className={css.detailsBlock}>
                        <div className={css.detailsBlock_row}>
                            <div>{local.CASES_COUNT}</div>
                            <div>{casesCount}</div>
                        </div>
                    </div>
                </Col>
                <Col xs ={12}>
                    <Row>
                        <Col xs={12}>
                            <TestingCaseReference
                                lang={lang}
                                testCases={testCases}
                                testSuites={usedTestSuites}
                                topButtons={() => (
                                    <Button text={local.CASES.ADD_TO_TEST_PLAN} type="primary" onClick={addToPlan} icon="IconPlus" />
                                )}
                                filterAddPlace={() => (
                                    <Button text={local.CASES.ADD_TO_TEST_PLAN} type="primary" onClick={addToPlan} icon="IconPlus" />
                                )}
                                cardActionsPlace={(testCase: TestCaseInfo, showOnHover: string) => (
                                    <div className={cn(showOnHover, css.removeCaseToPlan)} onClick={() => handleRemoveTestCaseFromPlan(testCase)}>
                                        {local.CASES.DELETE_FROM_TEST_PLAN}
                                    </div>
                                )}
                            />
                        </Col>
                    </Row>
                    <Row className={css.submitRow}>
                        <Col>
                            <Button
                                text={local.CANCEL}
                                onClick={handleCancel}
                                loading={isSaveData}
                            />
                            <Button
                                text={button}
                                type="green"
                                htmlType="submit"
                                disabled={!hasSave}
                                onClick={handleSavePlan}
                                loading={isSaveData}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            </form>
            <Modal isOpen={isAddToPlan} contentLabel="modal" className={css.modalWrapper} onRequestClose={closeAddToPlan} ariaHideApp={false}>
                <TestingCaseReference
                    lang={lang}
                    selectable
                    ref={(ref) => addTestingCaseReferenceRef = ref}
                    header={local.CASES.HEADER}
                    testCases={unusedTestCases}
                    testSuites={usedTestSuites}
                    suiteActionPlace={(testSuite: TestSuiteInfo, showOnHover) => {
                        if  (testSuite.id == null || testSuite.id == undefined) {
                            return null;
                        }
                        return (
                            <div
                                className={cn(showOnHover, css.addCaseToPlan)}
                                onClick={() => { handleAddTestSuiteToPlan(testSuite.id!); }}
                            >
                                {local.CASES.ADD_CASE_SUITE}
                            </div>)
                    }}
                    cardActionsPlace={(testCase: TestCaseInfo, showOnHover: string) => (
                        <div className={cn(showOnHover, css.addCaseToPlan)} onClick={() => { handleAddTestCaseToPlan(testCase); }}>
                            {local.CASES.ADD_TO_TEST_PLAN}
                        </div>
                    )}
                    topButtons={() => (
                        <Button
                            type="primary"
                            icon="IconPlus"
                            onClick = {handleAddManyTestCaseToPlan}
                            text={local.CASES.ADD_SELECTION_TO_PLAN}
                        />
                    )}
                    filterAddPlace={() => (
                        <Button
                            type="primary"
                            icon="IconPlus"
                            onClick = {handleAddManyTestCaseToPlan}
                            text={local.CASES.ADD_SELECTION_TO_PLAN}
                        />
                    )}
                />
            </Modal>
        </div>
    );
}

export default observer(TestPlan);