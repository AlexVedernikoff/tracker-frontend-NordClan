import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import moment from 'moment';

import Tag from '../Tag';
import Tags from '../Tags';
import * as css from './ProjectCard.scss';

const ProjectCard = props => {
  const {
    id,
    name,
    createdAt,
    attaches,
    currentSprints,
    tags,
    statusId,
    portfolio,
    dateStartFirstSprint,
    dateFinishLastSprint,
    completedAt
  } = props.project;
  const { isChild, onClickTag } = props;

  const tagList = tags.map((element, i) =>
    <Tag name={element} blocked key={`${i}-tag`} onClick={onClickTag} />
  );

  let statusTooltip = '';
  let status = '';
  switch (statusId) {
  case 1:
    statusTooltip = 'В процессе';
    status = 'INPROGRESS';
    break;

  case 2:
    statusTooltip = 'Приостановлен';
    status = 'INHOLD';
    break;

  case 3:
    statusTooltip = 'Завершен';
    status = 'FINISHED';
    break;

  default:
    statusTooltip = 'Завершен';
    status = 'FINISHED';
  }

  const getProjectStartDate = (dateStartFirstSprint, createdAt) => {
    return moment(dateStartFirstSprint ? dateStartFirstSprint : createdAt).format('DD.MM.YYYY');
  };

  const getProjectFinishDate = (dateFinishLastSprint, completedAt) => {
    if (dateFinishLastSprint) {
      return moment(dateFinishLastSprint).format('DD.MM.YYYY');
    } else if (completedAt) {
      return moment(completedAt).format('DD.MM.YYYY');
    }

    return '';
  };

  return (
    <div className={css.projectCard}>
      <Row>
        <Col xs={12} sm={4}>
          <h3
            className={classnames({ [css.title]: true, [css.child]: isChild })}
          >
            <div
              className={classnames(css.statusMarker, css[status])}
              data-tip={statusTooltip}
              data-place="left"
            />
            <div>
              {
                portfolio && props.isPortfolio
                ? <span><Link className={css.portfolioTitle} to={`/projects/portfolio/${portfolio.id}`}>{portfolio.name}</Link> <span className={css.titleSplit}>/</span> </span>
                : null
              }
              <Link to={`/projects/${id}`}>
                {name}
              </Link>
            </div>
          </h3>
        </Col>
        <Col xs={12} sm={4}>
          <div className={css.metaBox}>
            {createdAt
              ? <div className={css.meta}>
                  <span>Сроки:</span>
                  <span>
                    { getProjectStartDate(dateStartFirstSprint, createdAt) }
                    { dateFinishLastSprint || completedAt ? ' - ' : '' }
                    { getProjectFinishDate(dateFinishLastSprint, completedAt) }
                  </span>
                </div>
              : null}

            {currentSprints.length
              ? <div
                  className={classnames({
                    [css.meta]: true,
                    [css.metaSprints]: true
                  })}
                >
                  <span className={css.sprintsMetaText}>Текущие спринты:</span>
                  <div className={css.currentSprints}>
                    {currentSprints.map((sprint, i) =>
                      <span key={`sprint-${i}`} className={css.sprint}>
                        {sprint.name} ({moment(sprint.factStartDate).format(
                          'DD.MM.YYYY'
                        )}
                        - {moment(sprint.factEndDate).format('DD.MM.YYYY')})
                      </span>
                    )}
                  </div>
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
        <Col xs={12} sm={4}>
          <div className={css.tags}>
            <Tags>
              {tagList}
            </Tags>
          </div>
        </Col>
      </Row>
    </div>
  );
};

ProjectCard.propTypes = {
  isChild: PropTypes.bool,
  onClickTag: PropTypes.func,
  project: PropTypes.object.isRequired
};

ProjectCard.defaultProps = {
  isPortfolio: true
};

export default ProjectCard;
