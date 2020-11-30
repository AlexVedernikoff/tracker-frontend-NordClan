import React, { FC } from "react";
import * as css from '../TestRunExecute.scss';
import localize from "../TestRunExecute.json";

const SubProcentInfo: FC<any> = ({ lang, type, procent, cases }) => {
    const local = localize[lang];
    return (
        <div className={css.SubProcentInfo}>
            <div className={css[`SubProcentInfo__color_block--${type}`]}>
            </div>
            <div className={css.SubProcentInfo__percent}>
                {procent}% {local.PROCENT_INFO[type.toUpperCase()]}
            </div>
            <div className={css.SubProcentInfo__cases_count}>
                {cases} {local.PROCENT_INFO.CASES}
            </div>
        </div>
    );
};

export default SubProcentInfo;