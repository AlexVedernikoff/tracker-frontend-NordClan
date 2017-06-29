import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import Tag from '../Tag';
import * as css from './ProjectCard.scss';

const ProjectCard = props => {
  const {
    name,
    createdAt,
    factStartDate,
    factEndDate,
    activeSprint,
    members,
    tags,
    status,
    ...other
  } = props.project;
  console.log("PROPS PROJECT", props.project);

  const { isChild } = props;

  const tagList = tags.map((element, i) =>
    <Tag name={element} blocked key={i} />
  );

  let statusTooltip = '';
  switch (status) {
    case 'INPROGRESS':
      statusTooltip = 'В процессе';
      break;

    case 'INHOLD':
      statusTooltip = 'Приостановлен';
      break;

    case 'FINISHED':
      statusTooltip = 'Завершен';
      break;

    default:
      statusTooltip = 'Завершен';
  }

  console.log(isChild);

  return (
    <div className={css.projectCard} {...other}>
      <Row>
        <Col xs>
          <h3
            className={classnames({ [css.title]: true, [css.child]: isChild })}
          >
            <div
              className={classnames(css.statusMarker, css[status])}
              data-tip={statusTooltip}
              data-place="left"
            />
            <Link to="/projects/1">{name}</Link>
          </h3>
        </Col>
        <Col xs>
          <div className={css.metaBox}>

            {createdAt
              ? <div className={css.meta}>
                  <span>Сроки:</span>
                  <span>{createdAt} - {}</span>
                </div>
              : null}

            {activeSprint
              ? <div className={css.meta}>
                  <span>Текущий спринт:</span>
                  <span>
                    {activeSprint.name} ({activeSprint.dateStart} -{' '}
                    {activeSprint.dateEnd})
                  </span>
                </div>
              : null}

            <div className={css.meta}>
              <span>Участников:</span>
              <span>{members}</span>
            </div>
          </div>
        </Col>
        <Col xs>
          <div className={css.tags}>
            {tagList}
          </div>
        </Col>
      </Row>
    </div>
  );
};

ProjectCard.propTypes = {
  isChild: PropTypes.bool,
  project: PropTypes.object
};

export default ProjectCard;
