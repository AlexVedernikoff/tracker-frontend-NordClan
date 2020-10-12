import React, { FC, useContext, useState } from "react";
import { observer } from "mobx-react";
import cn from 'classnames';
import { Col, Row } from "react-flexbox-grid";

import Button from "~/components/Button";
import HttpError from "~/components/HttpError";
import { IconEdit } from "~/components/Icons";
import InlineHolder from "~/components/InlineHolder";
import Modal, { useModalState } from "~/components/Modal";
import OptionsModal from "~/components/OptionsModal/OptionsModal";
import TestingCaseReference from "~/components/TestingCaseReference";
import { TestCaseInfo, TestSuiteInfo } from "~/components/TestingCaseReference/Types";
import Title from "~/components/Title";
import ValidatedAutosizeInput from "~/components/ValidatedAutosizeInput";
import Validator from "~/components/ValidatedInput/Validator";

import store from './store';
import * as css from './TestRunCreate.scss';
import localize from './TestRunCreate.json';

type TestRunCreateProp = {
    closeForm: () => void;
}

const TestRunCreate: FC<TestRunCreateProp> = ({closeForm}) => {


    const {lang, isNewTestRun,
        title, setTitle, description, setDescription,
        selectedTestPlan, selectedEnvironment, selectedExecutor,
        testPlansLoading, testPlansLoadingError,
        titleInvalidate, descriptionInvalidate, titleTooShort, titleTooLong,
        testRunLoadingError, testRunLoading,
        testPlansOption, setSelectedTestPlan,
        usersOption, setSelectedEnvironment,
        environmentsOption, setSelectedExecutor,
        testCasesDataLoading, testCasesDataErrorLoading,
        testCases, usedTestSuites, unusedTestCases, casesCount,
        removeTestCasesFromRun, addTestSuiteToRun, addTestCaseToRun, addManyTestCaseToRun, removeTestSuiteFromRun,
        hasSave, saveTestRun, testRunSaving, testRunSavingError,
    } = useContext(store);

    const [testPlanModal, openTestPlanModal, closeTestPlanModal] = useModalState(false)
    const [environmentModal, openEnvironmentModal, closeEnvironmentModal] = useModalState(false)
    const [executerModal, openExecuterModal, closeExecuterModal] = useModalState(false)
    const [addTestCase, openAddTestCase, closeAddTestCase] = useModalState(false)

    const local = localize[lang];
    const header = isNewTestRun ? local.CREATE_TITLE : local.CHANGE_TITLE;

    if (testPlansLoadingError || testCasesDataErrorLoading || testRunSavingError || testRunLoadingError) {
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

    if (testPlansLoading || testCasesDataLoading || testRunLoading ) {
        return (
            <div>
                <Title render={`[Epic] - ${header}`} />
                <h1>{header}</h1>
                <hr />
                <Row>
                    <Col xs={12} className={css.submitPlace}>
                        <Button
                            text={local.BUTTON_CREATE}
                            type="green"
                            loading={true}
                        />
                        <Button
                            text={local.BUTTON_CANCEL}
                            icon="IconArrowLeft"
                            loading={true}
                        />
                    </Col>
                    <Col xs={12} sm={8}>
                        <InlineHolder length="60%" />
                        <InlineHolder length="60%" />
                    </Col>
                    <Col xs={12} sm={4}>
                        <div className={css.detailsBlock}>
                            <InlineHolder length="60%" />
                            <InlineHolder length="60%" />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    const validator = new Validator();

    const titleError = titleInvalidate ? (titleTooShort ? local.TITLE_ERROR.TOO_SHORT : titleTooLong ? local.TITLE_ERROR.TOO_LONG : '---') : '';
    const descriptionError = descriptionInvalidate ? local.TEXT_ERROR_TOO_LONG : '';

    let addTestCaseReference: TestingCaseReference | null = null;

    const handleRemoveTestCaseFromRun = (testCase: TestCaseInfo) => removeTestCasesFromRun(testCase.id);
    const handleRemoveTestSuiteFromRun = (testSuiteId: number) => removeTestSuiteFromRun(testSuiteId);

    const handleAddTestSuiteToPlan = (testSuiteId: number) => {
        addTestSuiteToRun(testSuiteId);
        closeAddTestCase();
    };
    const handleAddTestCaseToPlan = (testCase: TestCaseInfo) => {
        addTestCaseToRun(testCase);
        closeAddTestCase();
    };
    const handleAddManyTestCaseToPlan = () => {
        addManyTestCaseToRun(addTestCaseReference?.selection || []);
        closeAddTestCase();
    };
    const handleSave = async () => {
        await saveTestRun();
        closeForm();
    }

    return (
        <div>
            <Title render={`[Epic] - ${header}`} />
            <h1>{header}</h1>
            <hr />
            <form>
                <Row>
                    <Col xs={12} className={css.submitPlace}>
                        <Button
                            text={local.BUTTON_CREATE}
                            type="green"
                            htmlType="submit"
                            disabled={!hasSave}
                            onClick={handleSave}
                            loading={testRunSaving}
                        />
                        <Button
                            text={local.BUTTON_CANCEL}
                            icon="IconArrowLeft"
                            onClick={closeForm}
                        />
                    </Col>
                    <Col xs={12} sm={8}>
                        <Row>
                            <Col xs={12} sm={2}>
                                <p>{local.TITLE}</p>
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
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                                shouldMarkError={shouldMarkError}
                                                errorText={titleError}
                                            />
                                        ),
                                    'title',
                                    titleInvalidate
                                )}
                            </Col>
                            <Col xs={12} sm={2}>
                                <p>{local.DESCRIPTION}</p>
                            </Col>
                            <Col xs={12} sm={10}>
                                {validator.validate(
                                        (handleBlur, shouldMarkError) => (
                                            <ValidatedAutosizeInput
                                                maxRows={5}
                                                name="title"
                                                placeholder={local.DESCRIPTION_PLACEHOLDER}
                                                value={description}
                                                onBlur={handleBlur}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                                                shouldMarkError={shouldMarkError}
                                                errorText={descriptionError}
                                            />
                                        ),
                                    'title',
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
                        <div className={css.detailsBlock_row}>
                            <div>{local.TEST_PLANS}</div>
                            <div>
                                <div className={css.editableCell} onClick={openTestPlanModal}>
                                    { selectedTestPlan?.label ?? local.NOT_SELECTED }
                                    <span className={css.editIcon}>
                                        <IconEdit />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={css.detailsBlock_row}>
                            <div>{local.ENVIRONMENT}</div>
                            <div>
                                <div className={css.editableCell} onClick={openEnvironmentModal}>
                                    { selectedEnvironment?.label ?? local.NOT_SELECTED }
                                    <span className={css.editIcon}>
                                        <IconEdit />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={css.detailsBlock_row}>
                            <div>{local.EXECUTER}</div>
                            <div>
                                <div className={css.editableCell} onClick={openExecuterModal}>
                                    { selectedExecutor?.label ?? local.NOT_SELECTED }
                                    <span className={css.editIcon}>
                                        <IconEdit />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </Col>
                    <Col xs={12}>
                        <TestingCaseReference
                            lang={lang}
                            testCases={testCases}
                            testSuites={usedTestSuites}
                            suiteActionPlace={(testSuite: TestSuiteInfo, showOnHover) => {
                                if  (testSuite.id == null || testSuite.id == undefined) {
                                    return null;
                                }
                                return (
                                    <div
                                        className={cn(showOnHover, css.removeCaseToPlan)}
                                        onClick={(e) => { e.stopPropagation(); handleRemoveTestSuiteFromRun(testSuite.id!); }}
                                    >
                                        {local.CASES.DELETE_FROM_TEST_RUN}
                                    </div>)
                            }}
                            topButtons={() => (
                                <Button text={local.CASES.ADD_TO_TEST_RUN} type="primary" onClick={openAddTestCase} icon="IconPlus" />
                            )}
                            filterAddPlace={() => (
                                <Button text={local.CASES.ADD_TO_TEST_RUN} type="primary" onClick={openAddTestCase} icon="IconPlus" />
                            )}
                            cardActionsPlace={(testCase: TestCaseInfo, showOnHover: string) => (
                                <div className={cn(showOnHover, css.removeCaseToPlan)} onClick={() => handleRemoveTestCaseFromRun(testCase)}>
                                    {local.CASES.DELETE_FROM_TEST_RUN}
                                </div>
                            )}
                        />
                    </Col>
                </Row>
            </form>
            { testPlanModal &&
                <OptionsModal
                    lang={lang}
                    options={testPlansOption}
                    defaultOption={selectedTestPlan?.value}
                    canBeNotSelected
                    title={local.SELECT_TEST_PLAN}
                    inputPlaceholder={local.ENTER_TEST_PLAN}
                    onClose={closeTestPlanModal}
                    onChoose={(val) => {
                        setSelectedTestPlan(val);
                        closeTestPlanModal();
                    }}
                />
            }
            { environmentModal &&
                <OptionsModal
                    lang={lang}
                    options={environmentsOption}
                    defaultOption={selectedEnvironment?.value}
                    canBeNotSelected
                    title={local.SELECT_ENVIRONMENT}
                    inputPlaceholder={local.ENTER_ENVIRONMENT}
                    onClose={closeEnvironmentModal}
                    onChoose={(val) => {
                        setSelectedEnvironment(val);
                        closeEnvironmentModal();
                    }}
                />
            }
            { executerModal &&
                <OptionsModal
                    lang={lang}
                    options={usersOption}
                    defaultOption={selectedExecutor?.value}
                    canBeNotSelected
                    title={local.SELECT_EXECUTER}
                    inputPlaceholder={local.ENTER_EXECUTER}
                    onClose={closeExecuterModal}
                    onChoose={(val) => {
                        setSelectedExecutor(val);
                        closeExecuterModal();
                    }}
                />
            }

            <Modal isOpen={addTestCase} contentLabel="modal" className={css.modalWrapper} onRequestClose={closeAddTestCase} ariaHideApp={false}>
                <TestingCaseReference
                    lang={lang}
                    selectable
                    ref={(ref) => addTestCaseReference = ref}
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
                                onClick={(e) => { e.stopPropagation(); handleAddTestSuiteToPlan(testSuite.id!); }}
                            >
                                {local.CASES.ADD_CASE_SUITE}
                            </div>)
                    }}
                    cardActionsPlace={(testCase: TestCaseInfo, showOnHover: string) => (
                        <div className={cn(showOnHover, css.addCaseToPlan)} onClick={(e) => { e.stopPropagation(); handleAddTestCaseToPlan(testCase); }}>
                            {local.CASES.ADD_TO_TEST_RUN}
                        </div>
                    )}
                    topButtons={() => (
                        <Button
                            type="primary"
                            icon="IconPlus"
                            onClick = {handleAddManyTestCaseToPlan}
                            text={local.CASES.ADD_SELECTION_TO_RUN}
                        />
                    )}
                />
            </Modal>
        </div>
    )
}

export default observer(TestRunCreate);