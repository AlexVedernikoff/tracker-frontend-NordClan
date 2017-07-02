import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as css from './Info.scss';

import Attachments from '../../../components/Attachments';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import Description from '../../../components/Description';
import {DescriptionText} from '../../../mocks/descriptionText';

export default class Info extends Component {
    static propTypes = {};

    render() {
        // let Tags;
        //
        // if (data.length > 0) {
        //     Tags = data.map(function (item, index) {
        //         return (
        //             <div key={id}>
        //                 <Tag name={item.name}
        //                      taggable="project"/>
        //             </div>
        //         )
        //     })
        // } else {
        //     null;
        // }
        return (
            <div className={css.info}>
                <h2>Теги проекта</h2>
                {/*<hr/>*/}
                <Tags create taggable='project'>
                    <Tag name="angular.js"
                         taggable="project"/>
                    <Tag name="web"
                         taggable="project"/>
                    <Tag name="android"
                         taggable="project"/>
                    <Tag name="java"
                         taggable="project"/>
                    <Tag name="iOS"
                         taggable="project"/>
                    <Tag name="2015"
                         taggable="project"/>
                    <Tag name="2016"
                         taggable="project"/>
                    <Tag name="2017"
                         taggable="project"/>
                    <Tag name="Внутренний"
                         taggable="project"/>
                </Tags>
                <hr />
                <Description text={DescriptionText} headerType="h2" headerText="Описание"/>
                <hr />
                <h2>Файлы</h2>
                {/*<hr/>*/}
                <Attachments />
            </div>
        );
    }
}
