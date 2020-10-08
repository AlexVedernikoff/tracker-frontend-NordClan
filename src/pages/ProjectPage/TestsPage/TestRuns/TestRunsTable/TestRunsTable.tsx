import React, { FC, useContext, useEffect } from 'react';
import testRunsStore from '../store';
import Pagination from '~/components/Pagination';
import * as css from './TestRunsTable.scss'
import * as cssRow from '../TestRunTableRow/testRunTableRow.scss';
import localize from './testRunsTable.json'
import cn from 'classnames';
import TestRunsTableRow from '../TestRunTableRow';

type TestRunsTableProps = {
    openTestRun: (testExecutionId: number) => void;
    openTestRunExecution: (testExecutionId: number) => void;
}

const TestRunsTable: FC<TestRunsTableProps> = (props) => {
    const { lang, pagesCount, activePage, runTests, setPage, runTestsLoading, loadRuns, projectId } = useContext(testRunsStore);

    useEffect(() => {
        if (projectId != null) {
            loadRuns();
        }
    }, [projectId]);

    const loc = localize[lang];

    if (pagesCount == 0) {
        return (<div className={css.data_not_found}>{loc.DATA_NOT_FOUND}</div>)
    }

    const rows = runTestsLoading ?
        <div className={css.loading}>Loading...</div> :
        runTests.map((runTest) => <TestRunsTableRow {...runTest} {...props} key={runTest.id} />);


    return (
        <div>
            <div className={css.grid}>
                <div className={cn(cssRow.row, css.header_row)}>
                    <div></div>
                    <div>{loc.RUN_NAME}</div>
                    <div>{loc.RUN_DESCRIPTION}</div>
                    <div>{loc.DATE_START}</div>
                    <div>{loc.WHO}</div>
                    <div>{loc.ENVIRONMENT}</div>
                    <div>{loc.TIME_START}</div>
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
