import React, { FC, useContext, useState } from "react";
import { IconDelete, IconEdit, IconPlay } from "~/components/Icons";
import onClickOutside from "react-onclickoutside";

import localize from './TestRunsTableRowMenu.json';
import css from './TestRunsTableRowMenu.scss';

type TestRunsTableRowMenuProps = {
    closeMenu: Function,
    lang: string
    action: (actionName: string) => void,
};

class TestRunsTableRowMenu extends React.Component<TestRunsTableRowMenuProps, any> {

    handleClickOutside = evt => {
        this.props.closeMenu();
    };

    render(){
        const {lang, action} = this.props;
        const loc = localize[lang];

        return (
            <div className={css.menu}>
                <div className={css.menuItem} onClick={(e)=>{e.stopPropagation();action("delete")}}>
                    <IconDelete /> {loc.DELETE_EXECUTION}
                </div>
                <div className={css.menuItem} onClick={(e)=>{e.stopPropagation();action("edit")}}>
                    <IconEdit /> {loc.CHANGE_EXECUTION}
                </div>
                <div className={css.menuItem} onClick={(e)=>{e.stopPropagation(); action("run")}}>
                    <IconPlay /> {loc.RUN_EXECUTION}
                </div>
            </div>
        )
    };
}

export default onClickOutside(TestRunsTableRowMenu);