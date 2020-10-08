import React, { FC } from "react";
import { Col, Row } from "react-flexbox-grid";
import Button from "~/components/Button";
import InlineHolder from "~/components/InlineHolder";
import { localize } from "../localize";
import SubProcentInfoLoading from "./SubProcentInfoLoading";
import * as css from '../TestRunExecute.scss';
import TaskRunProgress from "../TaskRunProgress";

const LoadingMockup: FC<any> = ({ lang }) => {
    const local = localize[lang];
    return (
        <div>
            <header className={css.header}>
                <h1><InlineHolder length="60%" /></h1>
                <h3><InlineHolder length="80%" /></h3>
            </header>
            <Row>
                <Col xs={12} className={css.actionPlace}>
                    <Button
                        text={local.BUTTONS.EDIT}
                        icon="IconEdit"
                        type="green"
                        loading />
                    <Button
                        text={local.BUTTONS.DELETE}
                        icon="IconDelete"
                        type="red"
                        loading />
                    <Button
                        text={local.BUTTONS.CANCEL}
                        loading />
                </Col>
            </Row>
            <hr />
            <Row>
                <Col xs={12} sm={2}>
                    <h2 className={css.TestRunProcent}><InlineHolder length="80%" /></h2>
                </Col>
                <Col xs={12} sm={6}>
                    <Row>
                        <Col xs={12} md={6}>
                            <SubProcentInfoLoading type="not_tested" />
                            <SubProcentInfoLoading type="error" />
                        </Col>
                        <Col xs={12} md={6}>
                            <SubProcentInfoLoading type="success" />
                            <SubProcentInfoLoading type="blocked" />
                        </Col>
                    </Row>
                </Col>
                <Col xs={12}>
                    <TaskRunProgress lang={lang} not_tested={100} />
                </Col>
            </Row>

        </div>
    );
};

export default LoadingMockup;