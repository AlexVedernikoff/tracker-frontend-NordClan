import React, { FC, useContext, useEffect, useState } from "react";
import Button from "~/components/Button";
import { TestCasesExecutionStatus } from "../store";
import localize from './ActionPlace.json';
import * as css  from './ActionPlace.scss';
import cnn from 'classnames';

type ActionPlaceProp = {
    lang: 'ru' | 'en';
    withText?: boolean;
    action: (action: TestCasesExecutionStatus) => void;
}

const ActionPlace: FC<ActionPlaceProp> = ({lang, action, withText}) => {
    const local = localize[lang];
    const getText = (text) => withText ? { text } : {"data-tip": text};
    return (
        <div className={cnn(css.actionPlace, {[css.actionPlaceWithText]: withText} )}>
            <Button
                {...getText(local.SKIPED)}
                icon="IconTime"
                type="grey"
                onClick={(e) => {e.stopPropagation(); action(TestCasesExecutionStatus.SKIPED)}}
            />
            <Button
                {...getText(local.FAIL)}
                icon="IconClose"
                addedClassNames={{[css.red_button]: true}}
                onClick={(e) => {e.stopPropagation(); action(TestCasesExecutionStatus.FAIL)}}
            />
            <Button
                {...getText(local.SUCCESS)}
                icon="IconCheck"
                type="green"
                onClick={(e) => {e.stopPropagation(); action(TestCasesExecutionStatus.SUCCESS)}}
            />
            <Button
                {...getText(local.BLOCKED)}
                icon="IconError"
                addedClassNames={{[css.orange_button]: true}}
                onClick={(e) => {e.stopPropagation(); action(TestCasesExecutionStatus.BLOCKED)}}
            />
        </div>
    )
}

export default ActionPlace;