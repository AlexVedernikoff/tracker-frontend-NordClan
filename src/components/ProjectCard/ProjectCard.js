import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import moment from 'moment';
import localization from './ProjectCard.json';

import Tag from '../Tag';
import Tags from '../Tags';
import * as css from './ProjectCard.scss';

const ProjectCard = props => {
  const {
    id,
    name,
    createdAt,
    usersCount,
    currentSprints,
    tags,
    statusId,
    portfolio,
    dateStartFirstSprint,
    dateFinishLastSprint,
    completedAt
  } = props.project;
  const { isChild, onClickTag, lang } = props;

  const tagList = tags
    ? tags.map((element, i) => <Tag name={element} blocked key={`${i}-tag`} onClick={onClickTag} />)
    : [];

  const query =
    !props.project.currentSprints || props.project.currentSprints[0] === undefined
      ? ''
      : `?currentSprint=${props.project.currentSprints[0].id}`;

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

  const getProjectStartDate = (start, created) => {
    return moment(start ? start : created).format('DD.MM.YYYY');
  };

  const getProjectFinishDate = (finish, completed) => {
    if (finish) {
      return moment(finish).format('DD.MM.YYYY');
    } else if (completed) {
      return moment(completed).format('DD.MM.YYYY');
    }

    return '';
  };

  return (
    <div className={css.projectCard}>
      <Row>
        <Col xs={12} sm={4}>
          <h3 className={classnames({ [css.title]: true, [css.child]: isChild })}>
            <div className={classnames(css.statusMarker, css[status])} data-tip={statusTooltip} data-place="left" />
            <div>
              {portfolio && props.isPortfolio ? (
                <span>
                  <Link className={css.portfolioTitle} to={`/projects/portfolio/${portfolio.id}`}>
                    {portfolio.name}
                  </Link>{' '}
                  <span className={css.titleSplit}>/</span>{' '}
                </span>
              ) : null}
              <Link
                to={{
                  pathname: `/projects/${id}`,
                  search: query,
                  state: { filtersData: query }
                }}
              >
                {name}
              </Link>
            </div>
          </h3>
        </Col>
        <Col xs={12} sm={4}>
          <div className={css.metaBox}>
            {createdAt ? (
              <div className={css.meta}>
                <span>{localization[lang].LIMITATION}</span>
                <span>
                  {getProjectStartDate(dateStartFirstSprint, createdAt)}
                  {dateFinishLastSprint || completedAt ? ' - ' : ''}
                  {getProjectFinishDate(dateFinishLastSprint, completedAt)}
                </span>
              </div>
            ) : null}

            {currentSprints && currentSprints.length ? (
              <div
                className={classnames({
                  [css.meta]: true,
                  [css.metaSprints]: true
                })}
              >
                <span className={css.sprintsMetaText}>{localization[lang].CURRENT_SPRINTS}</span>
                <div className={css.currentSprints}>
                  {currentSprints.map((sprint, i) => (
                    <span key={`sprint-${i}`} className={css.sprint}>
                      {sprint.name} ({moment(sprint.factStartDate).format('DD.MM.YYYY')}-{' '}
                      {moment(sprint.factFinishDate).format('DD.MM.YYYY')})
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className={css.meta}>
              <span>{localization[lang].PARTICIPANTS}</span>
              <span>{usersCount || 0}</span>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={4}>
          <div className={css.tags}>
            <Tags>{tagList}</Tags>
          </div>
        </Col>
      </Row>
    </div>
  );
};

ProjectCard.propTypes = {
  isChild: PropTypes.bool,
  isPortfolio: PropTypes.bool,
  onClickTag: PropTypes.func,
  project: PropTypes.object.isRequired
};

ProjectCard.defaultProps = {
  isPortfolio: true
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(ProjectCard);
