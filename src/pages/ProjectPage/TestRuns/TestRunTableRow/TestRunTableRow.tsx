import React, { FC, useContext, useMemo, useState } from "react";
import * as css from './testRunTableRow.scss';
import localize from './TestRunTableRow.json';
import TestRunsProgress from '../TestRunsProgress';
import { IconCheckCircle, IconEllipsisH, IconError, IconPlay } from "~/components/Icons";
import moment from "moment";
import testRunsStore, { RunTestsExecution, TestRunExecutionStatusDTO } from '../store';
import TestRunsTableRowMenu from "./TestRunsTableRowMenu";

const TestRunsTableRow: FC<RunTestsExecution> = (
    {id, title, description, status, start_time, start_who, environment, run_time, test_status}
) => {

    const { lang } = useContext(testRunsStore);
    const [menuToggle, setMenuToggle] = useState(false);

    const loc = localize[lang];
    const executerActionType = {
        [TestRunExecutionStatusDTO.running] : () => (<IconPlay color='#2463b4' title={loc.STATUS_RUNNING} />),
        [TestRunExecutionStatusDTO.success]: () => (<IconCheckCircle color='green' title={loc.STATUS_SUCCESS} />),
        [TestRunExecutionStatusDTO.error]: () => (<IconError color='red' title={loc.STATUS_FAIL} />),
    };

    const closeMenu = () => setMenuToggle(false);
    const handleMenuAction = (action) => {
        closeMenu();
    }

    const m = run_time == null ?  '-' : run_time.asSeconds();
    const format_date = start_time.format("L LTS");
    const who = start_who[lang];
    return (
            <div className={css.row} key={id}>
                <div className={css.state}>{executerActionType[status ?? -1]()}</div>
                <div>
                    <div className={css.title}>{title}</div>
                    <div className={css.description}> {description}</div>
                </div>
                <div>
                    <div className={css.date}>{format_date}</div>
                    <div className={css.who}>{who}</div>
                </div>
                <div>
                    <div className={css.e_title}>{environment.title}</div>
                    <div className={css.e_description}>{environment.description}</div>
                </div>
                <div>{m}</div>
                <div><TestRunsProgress statuses={test_status} /></div>
                <div className={css.rowMenu}>
                    <IconEllipsisH onClick={() => {
                        setMenuToggle(true);
                    }}/>
                    {menuToggle && <TestRunsTableRowMenu closeMenu={() => setMenuToggle(false)} lang={lang} action={handleMenuAction}/>}
                </div>
            </div>
        );
}

export default TestRunsTableRow;