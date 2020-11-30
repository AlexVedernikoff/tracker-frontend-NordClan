import React, { FC, useContext, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import testRunsStore from '../store';
import Pagination from '~/components/Pagination';
import * as css from './TestRunsTable.scss'
import * as cssRow from '../TestRunTableRow/testRunTableRow.scss';
import localize from './testRunsTable.json'
import cn from 'classnames';
import TestRunsTableRow from '../TestRunTableRow';
import InlineHolder from '~/components/InlineHolder';

type TestRunsTableProps = {
    openTestRun: (testExecutionId: number) => void;
    openTestRunExecution: (testExecutionId: number) => void;
}

const TestRunsTableHeader: FC<any> = ({lang}) => {
    const loc = localize[lang];
    return (
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
    )
}

const TestRunsTable: FC<TestRunsTableProps> = (props) => {
    const { lang, pagesCount, activePage, runTests, setPage, runTestsLoading, loadRuns, projectId } = useContext(testRunsStore);

    const loc = localize[lang];

    useEffect(() => {
        ReactTooltip.rebuild();
    })

    if (runTestsLoading) {
        return (
            <div>
                <div className={css.grid}>
                    <TestRunsTableHeader lang={lang} />
                    <div className={cssRow.row}>
                        <div><InlineHolder length="60%" /></div>
                        <div><InlineHolder length="60%" /></div>
                        <div><InlineHolder length="60%" /></div>
                        <div><InlineHolder length="60%" /></div>
                        <div><InlineHolder length="60%" /></div>
                        <div><InlineHolder length="60%" /></div>
                        <div><InlineHolder length="60%" /></div>
                        <div><InlineHolder length="60%" /></div>
                        <div><InlineHolder length="60%" /></div>
                    </div>
                </div>
            </div>
        );
    }

    if (pagesCount == 0) {
        return (<div className={css.data_not_found}>{loc.DATA_NOT_FOUND}</div>)
    }

    const rows = runTests.map((runTest) => <TestRunsTableRow {...runTest} {...props} key={runTest.id} />);

    return (
        <div>
            <div className={css.grid}>
                <TestRunsTableHeader lang={lang} />
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
