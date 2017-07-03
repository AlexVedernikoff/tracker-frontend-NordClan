import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Info.scss';
import { connect } from 'react-redux';

import Attachments from '../../../components/Attachments';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import Description from '../../../components/Description';
import { DescriptionText } from '../../../mocks/descriptionText';

class Info extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className={css.info}>
        <h2>Теги проекта</h2>
        <Tags>
          {this.props.tags
            ? this.props.tags.map((element, i) =>
                <Tag name={element} blocked key={`${i}-tag`} />
              )
            : null}
        </Tags>
        <hr />
        {this.props.description
          ? <Description
              text={
                this.props.description ? { __html: this.props.description } : {}
              }
              headerType="h2"
              id={this.props.id}
              headerText="Описание"
            />
          : null}
        <hr />
        <h2>Файлы</h2>
        <Attachments />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  id: state.ProjectInfo.project.id,
  tags: state.ProjectInfo.project.tags,
  description: state.ProjectInfo.project.description
});

export default connect(mapStateToProps)(Info);
