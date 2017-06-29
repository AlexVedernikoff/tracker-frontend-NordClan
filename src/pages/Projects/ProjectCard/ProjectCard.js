import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import moment from 'moment';

import Tag from '../../../components/Tag';
import * as css from './ProjectCard.scss';

const ProjectCard = props => {
  const {
    id,
    name,
    createdAt,
    attaches,
    currentSprints,
    tags,
    statusId
  } = props.project;
  const { isChild } = props;
  
  const tagList = tags.map((element, i) =>
    <Tag name={element} blocked key={`${i}-tag`} />
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

  return (
    <div className={css.projectCard}>
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
            <Link to={`/projects/${id}`}>
              {name}
            </Link>
          </h3>
        </Col>
        <Col xs>
          <div className={css.metaBox}>
            {createdAt
              ? <div className={css.meta}>
                  <span>Сроки:</span>
                  <span>
                    {moment(createdAt).format("DD/MM/YYYY")} - {}
                  </span>
                </div>
              : null}

            {currentSprints.length
              ? <div className={css.meta}>
                  <span>Текущие спринты:</span>
                  {currentSprints.map((sprint, i) =>
                    <span key={`sprint${i}`}>
                      {sprint.name} ({moment(sprint.factStartDate).format(
                        'DD/MM/YYYY'
                      )}
                      - {moment(sprint.factEndDate).format('DD/MM/YYYY')})
                    </span>
                  )}
                </div>
              : null}

            <div className={css.meta}>
              <span>Участников:</span>
              <span>
                {attaches ? attaches.length : 0}
              </span>
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
  project: PropTypes.object.isRequired
};

export default ProjectCard;
