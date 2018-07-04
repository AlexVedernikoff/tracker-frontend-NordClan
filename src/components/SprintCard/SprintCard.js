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
import localize from './SprintCard.json';

class SprintCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isConfirmDeleteModalOpen: false,
      isHovered: false
    };
  }

  handleOpenModal = () => {
    if (this.props.isExternal) return;
    this.setState({
      isModalOpen: true
    });
  };

  handleEditSprint = sprint => {
    this.setState({ isModalOpen: false });
    this.props.editSprint(
      sprint.id,
      null,
      sprint.sprintName.trim(),
      sprint.dateFrom,
      sprint.dateTo,
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
    const { sprint } = this.props;
    this.setState(
      {
        isConfirmDeleteModalOpen: false
      },
      this.props.deleteSprint(sprint.id)
    );
  };

  closeConfirmDeleteModal = () => {
    this.setState({
      isConfirmDeleteModalOpen: false
    });
  };

  render() {
    const { sprint, editSprint, deleteSprint, inFocus, isExternal, lang, ...other } = this.props;

    return (
      <div
        className={classnames({
          [css.sprintCard]: true,
          [css[sprint.status]]: true,
          [css.INFOCUS]: inFocus
        })}
        {...other}
      >
        {!isExternal ? <IconClose className={css.iconClose} onClick={this.openConfirmDeleteModal} /> : null}
        <p className={css.sprintTitle} onClick={this.handleOpenModal}>
          {sprint.name}
        </p>
        <p className={css.sprintMeta}>
          <span>{localize[lang].DATE_OF_START}</span>
          <span>{moment(sprint.factStartDate).format('DD.MM.YYYY')}</span>
        </p>
        {sprint.factFinishDate ? (
          <p className={css.sprintMeta}>
            <span>{localize[lang].DATE_OF_END}</span>
            <span>{moment(sprint.factFinishDate).format('DD.MM.YYYY')}</span>
          </p>
        ) : null}

        <p className={css.sprintMeta}>
          <span>{localize[lang].TOTAL_TASKS}</span>
          <span>{sprint.countAllTasks || 0}</span>
        </p>
        <p className={css.sprintMeta}>
          <span>{localize[lang].DONE}</span>
          <span>{sprint.countDoneTasks || 0}</span>
        </p>
        {!isExternal
          ? [
              <p key="spentTime" className={css.sprintMeta}>
                <span>
                  {localize[lang].SPENT_TIME} {sprint.spentTime || 0} ч.
                </span>
              </p>,
              <p key="budget" className={css.sprintMeta}>
                <span>
                  {localize[lang].WO_RISK_RESERVE} {formatCurrency(sprint.budget)}
                </span>
              </p>,
              <p key="riskBudget" className={css.sprintMeta}>
                <span>
                  {localize[lang].WITH_RISK_RESERVE} {formatCurrency(sprint.riskBudget)}
                </span>
              </p>
            ]
          : null}
        {!isExternal ? (
          <div className={css.status}>
            <SprintStartControl sprint={sprint} />
          </div>
        ) : null}
        {this.state.isModalOpen ? (
          <SprintEditModal
            sprint={this.props.sprint}
            handleEditSprint={this.handleEditSprint}
            handleCloseModal={this.closeEditSprintModal}
          />
        ) : null}
        {this.state.isConfirmDeleteModalOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={localize[lang].REMOVE_SPRINT_NOTIFICATION}
            onCancel={this.closeConfirmDeleteModal}
            onConfirm={this.handleDeleteSprint}
          />
        ) : null}
      </div>
    );
  }
}

SprintCard.propTypes = {
  deleteSprint: PropTypes.func.isRequired,
  editSprint: PropTypes.func.isRequired,
  inFocus: PropTypes.bool,
  isExternal: PropTypes.bool,
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
    spentTime: '00',
    status: 'INPROGRESS',
    budget: 0,
    riskBudget: 0
  }
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  deleteSprint,
  editSprint
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SprintCard);
