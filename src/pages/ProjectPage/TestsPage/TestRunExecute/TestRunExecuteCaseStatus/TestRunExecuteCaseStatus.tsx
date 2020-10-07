import React, { FC } from "react";
import { IconCheck, IconClose, IconError, IconMinus, IconPreloader, IconTime } from "~/components/Icons";

import * as css from '../TestRunExecute.scss';
import { localize } from "../localize";
import { TestCasesExecutionStatus } from "../store";

const TestRunExecuteCaseStatus: FC<any> = ({ lang, status }) => {
    const local = localize[lang];
    if (status == null)
        return (<IconMinus data-tip={local.CASE_STATUS.NOT_TESTED} className={css.caseIconNotTested} />);
    if (status == TestCasesExecutionStatus.FAIL)
        return (<IconClose data-tip={local.CASE_STATUS.FAIL} className={css.caseIconFail} />);
    if (status == TestCasesExecutionStatus.SUCCESS)
        return (<IconCheck data-tip={local.CASE_STATUS.SUCCESS} className={css.caseIconSuccess} />);
    if (status == TestCasesExecutionStatus.BLOCKED)
        return (<IconError data-tip={local.CASE_STATUS.BLOCKED} className={css.caseIconBlocked} />);
    if (status == TestCasesExecutionStatus.SKIPED)
        return (<IconTime data-tip={local.CASE_STATUS.SKIPED} className={css.caseIconSkiped} />);
    if (status == TestCasesExecutionStatus.LOADING)
        return (<IconPreloader data-tip={local.CASE_STATUS.LOADING} className={css.caseIconLoading} />);
    return (<div />);
};

export default TestRunExecuteCaseStatus;