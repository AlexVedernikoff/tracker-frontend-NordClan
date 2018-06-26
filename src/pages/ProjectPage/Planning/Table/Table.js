import React from 'react';
import * as css from './../Planning.scss';
import classnames from 'classnames';
import moment from 'moment';
import SprintStartControl from '../../../../components/SprintStartControl';
import { IconDelete, IconEdit } from '../../../../components/Icons';

import roundNum from '../../../../utils/roundNum';

class Table extends React.Component {
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
      : ((moment(date).dayOfYear() - 1) / daysInYear * 100).toFixed(1) + '%';
  };

  calcRightPadding = (activeYear, daysInYear, date) => {
    return +moment(date).format('YYYY') !== +activeYear
      ? '0%'
      : (100 - moment(date).dayOfYear() / daysInYear * 100).toFixed(1) + '%';
  };

  calcTimelinePadding = date => {
    const { grantActiveYear } = this.props;
    const daysInYear = moment()
      .endOf('year')
      .dayOfYear();

    return date.getFullYear() !== grantActiveYear
      ? '0%'
      : ((moment(date).dayOfYear() - 1) / daysInYear * 100).toFixed(1) + '%';
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
    const { entities } = this.props;

    return (
      <div className={css.sprintNames}>
        {entities.map((entity, i) => {
          return this.detectType(entity) === 'sprint'
            ? this.renderSprintLabel(entity, i)
            : this.renderMilestoneLabel(entity, i);
        })}
      </div>
    );
  }

  renderSprintLabel(sprint, i) {
    const {
      typeHovered,
      typeIdHovered,
      onClickSprint,
      onMouseOverRow,
      onMouseOutRow,
      isProjectAdmin,
      openSprintEditModal,
      openMilestoneEditModal,
      isExternal,
      onDeleteMilestone
    } = this.props;

    return (
      <div
        key={`sprint-${i}`}
        className={classnames({
          [css.unactive]: sprint.statusId === 1,
          [css.active]: sprint.statusId === 2
        })}
      >
        <span
          className={classnames({
            [css.selection]: true,
            [css.hover]: typeHovered === 'sprint' && sprint.id === typeIdHovered
          })}
          /*data-tip={this.getSprintTime(sprint)}*/
          onClick={onClickSprint(sprint.id)}
          onMouseOver={onMouseOverRow('sprint', sprint.id)}
          onMouseOut={onMouseOutRow}
        />

        {isProjectAdmin ? <SprintStartControl sprint={sprint} /> : null}

        <div className={classnames(css.name, { [css.nameMargin]: isProjectAdmin })}>{sprint.name}</div>

        {!isExternal ? (
          <IconEdit className={css.edit} data-tip="Редактировать" onClick={openSprintEditModal(sprint)} />
        ) : null}
      </div>
    );
  }

  renderMilestoneLabel(milestone, i) {
    const {
      typeHovered,
      typeIdHovered,
      onClickSprint,
      onMouseOverRow,
      onMouseOutRow,
      isProjectAdmin,
      openSprintEditModal,
      openMilestoneEditModal,
      isExternal,
      onDeleteMilestone
    } = this.props;

    return (
      <div key={`milestone-${i}`}>
        <span
          className={classnames({
            [css.selection]: true,
            [css.hover]: typeHovered === 'milestone' && milestone.id === typeIdHovered
          })}
          data-tip={this.getMilestoneLabel(milestone)}
          onMouseOver={onMouseOverRow('milestone', milestone.id)}
          onMouseOut={onMouseOutRow}
        />

        <div className={classnames(css.name, { [css.nameMargin]: false })}>{milestone.name}</div>

        {!isExternal ? (
          <IconEdit className={css.edit} data-tip="Редактировать" onClick={openMilestoneEditModal(milestone)} />
        ) : null}
        {!isExternal ? (
          <IconDelete className={css.delete} data-tip="Удалить" onClick={onDeleteMilestone(milestone)} />
        ) : null}
      </div>
    );
  }

  renderPlanColumn() {
    const { entities, isExternal } = this.props;
    const className = classnames({
      [css.sprintNames]: true,
      [css.spentTime]: true
    });

    return (
      <div className={className}>
        <span className={css.header}>План</span>
        {entities.map((entity, i) => {
          return this.detectType(entity) === 'sprint' ? (
            <span key={`sprint-${i}`} className={css.name}>
              {!isExternal ? roundNum(entity.budget, 2) : ''}
            </span>
          ) : (
            <span key={`milestone-${i}`} className={css.name}>
              -
            </span>
          );
        })}
      </div>
    );
  }

  renderFactColumn() {
    const { entities, isExternal } = this.props;
    const className = classnames({
      [css.sprintNames]: true,
      [css.spentTime]: true
    });

    return (
      <div className={className}>
        <span className={css.header}>Факт</span>
        {entities.map((entity, i) => {
          return this.detectType(entity) === 'sprint' ? (
            <span key={`sprint-${i}`} className={css.name}>
              {!isExternal ? roundNum(entity.spentTime, 2) : ''}
            </span>
          ) : (
            <span key={`milestone-${i}`} className={css.name}>
              -
            </span>
          );
        })}
      </div>
    );
  }

  renderEntities() {
    const { entities, grantActiveYear } = this.props;

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
    const status = milestone.done ? 'Выполнено' : 'Не выполнено';
    const date = moment(milestone.date).format('DD.MM');
    return `${milestone.name}. ${date}. ${status}`;
  }

  renderMilestone(milestone, i) {
    const { grantActiveYear } = this.props;
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
          <div onClick={this.props.openMilestoneEditModal(milestone)} />
        </div>
      </div>
    );
  }

  render() {
    const {
      onMouseOverSprint,
      onClickSprint,
      openEditModal,
      grantActiveYear,
      grantYearDecrement,
      grantYearIncrement,
      isProjectAdmin
    } = this.props;

    const months = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь'
    ];

    return (
      <div className={css.graph}>
        <div className={css.wrapper}>
          {this.renderEntityLabels()}
          {this.renderPlanColumn()}
          {this.renderFactColumn()}

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

            <div className={css.grid}>
              {months.map((el, i) => (
                <span
                  key={`sprint-${i}`}
                  style={{ flex: moment(`${grantActiveYear}-${i + 1}`, 'YYYY-MM').daysInMonth() }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
