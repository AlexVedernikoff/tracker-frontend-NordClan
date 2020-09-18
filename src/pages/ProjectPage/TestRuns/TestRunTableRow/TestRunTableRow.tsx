import React, { FC, useContext, useMemo, useState } from "react";
import * as css from './testRunTableRow.scss';
import localize from './TestRunTableRow.json';
import TestRunsProgress from '../TestRunsProgress';
import { IconCheckCircle, IconEllipsisH, IconError, IconPlay } from "~/components/Icons";
import moment from "moment";
import testRunsStore from '../store';
import TestRunsTableRowMenu from "./TestRunsTableRowMenu";

type TestRunsTableRowProp = {
    id: any,
    name: string,
    state: 0 | 1 | 2,
    start_time: {
        date: number,
        who: string,
    },
    environment: any,
    run_time: number,
    test_status: {
        error: number,
        success: number,
        not_tested: number,
        blocked: number,
    }
};

const TestRunsTableRow: FC<TestRunsTableRowProp> = ( {id, name, state, start_time: { date, who }, environment, run_time, test_status} ) => {

    const { lang } = useContext(testRunsStore);
    const [menuToggle, setMenuToggle] = useState(false);

    const loc = localize[lang];
    const executerActionType = {
        0: () => (<IconPlay color='#2463b4' title={loc.STATUS_RUNNING} />),
        1: () => (<IconCheckCircle color='green' title={loc.STATUS_SUCCESS} />),
        2: () => (<IconError color='red' title={loc.STATUS_FAIL} />),
    };

    const closeMenu = () => setMenuToggle(false);
    const handleMenuAction = (action) => {
        closeMenu();
    }

    const m = moment.utc(run_time * 1000).format('HH:mm:ss');
    const format_date = moment(date).format();
    return (
            <div className={css.row} key={id}>
                <div className={css.state}>{executerActionType[state]()}</div>
                <div>{name}</div>
                <div>
                    <div className={css.date}>{format_date}</div>
                    <div className={css.who}>{who}</div>
                </div>
                <div>{environment}</div>
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