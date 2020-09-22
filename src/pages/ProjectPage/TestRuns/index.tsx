import TestRuns from './TestRuns';
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
}

const TestRunsRouter: FC<TestRunsRouterProps> = ({ lang, projectId }) => {
  let {initStore} = useContext(testRunsStore);

  useEffect(() => {
    initStore(lang, projectId);
  }, [ lang, projectId ])

  return <TestRuns />;
};

export default connect( mapStateToProps, {} )(TestRunsRouter);
