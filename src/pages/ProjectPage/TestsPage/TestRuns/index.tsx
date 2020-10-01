import TestRuns from './TestRuns';
import { Router } from 'react-router';
import { connect } from 'react-redux';
import React, { Component, FC, useContext, useEffect } from 'react';
import testRunsStore from './store';
import { projectIdSelector } from '~/selectors/Project';


const mapStateToProps = state => ({
  lang: state.Localize.lang,
  projectId: projectIdSelector(state),
});

type TestRunsRouterProps = {
  lang: 'en' | 'ru',
  projectId: number,
  router: Router
}

const TestRunsRouter: FC<TestRunsRouterProps> = ({ lang, projectId, router }) => {
  let {initStore} = useContext(testRunsStore);

  useEffect(() => {
    initStore(lang, projectId);
  }, [ lang, projectId ])

  const handlers = {
    openTestRun: (testExecutionId: number) => {
      router.push(`/projects/${projectId}/test-run/${testExecutionId}`);
    },
    startTestRun: () => {
      router.push(`/projects/${projectId}/test-run/start`);
    },
  }

  return <TestRuns {...handlers} />;
};

export default connect( mapStateToProps, {} )(TestRunsRouter);
