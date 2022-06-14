import React, { FC, useContext, useEffect, useState } from "react";
import ReactModal from 'react-modal';
import * as css from './TestCaseInfo.scss';
import { observer } from "mobx-react";
import store from "../store";
import localize from "./TestCaseInfo.json";
import { IconClose } from "~/components/Icons";
import { Col, Row } from "react-flexbox-grid";
import ActionPlace from "../ActionPlace";
import ReactTooltip from 'react-tooltip';
import Priority from "~/components/Priority";
import Attachments from "~/components/Attachments";
import SelectDropdown from '../../../../../components/SelectDropdown';
import Description from '../../../../../components/Description';
import { TestCasesExecutionStatus } from "../store";

export type TestCaseInfoProp = {
    isOpen: boolean,
    close: Function,
    severities: any[],
    canChanged: boolean,
}

const TestCaseInfo: FC<TestCaseInfoProp> = ({isOpen, close, severities, canChanged}) => {
    const { lang, testCasesExecutionDict, testCaseInfoShowActionPlace, testCaseInfo, testCaseStepInfo, setTestCaseStatus ,setTestCaseDescription} = useContext(store);
  
    let [value, setValue] = useState(TestCasesExecutionStatus.NOT_TESTED);
    let [isEditing, setEditing] = useState(false);
    let [description, setDescription] = useState('');

    useEffect(() => {
        ReactTooltip.rebuild();
    }); 

    useEffect(() => {
        const status = testCaseInfo && testCaseInfo.id in testCasesExecutionDict ? testCasesExecutionDict[testCaseInfo.id].status : 0;
        const description = testCaseInfo && testCaseInfo.id in testCasesExecutionDict ? testCasesExecutionDict[testCaseInfo.id].description : '';
        setDescription(description);
        setValue(status ? status : TestCasesExecutionStatus.NOT_TESTED);
    },[testCaseInfo]);


    if (testCaseInfo == null) return null;
    const local = localize[lang];
    const severity = severities.find(s => s.id == testCaseInfo.severityId)?.name ?? local.NOT_SELECTED;
    const statuses = [
    {
        name: "Не протестирован",
        value: TestCasesExecutionStatus.NOT_TESTED,
        id: 1
    },
    {
        name: 'Провален',
        value: TestCasesExecutionStatus.FAIL,
        id: 2
    },
    {
        name: 'Пройден',
        value: TestCasesExecutionStatus.SUCCESS,
        id: 3
    },
    {
        name: 'Заблокирован',
        value: TestCasesExecutionStatus.BLOCKED,
        id: 4
    },
    ];

    const options = statuses.map(status => ({
        value: status.value,
        key: status.id,
        label: status.name
    }));


    const attachmentsDict = testCaseInfo.testCaseAttachments.reduce((p, att) => ({...p, [att.id]: att}), {});
    const onChangeSelector = val  => {
        const status = val.value === TestCasesExecutionStatus.NOT_TESTED ? null : val.value;
        setTestCaseStatus(testCaseInfo.id, status);
        setValue(val.value);
    };

    const Edit = val  => {     
        setEditing(false)
        setTestCaseDescription(testCaseInfo.id , val.description);
        setDescription(val.description)
    };

    const  onEditStart = ()  => {
        setEditing(true)
    };

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
                    <Col xs={12} sm={10} className={css.data}>{severity}</Col>
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
                                    <Col xs={12} sm={10} className={css.data}><div dangerouslySetInnerHTML={{ __html: action }}/></Col>
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
                {canChanged && testCaseInfoShowActionPlace &&
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
                <Row className={css.infoRow}>
                    <Col xs={12} sm={8} className={css.data}>
                        <SelectDropdown
                            name="testStatus"
                            multi={false}
                            placeholder={local.TEST_CASE_INFO.CHANGE_STATUS}
                            options={options}
                            onChange={val => onChangeSelector(val)}
                            value={value}
                        />
                    </Col>
                    </Row>
                    <Row className={css.infoRow}>
                    <Col xs={12} sm={8}  >
                    <main className={css.description}>
                        <Description
                            text={{ __html: description }}
                            headerType="h2"
                            id={+testCaseInfo.id}
                            headerText={local.TEST_CASE_INFO.COMMENT}
                            onEditStart={() => onEditStart()}
                            onEditFinish={() => {}}
                            onEditSubmit={val => Edit(val)}
                            isEditing={isEditing}
                            canEdit={true}
                        />  
                        </main>
                    </Col>
                </Row>
            </div>
          
    </ReactModal>
    )
}

export default observer(TestCaseInfo);