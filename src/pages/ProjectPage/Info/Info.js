import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Info.scss';

import Attachments from '../../../components/Attachments';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import Description from '../../../components/Description';
import { DescriptionText } from '../../../mocks/descriptionText';

export default class Info extends Component {
  static propTypes = {};

  render () {
    return (
      <div className={css.info}>
        <h2>Теги проекта</h2>
        {/*<hr/>*/}
        <Tags>
          <Tag name="angular.js" />
          <Tag name="web" />
          <Tag name="android" />
          <Tag name="java" />
          <Tag name="iOS" />
          <Tag name="2015" />
          <Tag name="2016" />
          <Tag name="2017" />
          <Tag name="Внутренний" />
        </Tags>
        <hr />
        <Description text={DescriptionText} headerType="h2" headerText="Описание" />
        <hr />
        <h2>Файлы</h2>
        {/*<hr/>*/}
        <Attachments />
      </div>
    );
  }
}
