import React, { FC, useContext, useEffect, useState } from "react";
import ReactModal from 'react-modal';
import * as css from './TestCaseInfo.scss';
import { observer } from "mobx-react";
import store, { TestCasesExecutionStatus } from "../store";
import localize from "./TestCaseInfo.json";
import { IconClose } from "~/components/Icons";
import { Col, Row } from "react-flexbox-grid";
import ActionPlace from "../ActionPlace";
import ReactTooltip from 'react-tooltip';
import Priority from "~/components/Priority";
import Attachments from "~/components/Attachments";

export type TestCaseInfoProp = {
    isOpen: boolean,
    close: Function,
    severities: any[],
}

const TestCaseInfo: FC<TestCaseInfoProp> = ({isOpen, close, severities}) => {
    const { lang, testCaseInfoShowActionPlace, testCaseInfo, testCaseStepInfo, setTestCaseStatus } = useContext(store);

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    if (testCaseInfo == null) return null;
    const local = localize[lang];

    const severity = severities[testCaseInfo.severityId ?? 1];

    const attachmentsDict = testCaseInfo.testCaseAttachments.reduce((p, att) => ({...p, [att.id]: att}), {});

    return (
        <ReactModal
            isOpen={isOpen}
            className = {css.modalWrapper}
            overlayClassName={css.modalWrapperOverlay}
            onRequestClose={close}
            closeTimeoutMS={200}
            ariaHideApp={false}
        >
            <IconClose className={css.iconClose} onClick={close} />
            <div className={css.testCaseInfoBlock}>
                <h2>{local.HEADER}</h2>
                <Row className={css.infoRow}>
                    <Col xs={12} sm={2} className={css.label}>{local.TEST_CASE_INFO.TITLE}</Col>
                    <Col xs={12} sm={10} className={css.data}>{testCaseInfo.title}</Col>
                </Row>
                <Row className={css.infoRow}>
                    <Col xs={12} sm={2} className={css.label}>{local.TEST_CASE_INFO.DESCRIPTION}</Col>
                    <Col xs={12} sm={10} className={css.data}>{testCaseInfo.description}</Col>
                </Row>
                <Row className={css.infoRow}>
                    <Col xs={12} sm={2} className={css.label}>{local.TEST_CASE_INFO.PRE_CONDITION}</Col>
                    <Col xs={12} sm={10} className={css.data}>{testCaseInfo.preConditions}</Col>
                </Row>
                <Row className={css.infoRow}>
                    <Col xs={12} sm={2} className={css.label}>{local.TEST_CASE_INFO.POST_CONDITION}</Col>
                    <Col xs={12} sm={10} className={css.data}>{testCaseInfo.postConditions}</Col>
                </Row>
                <Row className={css.infoRow}>
                    <Col xs={12} sm={2} className={css.label}>{local.TEST_CASE_INFO.PRIORITY}</Col>
                    <Col xs={12} sm={10} className={css.data}>
                        <Priority priority={testCaseInfo.priority} />
                    </Col>
                </Row>
                <Row className={css.infoRow}>
                    <Col xs={12} sm={2} className={css.label}>{local.TEST_CASE_INFO.SEVERITY}</Col>
                    <Col xs={12} sm={10} className={css.data}>{severity.name}</Col>
                </Row>
                {
                    testCaseStepInfo.sort((a, b) => a.id - b.id).map(({ id, status, attachments: testCaseExecutionAttachments, testStepInfo: {action: actionJSON, expectedResult} }, idx) => {
                        const {action, attachments } = JSON.parse(actionJSON);
                        return (
                            <React.Fragment key={id}>
                                <hr />
                                <Row className={css.infoHeaderRow}>
                                    <Col xs={2} className={css.label}>
                                        Case {idx + 1}
                                    </Col>
                                </Row>
                                <Row className={css.infoRow}>
                                    <Col xs={12} sm={2} className={css.label}>{local.TEST_STEP_INFO.ACTION}</Col>
                                    <Col xs={12} sm={10} className={css.data}>{action}</Col>
                                </Row>
                                <Row className={css.infoRow}>
                                    <Col xs={12} sm={2} className={css.label}>{local.TEST_STEP_INFO.EXPECTED_RESULT}</Col>
                                    <Col xs={12} sm={10} className={css.data}>{expectedResult}</Col>
                                </Row>
                                {
                                    attachments.length > 0 &&
                                    <Row className={css.infoAttachRow}>
                                        <Col xs={12}>
                                            <Attachments
                                                className={css.test}
                                                attachments={attachments.map(attId => attachmentsDict[attId])}
                                                canEdit={false}
                                            />
                                        </Col>
                                    </Row>
                                }
                            </React.Fragment >
                        );
                    })
                }
                {testCaseInfoShowActionPlace &&
                    <React.Fragment>
                        <hr/>
                        <div className={css.actionPlace}>
                            {}
                            <ActionPlace lang={lang} withText action={(status) => {
                                setTestCaseStatus(testCaseInfo.id, status);
                                close();
                            } } />
                        </div>
                    </React.Fragment>
                }
            </div>
    </ReactModal>
    )
}

export default observer(TestCaseInfo);