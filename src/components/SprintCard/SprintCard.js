import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { deleteSprint, editSprint } from '../../actions/Sprint';
import moment from 'moment';
import SprintEditModal from '../../components/SprintEditModal';

import { IconClose } from '../Icons';
import * as css from './SprintCard.scss';
import SprintStartControl from '../SprintStartControl';


class SprintCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isHovered: false
    };
  }

  handleOpenModal = () => {
    this.setState({
      isModalOpen: true
    });
  };

  handleEditSprint = (sprint) => {
    this.setState({ isModalOpen: false });
    this.props.editSprint(
      sprint.id,
      null,
      sprint.sprintName.trim(),
      sprint.dateFrom,
      sprint.dateTo,
      sprint.allottedTime
    );
  };

  closeEditSprintModal = () => {
    this.setState({
      isModalOpen: false
    });
  };

  render () {
    const { sprint, deleteSprint: dS, editSprint, inFocus, ...other } = this.props;

    return (
      <div
        className={classnames({
          [css.sprintCard]: true,
          [css[sprint.status]]: true,
          [css.INFOCUS]: inFocus
        })}
        {...other}
      >
        <IconClose
          className={css.iconClose}
          onClick={() => {dS(sprint.id);}}
        />
        <p className={css.sprintTitle}
           onClick={this.handleOpenModal}>
          {sprint.name}
        </p>
        <p className={css.sprintMeta}>
          <span>Дата начала:</span>
        <span>
          {moment(sprint.factStartDate).format('DD.MM.YYYY')}
        </span>
        </p>
        {sprint.factFinishDate
          ? <p className={css.sprintMeta}>
          <span>Дата окончания:</span>
            <span>
              {moment(sprint.factFinishDate).format('DD.MM.YYYY')}
            </span>
        </p>
          : null}

        <p className={css.sprintMeta}>
          <span>Всего задач:</span>
        <span>
          {sprint.countAllTasks || 0}
        </span>
        </p>
        <p className={css.sprintMeta}>
          <span>Выполнено:</span>
        <span>
          {sprint.countDoneTasks || 0}
        </span>
        </p>
        <p className={css.sprintMeta}>
          <span>Выделенное время: {sprint.allottedTime || 0} ч.</span>
        </p>
        <p className={css.sprintMeta}>
          <span>Израсходованное время: {sprint.spentTime || 0} ч.</span>
        </p>
        <div
          className={css.status}
        >
          <SprintStartControl sprint={sprint} />
        </div>
        {this.state.isModalOpen ? <SprintEditModal sprint={this.props.sprint} handleEditSprint={this.handleEditSprint} handleCloseModal={this.closeEditSprintModal}/> : null}
      </div>
    );
  }
}

SprintCard.propTypes = {
  deleteSprint: PropTypes.func.isRequired,
  editSprint: PropTypes.func.isRequired,
  inFocus: PropTypes.bool,
  sprint: PropTypes.object
};

SprintCard.defaultProps = {
  inFocus: false,
  sprint: {
    name: 'Название спринта',
    countAllTasks: '00',
    countDoneTasks: '00',
    tasksTotal: '00',
    tasksDone: '00',
    allottedTime: '00',
    spentTime: '00',
    status: 'INPROGRESS',
  }
};

const mapDispatchToProps = {
  deleteSprint,
  editSprint
};

export default connect(null, mapDispatchToProps)(SprintCard);
