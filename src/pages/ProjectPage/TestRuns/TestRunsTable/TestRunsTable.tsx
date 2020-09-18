import React, { FC, useContext, useEffect } from 'react';
import testRunsStore from '~/pages/ProjectPage/TestRuns/store';
import Pagination from '~/components/Pagination';
import * as css from './TestRunsTable.scss'
import * as cssRow from '../TestRunTableRow/testRunTableRow.scss';
import localize from './testRunsTable.json'
import cn from 'classnames';
import TestRunsTableRow from '../TestRunTableRow';

const TestRunsTable: FC<{}> = () => {
    const { lang, pagesCount, activePage, runTests, setPage, runTestsLoading, loadRuns } = useContext(testRunsStore);

    useEffect(() => { loadRuns(); }, []);

    const loc = localize[lang];
    const rows = runTestsLoading ?
        <div className={css.loading}>Loading...</div> :
        runTests.map((runTest) => <TestRunsTableRow {...runTest} key={runTest.id} />);

    return (
        <div>
            <div className={css.grid}>
                <div className={cn(cssRow.row, css.header_row)}>
                    <div></div>
                    <div>{loc.RUN_NAME}</div>
                    <div>{loc.TIME_START}</div>
                    <div>{loc.ENVIRONMENT}</div>
                    <div>{loc.RUN_TIME}</div>
                    <div>{loc.STATUS}</div>
                    <div></div>
                </div>
                { rows }
            </div>
            { !runTestsLoading && <Pagination
                    itemsCount={pagesCount}
                    activePage={activePage}
                    onItemClick={setPage}
                />
            }
        </div>
    );
};

export default TestRunsTable;
