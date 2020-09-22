import React, { FC } from "react";
import { connect } from 'react-redux';
import Tabs from '~/components/Tabs';
import Pane from "~/components/Pane";
import localize from './TestsPage.json';
import * as css from './TestsPage.scss';
import TestCases from '~/pages/ProjectPage/TestCases';
import TestRuns from '~/pages/ProjectPage/TestRuns';

type TestsPageProps = {
    params: {projectId: string, testsPage: string},
    lang: string,
}

const TestsPage: FC<TestsPageProps> = (props: TestsPageProps) => {
    const { lang = 'ru', params: { projectId, testsPage }} = props;
    return (
        <Tabs
            addedClassNames={{ [css.tabs]: true }}
            routable
            selected={testsPage}
            currentPath={`/projects/${projectId}/tests`}
    >
        <Pane label={localize[lang].TEST_CASE} path="/cases">
            <TestCases { ...props } />
        </Pane>
        <Pane label={localize[lang].TEST_PLAN} path="/plan">
            <h3>
                {localize[lang].TEST_PLAN}
            </h3>
        </Pane>
        <Pane label={localize[lang].TEST_RUN} path="/runs">
            <TestRuns { ...props } />
        </Pane>
    </Tabs>
    );
}

const mapStateToProps = state => ({
    project: state.Project.project,
    user: state.Auth.user,
    lang: state.Localize.lang
});

export default connect(
    mapStateToProps,
    {}
  )(TestsPage);