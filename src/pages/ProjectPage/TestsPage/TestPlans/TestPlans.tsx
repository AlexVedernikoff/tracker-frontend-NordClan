import React, { FC, useContext, useEffect } from "react";
import { Router } from "react-router";
import { Col, Row } from "react-flexbox-grid";
import Button from "~/components/Button";
import Title from "~/components/Title";
import localize from './TestPlans.json';
import { observer } from 'mobx-react';
import store from './store';
import TestPlansTable from "./TestPlansTable";

type TestPlansProps = {
    lang: 'en' | 'ru',
    params: {projectId: string},
    router: Router
};

const TestPlans: FC<TestPlansProps> = (props: TestPlansProps) => {

    const {lang, params: {projectId}, router } = props;
    const { storeInit, initStore } = useContext(store);

    useEffect(() => {
        initStore(lang, Number(projectId));
    }, [lang, projectId]);

    const handleCreateTestPlan = () => {
        router.push(`/projects/${projectId}/test-plan/create`)
    }

    const handleEditPlan = (plan_id) => {
        router.push(`/projects/${projectId}/test-plan/${plan_id}`)
    }

    return (
        <div>
            <Title render={localize[lang].TITLE} />
            {storeInit &&
            <>
                <Row>
                    <Col xs={2}>
                        <Button
                            type="primary"
                            onClick={handleCreateTestPlan}
                            text={localize[lang].START_NEW_TEST_PLAN}
                            icon="IconPlay"
                            name="right" />
                        &nbsp;
                    </Col>
                    <Col xs={10}>
                    </Col>
                </Row>
                <TestPlansTable editPlan={handleEditPlan} />
            </>
            }
        </div>
    )
}

export default observer(TestPlans);