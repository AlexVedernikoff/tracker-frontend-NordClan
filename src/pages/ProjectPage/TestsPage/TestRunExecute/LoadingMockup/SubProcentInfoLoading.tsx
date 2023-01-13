import React, { FC } from "react";
import css from '../TestRunExecute.scss';
import InlineHolder from "~/components/InlineHolder";

const SubProcentInfoLoading: FC<any> = ({ type }) => {
    return (
        <div className={css.SubProcentInfo}>
            <div className={css[`SubProcentInfo__color_block--${type}`]}>
            </div>
            <div className={css.SubProcentInfo__percent}>
                <InlineHolder length="60%" />
            </div>
            <div className={css.SubProcentInfo__cases_count}>
                <InlineHolder length="40%" />
            </div>
        </div>
    );
};

export default SubProcentInfoLoading;