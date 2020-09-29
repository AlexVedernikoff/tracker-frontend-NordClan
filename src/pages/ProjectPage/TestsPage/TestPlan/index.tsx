import React from 'react';
import { Router } from 'react-router';
import {connect} from 'react-redux';
import TestPlan from './TestPlan';

type TestPlanContainerProps = {
    params: {projectId: string, testRunId: string},
    lang: 'en' | 'ru',
    router: Router,
}

class TestPlanContainer extends React.Component<TestPlanContainerProps, any> {

    render() {

        return (
            <TestPlan {...this.props} />
        );

    }

}

const mapStateToProps = state => ({
    user: state.Auth.user,
    lang: state.Localize.lang
});

export default connect(
    mapStateToProps,
    {}
)(TestPlanContainer);
