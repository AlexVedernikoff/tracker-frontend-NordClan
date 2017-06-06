import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';

import Tag from '../Tag';
import * as css from './ProjectCard.scss';

const ProjectCard = (props) => {
  const {
    name,
    dateStart,
    dateEnd,
    activeSprint,
    members,
    tags,
    status,
    ...other
  } = props.project;

  const tagList = tags.map((element, i) =>
    <Tag name={element} blocked key={i} />
  );

  return (
    <div className={css.projectCard} {...other}>
      <h3 className={css.title}>
        <div className={classnames(css.statusMarker, css[status])}></div>
        <Link to="/projects/1">{name}</Link>
      </h3>
      <div className={css.tags}>
        {tagList}
      </div>
      <div className={css.meta}>
        <span>Сроки:</span>
        <span>{dateStart} - {dateEnd}</span>
      </div>
      <div className={css.meta}>
        <span>Текущий спринт:</span>
        <span>{activeSprint.name} ({activeSprint.dateStart} - {activeSprint.dateEnd})</span>
      </div>
      <div className={css.meta}>
        <span>Участников:</span>
        <span>{members}</span>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.object
};

export default ProjectCard;
