import React from 'react';
import * as css from './../Planning.scss';
import classnames from 'classnames';
import moment from 'moment';
import SprintStartControl from '../../../../components/SprintStartControl';
import { IconEdit } from '../../../../components/Icons';

class Table extends React.Component {

  getSprintBlock = (sprint, activeYear) => {
    const {factStartDate: start, factFinishDate: end} = sprint;
    const daysInYear = moment().endOf('year').dayOfYear();

    return {
      left: this.calcLeftPadding(activeYear, daysInYear, start),
      right: this.calcRightPadding(activeYear, daysInYear, end),
      zIndex: 1
    };
  };

  getMilestoneBlock = (date, activeYear) => {
    const daysInYear = moment().endOf('year').dayOfYear();

    return {
      left: this.calcLeftPadding(activeYear, daysInYear, date),
      right: this.calcRightPadding(activeYear, daysInYear, date),
      zIndex: 1
    };
  };

  calcLeftPadding = (activeYear, daysInYear, date) => {
    return (+moment(date).format('YYYY') !== +activeYear)
      ? '0%'
      : ((moment(date).dayOfYear() - 1) / daysInYear * 100).toFixed(1) + '%';
  };

  calcRightPadding = (activeYear, daysInYear, date) => {
    return (+moment(date).format('YYYY') !== +activeYear)
      ? '0%'
      : (100 - (moment(date).dayOfYear() / daysInYear * 100)).toFixed(1) + '%';
  };


  calcTimelinePadding = (date) => {
    const { grantActiveYear } = this.props;
    const daysInYear = moment().endOf('year').dayOfYear();

    return (date.getFullYear() !== grantActiveYear)
      ? '0%'
      : ((moment(date).dayOfYear() - 1) / daysInYear * 100).toFixed(1) + '%';
  };

  getSprintTime = sprint => {
    return `${moment(sprint.factStartDate).format('DD.MM')} ${sprint.factFinishDate ? `- ${moment(sprint.factFinishDate).format('DD.MM')}` : '- ...'}`;
  }

  currentTimeline = () => {
    const { grantActiveYear } = this.props;
    const date = new Date();

    if (date.getFullYear() === grantActiveYear) {
      return (
        <div className={css.timeline}
          style={{left: this.calcTimelinePadding(date)}}
          data-tip={moment(date).format('DD.MM')}
        />
      );
    }
  };

  renderSprintNameColumn() {
    const {
      sprints,
      onClickSprint,
      onMouseOverSprint,
      sprintIdHovered,
      isProjectAdmin,
      openSprintEditModal,
      openMilestoneEditModal,
      milestones
    } = this.props;

    return <div className={css.sprintNames}>
      <div />
      <div />
      {sprints.map((sprint, i) => {
        return <div key={`sprint-${i}`}>
          <span
            className={classnames({
              [css.selection]: true,
              [css.hover]: sprint.id === sprintIdHovered
            })}
            data-tip={this.getSprintTime(sprint)}
            onClick={onClickSprint(sprint.id)}
            onMouseOver={onMouseOverSprint(sprint.id)}
            onMouseOut={this.onMouseOutSprint}
          />

        {isProjectAdmin
          ? <SprintStartControl sprint={sprint}/>
          : null}

          <div className={classnames(css.name, { [css.nameMargin]: isProjectAdmin })}>
            {sprint.name}
          </div>

          <IconEdit
            className={css.edit}
            data-tip="Редактировать"
            onClick={openSprintEditModal(sprint)}
          />
        </div>
      })}
      {milestones.map((milestone, i) => {
        return <div key={`milestone-${i}`}>
          <div className={classnames(css.name, { [css.nameMargin]: false })}>
            {milestone.name}
          </div>

          <IconEdit
            className={css.edit}
            data-tip="Редактировать"
            onClick={openMilestoneEditModal(milestone)}
          />
        </div>
      })}

    </div>
  }

  renderPlanColumn() {
    const { sprints, milestones } = this.props;
    const className = classnames({
      [css.sprintNames]: true,
      [css.spentTime]: true
    })

    return <div className={className}>
      <span className={css.header}>План</span>
      {sprints.map((sprint, i) =>
        <span key={`sprint-${i}`} className={css.name}>{sprint.allottedTime}</span>
      )}
      {milestones.map((milestone, i) =>
        <span key={`milestone-${i}`} className={css.name}>-</span>
      )}
    </div>
  }

  renderFactColumn() {
    const { sprints, milestones } = this.props;
    const className = classnames({
      [css.sprintNames]: true,
      [css.spentTime]: true
    })

    return <div className={className}>
      <span className={css.header}>Факт</span>
      {sprints.map((sprint, i) =>
        <span key={`sprint-${i}`} className={css.name}>{sprint.spentTime}</span>
      )}
      {milestones.map((milestone, i) =>
        <span key={`milestone-${i}`} className={css.name}>-</span>
      )}
    </div>
  }

  renderSprints() {
    const { sprints, grantActiveYear } = this.props;

    return sprints.map((sprint, i) => {
      return <div key={`sprint-${i}`} className={css.tr}>
        <div
          className={classnames({
            [css.sprintBar]: true,
            [css.unactive]: sprint.statusId === 1 && moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]'),
            [css.finished]: moment(sprint.factFinishDate).isBefore(moment(), 'days'),
            [css.active]: sprint.statusId === 2,
            [css.future]: moment(sprint.factStartDate).isAfter(moment(), 'days')
          })}
          style={this.getSprintBlock(sprint, grantActiveYear)}
          data-tip={this.getSprintTime(sprint)}
        >
          <div className={css.text}>{sprint.spentTime || 0}</div>
          <div className={css.text}>{sprint.allottedTime || 0}</div>
        </div>
      </div>;
    })
  }

  renderMilestones() {
    const { milestones, grantActiveYear } = this.props;

    return milestones.map((milestone, i) => {
      const status = milestone.done ? 'Выполнено' : 'Не выполнено';
      const date = moment(milestone.date).format('YYYY-MM-DD');
      const label = `${milestone.name}. ${date}. ${status}`;
      return <div key={`milestone-${i}`} className={css.tr}>
        <div
          className={classnames({
            [css.sprintBar]: true,
            [css.active]: true,
            [css.future]: milestone.done
          })}
          style={this.getMilestoneBlock(milestone.date, grantActiveYear)}
          data-tip={label}
        >
        </div>
      </div>
    })
  }

  render() {
    const {
      sprints,
      sprintIdHovered,
      onMouseOverSprint,
      onClickSprint,
      openEditModal,
      grantActiveYear,
      grantYearDecrement,
      grantYearIncrement,
      isProjectAdmin
    } = this.props;

    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    return <div className={css.graph}>
      <div className={css.wrapper}>
        {this.renderSprintNameColumn()}
        {this.renderPlanColumn()}
        {this.renderFactColumn()}

        <div className={css.table}>
          <div className={css.tr}>
            <div className={css.year}>
              <span className={css.arrow} onClick={grantYearDecrement}>&larr;</span>
              <span>{grantActiveYear}</span>
              <span className={css.arrow} onClick={grantYearIncrement}>&rarr;</span>
            </div>
          </div>
      <div className={css.tr}>
        <div className={css.nameHeader} />
        {
          months.map((month, i) => (
            <div
              key={`sprint-${month}`}
              className={css.month}
              style={{flex: moment(`${grantActiveYear}-${i + 1}`, 'YYYY-MM').daysInMonth()}}
            >
              {month}
            </div>
          ))
        }
      </div>
      {this.currentTimeline()}
      {this.renderSprints()}
      {this.renderMilestones()}
      {/*this.renderMilestoneTimelines()*/}

      <div className={css.grid}>
        {
          months.map((el, i) => (
            <span
              key={`sprint-${i}`}
              style={{flex: moment(`${grantActiveYear}-${i + 1}`, 'YYYY-MM').daysInMonth()}}/>
          ))
        }
      </div>
    </div>
  </div>
</div>
  }
}

export default Table;
