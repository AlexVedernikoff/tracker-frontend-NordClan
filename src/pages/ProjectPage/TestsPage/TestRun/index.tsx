import React, { FC, useContext, useEffect } from 'react';
import { Router } from 'react-router';
import { connect } from 'react-redux';
import TestRunCreate from './TestRunCreate';
import TestRunStore, { EnvironmentInfo, UserInfo } from './store';
import { getProjectInfo } from '~/actions/Project';

type TestRunRouterProps = {
    lang: 'en' | 'ru',
    params: {projectId: string, testRunExecutionId: string},
    router: Router,
    getProjectInfo: (id) => void,
    users: UserInfo[] | undefined,
    environments: EnvironmentInfo[] | undefined
}

const TestRunCreateRouter: FC<TestRunRouterProps> = (props) => {

    const { lang, params: {projectId}, getProjectInfo, router, users, environments } = props
    let { initStore, setEnvironments, setUsers } = useContext(TestRunStore);

    useEffect(() => {
        getProjectInfo(projectId);
    }, [projectId]);

    useEffect(() => {
        initStore({
            lang,
            projectId: Number(projectId),
        });
    }, [lang, projectId]);

    useEffect(() => {
        setUsers(users ?? []);
    }, [users]);

    useEffect(() => {
        setEnvironments(environments ?? []);
    }, [environments]);

    return <TestRunCreate closeForm={() => router.push(`/projects/${projectId}/tests/runs`)} />;
};

const mapDispatchToProps = {
    getProjectInfo,
}

const mapStateToProps = state => ({
    user: state.Auth.user,
    users: state.Project.project.users,
    environments: state.Project.project.projectEnvironments,
    lang: state.Localize.lang,
});

export default connect(mapStateToProps, mapDispatchToProps)(TestRunCreateRouter);
