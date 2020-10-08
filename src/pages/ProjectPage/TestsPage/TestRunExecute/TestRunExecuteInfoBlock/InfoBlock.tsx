import React, { FC, useContext } from "react";
import { observer } from "mobx-react";
import store from "../store";
import * as css from '../TestRunExecute.scss';
import localize from "../TestRunExecute.json";

const InfoBlock: FC<any> = ({ }) => {
    const { lang, testRunExecution: { environment, executor, testPlan, startTime }, testCasesCount } = useContext(store);
    const local = localize[lang];
    return (
        <div className={css.detailsBlock}>
            <div className={css.detailsBlock_row}>
                <div>{local.CASES_COUNT}</div>
                <div>{testCasesCount}</div>
            </div>
            <div className={css.detailsBlock_row}>
                <div>{local.ENVIRONMENT}</div>
                <div>{environment?.title ?? ''}</div>
            </div>
            <div className={css.detailsBlock_row}>
                <div>{local.EXECUTOR}</div>
                <div>{executor?.fullName}</div>
            </div>
            <div className={css.detailsBlock_row}>
                <div>{local.TEST_PLAN}</div>
                <div>{testPlan?.title}</div>
            </div>
            <div className={css.detailsBlock_row}>
                <div>{local.START_DATE}</div>
                <div>{startTime?.format("L LTS") ?? '-'}</div>
            </div>
        </div>
    );
};

export default observer(InfoBlock);