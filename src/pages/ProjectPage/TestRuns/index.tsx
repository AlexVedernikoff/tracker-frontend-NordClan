import TestRuns from './TestRuns';
import { connect } from 'react-redux';
import React, { Component, FC, useContext, useEffect } from 'react';
import testRunsStore from './store';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

type TestRunsRouterProps = {
  lang: 'en' | 'ru',
}

const TestRunsRouter: FC<TestRunsRouterProps> = ({ lang }) => {
    let {lang: storeLang, setLang} = useContext(testRunsStore);

    useEffect(() => {
      setLang(lang);
    }, [ lang ])

    return <TestRuns />;
};

export default connect( mapStateToProps, {} )(TestRunsRouter);
