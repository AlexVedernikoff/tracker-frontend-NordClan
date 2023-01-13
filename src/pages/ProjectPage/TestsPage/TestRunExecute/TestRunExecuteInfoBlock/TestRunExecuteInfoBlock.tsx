import React, { FC } from "react";
import { Col, Row } from "react-flexbox-grid";
import css from '../TestRunExecute.scss';
import SubProcentInfo from "./SubProcentInfo";
import InfoBlock from "./InfoBlock";
import TaskRunProgress from "../TaskRunProgress";

const TestRunExecuteInfoBlock: FC<any> = ({ lang, testCasesExecutionStatus }) => {

    return (
        <Row>
            <Col xs={12} sm={2}>
                <h2 className={css.TestRunProcent}>{testCasesExecutionStatus.fullProcent}%</h2>
            </Col>
            <Col xs={12} sm={6}>
                <Row>
                    <Col xs={12} md={6}>
                        <SubProcentInfo lang={lang} type="not_tested" procent={testCasesExecutionStatus.not_tested.percent} cases={testCasesExecutionStatus.not_tested.count} />
                        <SubProcentInfo lang={lang} type="error" procent={testCasesExecutionStatus.fail.percent} cases={testCasesExecutionStatus.fail.count} />
                    </Col>
                    <Col xs={12} md={6}>
                        <SubProcentInfo lang={lang} type="success" procent={testCasesExecutionStatus.success.percent} cases={testCasesExecutionStatus.success.count} />
                        <SubProcentInfo lang={lang} type="blocked" procent={testCasesExecutionStatus.blocked.percent} cases={testCasesExecutionStatus.blocked.count} />
                    </Col>
                </Row>
            </Col>
            <Col xs={12} sm={4}>
                <InfoBlock />
            </Col>
            <Col xs={12}>
                <TaskRunProgress
                    lang={lang}
                    not_tested={testCasesExecutionStatus.not_tested.percent}
                    error={testCasesExecutionStatus.fail.percent}
                    success={testCasesExecutionStatus.success.percent}
                    blocked={testCasesExecutionStatus.blocked.percent} />
            </Col>
        </Row>
    );
};

export default TestRunExecuteInfoBlock;