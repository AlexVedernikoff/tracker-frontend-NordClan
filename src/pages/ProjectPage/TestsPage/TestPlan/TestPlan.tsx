import { observer } from "mobx-react";
import React, { FC, useContext, useEffect } from "react";
import { Col, Row } from "react-flexbox-grid";
import { Router } from 'react-router';
import Button from "~/components/Button";
import Modal from "~/components/Modal";
import Title from "~/components/Title";
import ValidatedAutosizeInput from "~/components/ValidatedAutosizeInput";
import Validator from "~/components/ValidatedInput/Validator";
import TestingCaseReference from "~/pages/TestingCaseReference";
import store from './store';
import * as css from './TestPlan.scss';
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
        "ADD_TEST_CASE": "Add test case"
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
        "ADD_TEST_CASE": "Добавить тест кейс"
    }
};

const TestPlan: FC<TestPlanProp> = (props) => {
    const { lang, params: {projectId, testRunId} } = props;

    const {
        initStore, title, description, creating,
        titleTooShort, titleTooLong, titleInvalidate, descriptionInvalidate, hasSave,
        setTitle, setDescription,
        isAddToPlan, addToPlan, closeAddToPlan
    } = useContext(store);

    useEffect(() => {
        initStore(lang, Number(projectId), testRunId == 'create' ? testRunId : Number(testRunId));
    }, [lang, projectId, testRunId])

    const local = localize[lang];

    const header = creating ? local.CREATE_TITLE : `${local.EDIT_TITLE} #${testRunId}`;
    const validator = new Validator();


    const titleError = titleInvalidate ? (titleTooShort ? local.TITLE_ERROR.TOO_SHORT : titleTooLong ? local.TITLE_ERROR.TOO_LONG : '---') : '';
    const textError = descriptionInvalidate ? local.TEXT_ERROR_TOO_LONG : '';

    console.log(hasSave);

    return (
        <div>
            <Title render={`[Epic] - ${header}`} />
            <h1>{header}</h1>
            <hr />
            <Row>
                <Col xs={12} sm={8}>
                    <form>
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
                    <Row>
                        <Col xs={1} xsOffset={3} sm={2} smOffset={5}>
                            <Button
                                text={local.ADD_TEST_CASE}
                                icon="IconPlus"
                                onClick={addToPlan}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                text={local.CREATE}
                                type="green"
                                htmlType="submit"
                                disabled={!hasSave}
                                // onClick={submitTask}
                                // loading={props.isCreateTaskRequestInProgress}
                            />
                        </Col>
                    </Row>
                    </form>
                </Col>
            </Row>
            <Modal isOpen={isAddToPlan} contentLabel="modal" className={css.modalWrapper} onRequestClose={closeAddToPlan} ariaHideApp={false}>
                <TestingCaseReference
                    projectId={Number(projectId)}
                    addToTestPlan={() => {}}
                />
            </Modal>
        </div>
    );
}

export default observer(TestPlan);