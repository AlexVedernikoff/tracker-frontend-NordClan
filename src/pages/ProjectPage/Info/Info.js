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
        <Tags taggable="project"
              taggableId={this.props.id}
              create>
          {this.props.tags
            ? this.props.tags.map((element, i) =>
                <Tag name={element}
                     key={`${i}-tag`}
                     taggable="project"
                     taggableId={this.props.id}/>
              )
            : null}
        </Tags>
        <hr />
        <Description
          text={{
            __html: this.props.description ? this.props.description : ''
          }}
          headerType="h2"
          id={this.props.id}
          headerText="Описание"
        />
        <hr />
        <h2>Файлы</h2>
        <Attachments />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  id: state.Project.project.id,
  tags: state.Project.project.tags,
  description: state.Project.project.description
});

export default connect(mapStateToProps)(Info);
