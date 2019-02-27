import React from 'react';
import PropTypes from 'prop-types';
import * as css from './../Planning.scss';
import classnames from 'classnames';
import moment from 'moment';
import SprintStartControl from '../../../../components/SprintStartControl';
import { IconDelete, IconEdit } from '../../../../components/Icons';
import { connect } from 'react-redux';
import localize from './Table.json';

import roundNum from '../../../../utils/roundNum';

class Table extends React.Component {
  static propTypes = {
    canEditPlan: PropTypes.bool,
    entities: PropTypes.array,
    grantActiveYear: PropTypes.string,
    grantYearDecrement: PropTypes.func.isRequired,
    grantYearIncrement: PropTypes.func.isRequired,
    isExternal: PropTypes.bool,
    isProjectAdmin: PropTypes.bool,
    lang: PropTypes.string.isRequired,
    onClickSprint: PropTypes.func.isRequired,
    onDeleteMilestone: PropTypes.func.isRequired,
    openMilestoneEditModal: PropTypes.func.isRequired,
    openSprintEditModal: PropTypes.func.isRequired
  };

  getSprintBlock = (sprint, activeYear) => {
    const { factStartDate: start, factFinishDate: end } = sprint;
    const daysInYear = moment()
      .endOf('year')
      .dayOfYear();
    return {
      left: this.calcLeftPadding(activeYear, daysInYear, start),
      right: this.calcRightPadding(activeYear, daysInYear, end),
      zIndex: 1
    };
  };

  getMilestoneBlock = (date, activeYear) => {
    const daysInYear = moment()
      .endOf('year')
      .dayOfYear();
    return {
      left: this.calcLeftPadding(activeYear, daysInYear, date),
      right: this.calcRightPadding(activeYear, daysInYear, date),
      zIndex: 1
    };
  };

  calcLeftPadding = (activeYear, daysInYear, date) => {
    return +moment(date).format('YYYY') !== +activeYear
      ? '0%'
      : (((moment(date).dayOfYear() - 1) / daysInYear) * 100).toFixed(1) + '%';
  };

  calcRightPadding = (activeYear, daysInYear, date) => {
    return +moment(date).format('YYYY') !== +activeYear
      ? '0%'
      : (100 - (moment(date).dayOfYear() / daysInYear) * 100).toFixed(1) + '%';
  };

  calcTimelinePadding = date => {
    const { grantActiveYear } = this.props;
    const daysInYear = moment()
      .endOf('year')
      .dayOfYear();

    return date.getFullYear() !== grantActiveYear
      ? '0%'
      : (((moment(date).dayOfYear() - 1) / daysInYear) * 100).toFixed(1) + '%';
  };

  getSprintTime = sprint => {
    return `${moment(sprint.factStartDate).format('DD.MM')} ${
      sprint.factFinishDate ? `- ${moment(sprint.factFinishDate).format('DD.MM')}` : '- ...'
    }`;
  };

  currentTimeline = () => {
    const { grantActiveYear } = this.props;
    const date = new Date();

    if (date.getFullYear() === grantActiveYear) {
      return (
        <div
          className={css.timeline}
          style={{ left: this.calcTimelinePadding(date) }}
          data-tip={moment(date).format('DD.MM')}
        />
      );
    }
  };

  detectType = entity => {
    return entity.factStartDate !== undefined ? 'sprint' : 'milestone';
  };

  renderEntityLabels() {
    const { entities, lang } = this.props;

    if (!entities.length) {
      return <div className={css.sprintNames} />;
    }

    return (
      <div className={css.sprintNames}>
        {entities.map((entity, i) => {
          return this.detectType(entity) === 'sprint'
            ? this.renderSprintLabel(entity, i)
            : this.renderMilestoneLabel(entity, i);
        })}
        <div className={classnames(css.name, css.resultName)}>{localize[lang].TOTAL}</div>
      </div>
    );
  }

  renderSprintLabel(sprint, i) {
    const { onClickSprint, isProjectAdmin, openSprintEditModal, isExternal, lang, canEditPlan } = this.props;

    return (
      <div
        key={`sprint-${i}`}
        className={classnames({
          [css.unactive]: sprint.statusId === 1,
          [css.active]: sprint.statusId === 2,
          [css.sprintsListLine]: true
        })}
      >
        <span
          data-tip={sprint.name}
          data-place="bottom"
          className={classnames({
            [css.selection]: true
          })}
          /*data-tip={this.getSprintTime(sprint)}*/
          onClick={onClickSprint(sprint.id)}
        />

        {isProjectAdmin ? <SprintStartControl sprint={sprint} /> : null}

        <div className={classnames(css.name, { [css.nameMargin]: isProjectAdmin })}>{sprint.name}</div>

        {!isExternal && canEditPlan ? (
          <IconEdit
            className={classnames(css.edit, 'edit')}
            data-tip={localize[lang].EDIT}
            onClick={openSprintEditModal(sprint)}
          />
        ) : null}
      </div>
    );
  }

  renderMilestoneLabel(milestone, i) {
    const { openMilestoneEditModal, isExternal, onDeleteMilestone, lang, canEditPlan } = this.props;

    return (
      <div key={`milestone-${i}`} className={css.sprintsListLine}>
        <span
          className={classnames({
            [css.selection]: true
          })}
          data-tip={this.getMilestoneLabel(milestone)}
        />

        <div className={classnames(css.name, { [css.nameMargin]: false })}>{milestone.name}</div>

        {!isExternal && canEditPlan ? (
          <IconEdit
            className={classnames(css.edit, 'edit')}
            data-tip={localize[lang].EDIT}
            onClick={openMilestoneEditModal(milestone)}
          />
        ) : null}
        {!isExternal && canEditPlan ? (
          <IconDelete
            className={classnames(css.delete, 'delete')}
            data-tip={localize[lang].DELETE}
            onClick={onDeleteMilestone(milestone)}
          />
        ) : null}
      </div>
    );
  }

  renderTimeColumn(type) {
    const { entities, isExternal } = this.props;
    const className = classnames({
      [css.sprintNames]: true,
      [css.spentTime]: true
    });
    let timeSumm = 0;
    return (
      <div className={className}>
        <span className={css.header}>{localize[this.props.lang][type]}</span>
        {entities.map((entity, i) => {
          if (this.detectType(entity) === 'sprint') {
            timeSumm += !isExternal ? +entity[type === 'PLAN' ? 'budget' : 'spentTime'] : 0;
            return (
              <span key={`sprint-${i}`} className={css.name}>
                {!isExternal ? roundNum(entity[type === 'PLAN' ? 'budget' : 'spentTime'], 2) : ''}
              </span>
            );
          }
          return (
            <span key={`milestone-${i}`} className={css.name}>
              -
            </span>
          );
        })}
        {entities.length ? <span className={classnames(css.name, css.resultTime)}>{roundNum(timeSumm, 2)}</span> : null}
      </div>
    );
  }

  renderEntities() {
    const { entities } = this.props;

    return entities.map((entity, i) => {
      return this.detectType(entity) === 'sprint' ? this.renderSprint(entity, i) : this.renderMilestone(entity, i);
    });
  }

  currentMonth(sprint) {
    const nd = new Date(sprint.factFinishDate);
    if (nd.getMonth() > 6) {
      return css.toRight;
    }
  }

  renderSprint(sprint, i) {
    const { grantActiveYear } = this.props;
    return (
      <div key={`sprint-${i}`} className={css.tr}>
        <div
          className={classnames({
            [css.sprintBar]: true,
            [css.unactive]:
              sprint.statusId === 1 &&
              moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]'),
            [css.finished]: moment(sprint.factFinishDate).isBefore(moment(), 'days'),
            [css.active]: sprint.statusId === 2,
            [css.future]: moment(sprint.factStartDate).isAfter(moment(), 'days')
          })}
          style={this.getSprintBlock(sprint, grantActiveYear)}
          /*data-tip={this.getSprintTime(sprint)}*/
        >
          <div className={css.SprintInfo__tooltip + ' ' + this.currentMonth(sprint)}>
            <div className={css.text}>{this.getSprintTime(sprint)}</div>
          </div>
        </div>
      </div>
    );
  }

  getMilestoneLabel(milestone) {
    const status = milestone.done ? localize[this.props.lang].COMPLETED : localize[this.props.lang].UNCOMPLETED;
    const date = moment(milestone.date).format('DD.MM');
    return `${milestone.name}. ${date}. ${status}`;
  }

  renderMilestone(milestone, i) {
    const { grantActiveYear, canEditPlan } = this.props;
    return (
      <div key={`milestone-${i}`} className={css.tr}>
        <div
          className={classnames({
            [css.milestoneBar]: true,
            [css.done]: milestone.done,
            [css.review]: milestone.typeId === 1,
            [css.client]: milestone.typeId === 2,
            [css.inside]: milestone.typeId === 3
          })}
          style={this.getMilestoneBlock(milestone.date, grantActiveYear)}
          data-tip={this.getMilestoneLabel(milestone)}
        >
          <div onClick={canEditPlan ? this.props.openMilestoneEditModal(milestone) : null} />
        </div>
      </div>
    );
  }

  render() {
    const { grantActiveYear, grantYearDecrement, grantYearIncrement, lang } = this.props;

    const months = localize[lang].MONTHS;

    return (
      <div className={css.graph}>
        <div className={css.wrapper}>
          {this.renderEntityLabels()}
          {this.renderTimeColumn('PLAN')}
          {this.renderTimeColumn('FACT')}

          <div className={css.table}>
            <div className={css.tr}>
              <div className={css.year}>
                <span className={css.prev} onClick={grantYearDecrement}>
                  {grantActiveYear - 1}
                </span>
                <span className={css.current}>{grantActiveYear}</span>
                <span className={css.next} onClick={grantYearIncrement}>
                  {grantActiveYear + 1}
                </span>
              </div>
            </div>
            <div className={css.tr}>
              <div className={css.nameHeader} />
              {months.map((month, i) => (
                <div
                  key={`sprint-${month}`}
                  className={css.month}
                  style={{ flex: moment(`${grantActiveYear}-${i + 1}`, 'YYYY-MM').daysInMonth() }}
                >
                  {month}
                </div>
              ))}
            </div>
            {this.currentTimeline()}
            {this.renderEntities()}
            <div className={classnames(css.tr, css.resultLine)} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(Table);
