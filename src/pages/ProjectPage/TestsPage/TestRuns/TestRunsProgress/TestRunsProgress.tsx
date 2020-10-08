import React, { FC, useContext } from "react";
import testRunsStore from '../store';
import * as css from "./TestRunsProgress.scss";
import localize from './testRunsProgress.json';


type TestRunsProgressProps = {
    statuses : {
        error: number,
        success: number,
        not_tested: number,
        blocked: number,
    }
}

const TestRunsProgress: FC<TestRunsProgressProps> = ( {statuses: { error, success, not_tested, blocked }} ) => {
    const { lang } = useContext(testRunsStore);
    const loc = localize[lang];
    const template = [error, success, not_tested, blocked].map((val) => `${val}fr`).join(' ');
    const css_template = { gridTemplateColumns: template, };
    return (
        <div className={css.progress} style={css_template}>
            <div className={css.error} title={loc.ERROR}>{error}</div>
            <div className={css.success} title={loc.SUCCESS}>{success}</div>
            <div className={css.not_tested} title={loc.NOT_TESTED}>{not_tested}</div>
            <div className={css.blocked} title={loc.BLOCKED}>{blocked}</div>
        </div>
    );
};

export default TestRunsProgress;