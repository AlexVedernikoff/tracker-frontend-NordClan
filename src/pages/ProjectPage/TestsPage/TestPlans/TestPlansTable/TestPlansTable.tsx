import React, { FC, useContext, useEffect } from "react";
import { Link } from 'react-router'
import { observer } from "mobx-react";
import store from "../store";
import cn from 'classnames';
import * as css from "./TestPlansTable.scss";
import localize from "./TestPlansTable.json";
import HttpError from "~/components/HttpError";
import Pagination from "~/components/Pagination";
import Button from "~/components/Button";

type TestPlansTableProps = {
    editPlan: (plan_id: number) => void;
}

const TestPlansTable: FC<TestPlansTableProps> = (props: TestPlansTableProps) => {

    const { editPlan } = props;

    const { lang, pagesCount, itemCount, projectId, testPlansLoading, testPlansErrorLoading, loadTestPlans, activePage, setPage, testPlans } = useContext(store);

    useEffect(() => {
        if (projectId != null) {
            loadTestPlans();
        }
    }, [projectId])

    const loc = localize[lang];

    if (testPlansErrorLoading) {
        return (<HttpError error={{status: '', name: 'Ошибка загрузки данных', message: ''}}  />)
    }

    if (pagesCount == 0 && !testPlansLoading) {
        return (<div className={css.data_not_found}>{loc.DATA_NOT_FOUND}</div>)
    }

    const handleExportExcel = (plan_id: number) => {
        alert(`Export #${plan_id}`);
    }

    const handleDelete = (plan_id: number) => {
        alert(plan_id);
    }

    const rows = testPlansLoading ?
        (<div className={css.data_loading}>{loc.DATA_LOADING}</div>) :
        testPlans.map((plan) => (
            <div className={css.row} key={plan.id} onClick={() => editPlan(plan.id)}>
                <div>
                    <div className={css.title}>{plan.title}</div>
                    <div className={css.description}>{plan.description ?? ''}</div>
                </div>
                <div>{plan.caseCount}</div>
                <div>{plan.environmentsCount}</div>
                <div>{plan.createdAt.format('DD.MM.YYYY')}</div>
                <div className={css.buttons}>
                    <Button
                        onClick={(e) => { e.stopPropagation(); handleExportExcel(plan.id)}}
                        type="primary"
                        text=''
                        icon="IconFileExel"
                        name="right"
                    />
                    <Button
                        onClick={(e) => { e.stopPropagation(); handleDelete(plan.id) }}
                        type="primary"
                        text=''
                        icon="IconClose"
                        name="right"
                    />
                </div>
            </div>
        ));

    return (
        <div>
            <div className={css.grid}>
                <div className={cn(css.row, css.header_row)}>
                    <div>{loc.TITLE}</div>
                    <div>{loc.CASE_COUNT}</div>
                    <div>{loc.ENVIRONMENTS_COUNT}</div>
                    <div>{loc.CREATED_AT}</div>
                    <div></div>
                </div>
            { rows }
            </div>
            { !testPlansLoading &&
                <Pagination
                    itemsCount={pagesCount}
                    activePage={activePage}
                    onItemClick={setPage}
                />
            }
    </div>
);

}

export default observer(TestPlansTable);