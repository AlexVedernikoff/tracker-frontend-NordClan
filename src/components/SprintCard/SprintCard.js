import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { deleteSprint, editSprint } from '../../actions/Sprint';
import moment from 'moment';
import SprintEditModal from '../../components/SprintEditModal';
import { formatCurrency } from '../../utils/Currency';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

import { IconClose } from '../Icons';
import * as css from './SprintCard.scss';
import SprintStartControl from '../SprintStartControl';


class SprintCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isConfirmDeleteModalOpen: false,
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
      sprint.allottedTime,
      sprint.budget,
      sprint.riskBudget
    );
  };

  closeEditSprintModal = () => {
    this.setState({
      isModalOpen: false
    });
  };

  openConfirmDeleteModal = () => {
    this.setState({
      isConfirmDeleteModalOpen: true
    });
  };

  handleDeleteSprint = () => {
    const { sprint, deleteSprint } = this.props;
    this.setState({
      isConfirmDeleteModalOpen: true
    }, this.props.deleteSprint(sprint.id));
  };

  closeConfirmDeleteModal = () => {
    this.setState({
      isConfirmDeleteModalOpen: false
    });
  };

  render () {
    const { sprint, editSprint, inFocus, ...other } = this.props;

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
          onClick={this.openConfirmDeleteModal}
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
        <p className={css.sprintMeta}>
          <span>Бюджет без рискового резерва: {formatCurrency(sprint.budget)}</span>
        </p>
        <p className={css.sprintMeta}>
          <span>Бюджет с рисковым резервом: {formatCurrency(sprint.riskBudget)}</span>
        </p>
        <div
          className={css.status}
        >
          <SprintStartControl sprint={sprint} />
        </div>
        {this.state.isModalOpen
        ? <SprintEditModal sprint={this.props.sprint} handleEditSprint={this.handleEditSprint} handleCloseModal={this.closeEditSprintModal}/>
        : null}
        {
          this.state.isConfirmDeleteModalOpen
            ? <ConfirmModal
              isOpen
              contentLabel="modal"
              text="Вы действительно удалить спринт?"
              onCancel={this.closeConfirmDeleteModal}
              onConfirm={this.handleDeleteSprint}
            />
          : null
        }
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
    budget: 0,
    riskBudget: 0
  }
};

const mapDispatchToProps = {
  deleteSprint,
  editSprint
};

export default connect(null, mapDispatchToProps)(SprintCard);
