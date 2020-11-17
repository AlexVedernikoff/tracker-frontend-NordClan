import React, { FC, useContext, useEffect } from "react";
import { observer } from "mobx-react";
import store, { TestsPlan } from "../store";
import cn from 'classnames';
import * as css from "./TestPlansTable.scss";
import localize from "./TestPlansTable.json";
import HttpError from "~/components/HttpError";
import Pagination from "~/components/Pagination";
import Button from "~/components/Button";
import _ from 'lodash';
import InlineHolder from "~/components/InlineHolder";
import { useConfirmModal } from "~/components/ConfirmModal";
import { API_URL } from '~/constants/Settings';

type TestPlansTableProps = {
    editPlan: (plan_id: number) => void;
}

const TestPlansTable: FC<TestPlansTableProps> = (props: TestPlansTableProps) => {

    const { editPlan } = props;

    const {
        lang, projectId,
        pagesCount, itemCount, activePage,
        testPlans,
        testPlansLoading, testPlansErrorLoading,
        loadTestPlans, setPage, deleteTestPlan
    } = useContext(store);

    useEffect(() => {
        if (projectId != null) {
            loadTestPlans();
        }
    }, [projectId])

    const loc = localize[lang];

    const [confirmDeleteComponent, confirmDelete] = useConfirmModal(loc.DELETE_SUBMIT_CONFIRM, (plan_id?: number) => plan_id && deleteTestPlan(plan_id));

    if (testPlansErrorLoading) {
        return (<HttpError error={{status: '', name: 'Ошибка загрузки данных', message: ''}}  />)
    }

    if (pagesCount == 0 && !testPlansLoading) {
        return (<div className={css.data_not_found}>{loc.DATA_NOT_FOUND}</div>)
    }

    const rows = testPlansLoading ?
        (
            <div className={css.row}>
                <div><InlineHolder length="80%" /></div>
                <div><InlineHolder length="80%" /></div>
                <div><InlineHolder length="80%" /></div>
                <div><InlineHolder length="80%" /></div>
                <div></div>
            </div>
            ) :
        _.orderBy(testPlans, (plan: TestsPlan) => plan.createdAt.unix).map((plan) => (
                <div className={css.row} key={plan.id} onClick={() => editPlan(plan.id)}>
                    <div className={css.title}>{plan.title}</div>
                    <div className={css.description}>{plan.description ?? ''}</div>
                    <div>{plan.caseCount}</div>
                    <div>{plan.createdAt.format('DD.MM.YYYY')}</div>
                    <div className={css.buttons}>
                        <a
                            onClick={e => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferref"
                            href={`${API_URL}/project/${projectId}/test-plans/${plan.id}/report?lang=${lang}`}
                            className={css.button_wrapper}
                        >
                            <Button
                                type="primary"
                                text=''
                                icon="IconFileExel"
                                name="right"
                            />
                        </a>
                        <Button
                            onClick={(e) => { e.stopPropagation(); confirmDelete(plan.id) }}
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
                    <div>{loc.DESCRIPTION}</div>
                    <div>{loc.CASE_COUNT}</div>
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
            { confirmDeleteComponent }
    </div>
);

}

export default observer(TestPlansTable);
