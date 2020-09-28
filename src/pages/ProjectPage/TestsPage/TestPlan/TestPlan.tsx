import { observer } from "mobx-react";
import React, { FC, useContext, useEffect } from "react";
import { Col, Row } from "react-flexbox-grid";
import { Router } from 'react-router';
import Button from "~/components/Button";
import Modal from "~/components/Modal";
import TestingCaseReference from "~/components/TestingCaseReference";
import { TestCaseInfo, TestSuiteInfo } from "~/components/TestingCaseReference/Types";
import Title from "~/components/Title";
import ValidatedAutosizeInput from "~/components/ValidatedAutosizeInput";
import Validator from "~/components/ValidatedInput/Validator";
import { TestCaseInfoDTO } from "../TestPlans/TypesDTO";
import store from './store';
import cn from 'classnames'
import * as css from './TestPlan.scss';
import HttpError from "~/components/HttpError";
// import localize from './TestPlan.json';

type TestPlanProp = {
    params: {projectId: string, testRunId: string},
    lang: 'en' | 'ru',
    router: Router,
}

const localize = {
    "en": {
        "CREATE_TITLE": "Create test plan",
        "EDIT_TITLE": "Edit test plan",
        "TITLE": "Title:",
        "TITLE_PLACEHOLDER": "Title",
        "DESCRIPTION": "Description:",
        "DESCRIPTION_PLACEHOLDER": "Test plan description",
        "TITLE_ERROR": {
            "TOO_LONG": "The title must be less than 255 characters",
            "TOO_SHORT": "The title must be more than 4 characters"
        },
        "TEXT_ERROR_TOO_LONG": "The text in the field should not exceed 5000 characters",
        "CREATE": "Create test plan",
        "EDIT": "Change test plan",
        "FAIL_LOAD": {
            "TITILE": "Error",
            "DESCRIPTION": "Fail data loading...",
        },
        "LOADING": "Loading...",
        "CASES": {
            "HEADER": "Add test cases",
            "ADD_TO_PROJECT": "Add to project",
            "ADD_CASE_SUITE": "Add case suite to test plan",
            "ADD_SELECTION_TO_PLAN": "Add selection to project",
            "DELETE_FROM_PROJECT": "Delete from project",
        }
    },
    "ru": {
        "CREATE_TITLE": "Создание тест плана",
        "EDIT_TITLE": "Изменение тест плана",
        "TITLE": "Название:",
        "TITLE_PLACEHOLDER": "Название",
        "DESCRIPTION": "Описание:",
        "DESCRIPTION_PLACEHOLDER": "Описание тест плана",
        "TITLE_ERROR": {
            "TOO_LONG": "Название должно быть меньше 255 символов",
            "TOO_SHORT": "Название должно быть больше 4 символов"
        },
        "TEXT_ERROR_TOO_LONG": "Текст в поле не должен превышать 5000 символов",
        "CREATE": "Создать тест план",
        "EDIT": "Изменить тест план",
        "FAIL_LOAD": {
            "TITILE": "Ошибка",
            "DESCRIPTION": "Ошибка загрузки данных",
        },
        "LOADING": "Загрузка данных...",
        "CASES": {
            "HEADER": "Добавить тест кейсы",
            "ADD_TO_PROJECT": "Добавить в проект",
            "ADD_CASE_SUITE": "Добавить набор кейсов в план тестирования",
            "ADD_SELECTION_TO_PLAN": "Добавить выделенные в тест план",
            "DELETE_FROM_PROJECT": "Удалить из проекта",
        }
    }
};

const TestPlan: FC<TestPlanProp> = (props) => {
    const { lang, params: {projectId, testRunId}, router } = props;

    const {
        initStore, title, description, creating,
        titleTooShort, titleTooLong, titleInvalidate, descriptionInvalidate, hasSave,
        testCases, testSuites, allTestCases, unusedTestCases,
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

    if (testPlanLoading || testPlanDataLoading) {
        return (<div>{local.LOADING}</div>)
    }

    const header = creating ? local.CREATE_TITLE : `${local.EDIT_TITLE} #${testRunId}`;
    const button = creating ? local.CREATE : local.EDIT;
    const validator = new Validator();

    const titleError = titleInvalidate ? (titleTooShort ? local.TITLE_ERROR.TOO_SHORT : titleTooLong ? local.TITLE_ERROR.TOO_LONG : '---') : '';
    const textError = descriptionInvalidate ? local.TEXT_ERROR_TOO_LONG : '';

    let addTestingCaseReferenceRef: TestingCaseReference | null = null;

    const handleAddTestCaseToPlan = (testCase: TestCaseInfo)  => {
        addTestCasesToPlan(testCase);
        closeAddToPlan();
    }

    const handleAddTestSuiteToPlan = (testSuiteId: number) => {
        const addCases = allTestCases.filter(ts => ts.testSuiteId == testSuiteId);
        addTestCasesToPlan(...addCases);
        closeAddToPlan();
    }

    const handleAddManyTestCaseToPlan = ()  => {
        const selection = addTestingCaseReferenceRef?.selection ?? [];
        allTestCases
            .filter((testCase) => selection.includes(testCase.id))
            .forEach((testCase) => addTestCasesToPlan(testCase));
        closeAddToPlan();
    }

    const handleRemoveTestCaseFromPlan = (testCase: TestCaseInfo) => {
        removeTstCasesToPlan(testCase.id);
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
            <hr />
            <form>
            <Row>
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
                <Col xs ={12}>
                    <Row>
                        <Col xs={12}>
                            <TestingCaseReference
                                lang={lang}
                                testCases={testCases}
                                testSuites={testSuites}
                                topButtons={() => (
                                    <Button text={local.CASES.ADD_TO_PROJECT} type="primary" onClick={addToPlan} icon="IconPlus" />
                                )}
                                filterAddPlace={() => (
                                    <Button text={local.CASES.ADD_TO_PROJECT} type="primary" onClick={addToPlan} icon="IconPlus" />
                                )}
                                cardActionsPlace={(testCase: TestCaseInfo, showOnHover: string) => (
                                    <div className={cn(showOnHover, css.removeCaseToPlan)} onClick={() => handleRemoveTestCaseFromPlan(testCase)}>
                                        {local.CASES.DELETE_FROM_PROJECT}
                                    </div>
                                )}
                            />
                        </Col>
                    </Row>
                    <Row className={css.submitRow}>
                        <Col>
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
                    testSuites={testSuites}
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
                            {local.CASES.ADD_TO_PROJECT}
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
                />
            </Modal>
        </div>
    );
}

export default observer(TestPlan);