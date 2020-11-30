import React, { FC, useContext, useEffect } from "react";
import { connect } from 'react-redux';
import TestRunExecute from "./TestRunExecute";
import store from "./store";

const TestRunExecuteRouter: FC<any> = (props) => {
    const { lang, params: {projectId, testRunExecutionId}, user: {id: userId, fullname}, router } = props;
    const { initStore } = useContext(store);

    useEffect(() => {
        initStore(lang, projectId, testRunExecutionId, userId, fullname);
    }, [lang, projectId, testRunExecutionId, userId])

    const editTestRunExecution = () => router.push(`/projects/${projectId}/test-run/${testRunExecutionId}`);
    const goTestPlans = () => router.push(`/projects/${projectId}/tests/runs`);

    return <TestRunExecute {...props} editTestRunExecution={editTestRunExecution} goTestPlans={goTestPlans}/>
};

const mapStateToProps = state => ({
    user: state.Auth.user,
    lang: state.Localize.lang
});

export default connect(
    mapStateToProps,
    {}
)(TestRunExecuteRouter);