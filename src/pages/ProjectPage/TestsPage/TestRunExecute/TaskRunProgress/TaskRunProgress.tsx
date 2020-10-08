import React, { FC } from "react";
import * as css from '../TestRunExecute.scss';
import localize from "../TestRunExecute.json";

const TaskRunProgress: FC<any> = ({ lang, not_tested, error, success, blocked }) => {
    const style = [not_tested, error, success, blocked].map(n => `${n}fr`).join(" ");
    const local = localize[lang];
    return (
        <div className={css.taskRunProgress} style={{ 'gridTemplateColumns': style }}>
            <div className={css.taskRunProgress__not_tested} data-tip={local.CASE_STATUS.NOT_TESTED} />
            <div className={css.taskRunProgress__error} data-tip={local.CASE_STATUS.FAIL} />
            <div className={css.taskRunProgress__success} data-tip={local.CASE_STATUS.SUCCESS} />
            <div className={css.taskRunProgress__blocked} data-tip={local.CASE_STATUS.BLOCKED} />
        </div>
    );
};

export default TaskRunProgress;