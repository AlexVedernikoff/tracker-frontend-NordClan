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
    const template = [error, success, not_tested, blocked].filter(val => val > 0).map((val) => `${val}fr`).join(' ');
    const css_template = { gridTemplateColumns: template, };
    return (
        <div className={css.progress} style={css_template}>
            { (error > 0) &&  <div className={css.error} data-tip={loc.ERROR}>{error}</div> }
            { (success > 0) && <div className={css.success} data-tip={loc.SUCCESS}>{success}</div> }
            { (not_tested > 0) && <div className={css.not_tested} data-tip={loc.NOT_TESTED}>{not_tested}</div> }
            { (blocked > 0) && <div className={css.blocked} data-tip={loc.BLOCKED}>{blocked}</div> }
        </div>
    );
};

export default TestRunsProgress;