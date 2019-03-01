import React, { Component } from 'react';
import { connect } from 'react-redux';
import { create, edit, remove, transfer, getGoalsByProject } from '../../../actions/Goals';
import { getProjectInfo, openCreateTaskModal } from '../../../actions/Project';
import { editSprint } from '../../../actions/Sprint';
import PropTypes from 'prop-types';
import moment from 'moment';
import Sprint from './Sprint';
import CreateTaskModal from '../../../components/CreateTaskModal';
import Pagination from '../../../components/Pagination';
import ConfirmModal from '../../../components/ConfirmModal';
import SprintEditModal from '../../../components/SprintEditModal';
import Task from './Task';
import localize from './RoadMap.json';

class RoadMap extends Component {
  static propTypes = {
    editSprint: PropTypes.func,
    isCreateTaskModalOpen: PropTypes.bool,
    isSuccessAddGoal: PropTypes.bool,
    lang: PropTypes.string,
    modifyGoalId: PropTypes.number,
    project: PropTypes.object,
    sprints: PropTypes.array.isRequired,
    transfer: PropTypes.func
  };

  state = {
    activePage: new Date().getFullYear(),
    isConfirmDeleteGoal: false,
    isSuccessAddGoal: null,
    isOpenSprintEditModal: false,
    goalId: null,
    sprint: {}
  };

  componentWillReceiveProps(nextProps) {
    const { isSuccessAddGoal } = nextProps;
    this.setState({ isSuccessAddGoal });
  }

  handlePaginationClick = ({ activePage }) => this.setState({ activePage });

  filteredByYear = date => +moment(date).format('YYYY') === this.state.activePage;

  openCreateTaskModal = ({ goalId, sprintId }) => {
    this.setState({ sprintId, goalId }, this.props.openCreateTaskModal);
  };

  transfer = (goalId, createdAt) => {
    const {
      sprints,
      project: { id: projectId }
    } = this.props;
    const replaceTo = sprints.filter(sprint => moment(sprint.createdAt).isAfter(createdAt))[0];
    if (replaceTo) {
      this.props.transfer(goalId, replaceTo.id, projectId);
    }
  };

  handleSetRemoveGoal = goalId => this.setState({ goalId, isConfirmDeleteGoal: true });

  handleRemoveGoal = () => {
    this.setState({ isConfirmDeleteGoal: false });
    this.props.remove(this.state.goalId, this.props.project.id);
  };

  editSprint = sprint => {
    this.editSprint.data = sprint;
    this.setState({ isOpenSprintEditModal: true });
  };

  handleEditSprint = sprint => {
    this.setState({ isOpenSprintEditModal: false });
    console.log('handleEditSprint');
    this.props.editSprint(
      sprint.id,
      null,
      sprint.sprintName.trim(),
      sprint.dateFrom,
      sprint.dateTo,
      sprint.budget,
      sprint.riskBudget,
      sprint.qaPercent
    );
  };

  render() {
    const { activePage, isSuccessAddGoal, sprintId, goalId } = this.state;
    const {
      lang,
      sprints,
      project: { createdAt, completedAt },
      modifyGoalId
    } = this.props;
    const createdYear = +moment(createdAt).format('YYYY');
    const completedYear = +moment(completedAt || new Date()).format('YYYY');
    const rangeTimeline = { globalStart: activePage, globalEnd: activePage };
    return (
      <div>
        {sprints
          .filter(sprint => this.filteredByYear(sprint.factStartDate) || this.filteredByYear(sprint.factFinishDate))
          .map(sprint => (
            <Sprint
              isSuccessAddGoal={isSuccessAddGoal}
              key={sprint.id}
              item={sprint}
              lang={lang}
              modifyGoalId={modifyGoalId}
              create={this.props.create}
              edit={this.props.edit}
              remove={this.handleSetRemoveGoal}
              openCreateTaskModal={this.openCreateTaskModal}
              transfer={this.transfer}
              editSprint={this.editSprint}
              {...rangeTimeline}
            />
          ))}
        <Pagination
          itemsCount={completedYear - createdYear}
          from={createdYear}
          to={completedYear}
          activePage={activePage}
          onItemClick={this.handlePaginationClick}
        />
        <Task />
        {goalId && this.props.isCreateTaskModalOpen ? (
          <CreateTaskModal selectedSprintValue={sprintId} project={this.props.project} goalId={goalId} />
        ) : null}
        {this.state.isOpenSprintEditModal ? (
          <SprintEditModal
            project={this.props.project}
            sprint={this.editSprint.data}
            handleEditSprint={this.handleEditSprint}
            handleCloseModal={() => this.setState({ isOpenSprintEditModal: false })}
          />
        ) : null}
        {this.state.isConfirmDeleteGoal ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={localize[this.props.lang].CONFIRM_DELETE}
            onCancel={() => this.setState({ isConfirmDeleteGoal: false })}
            onConfirm={this.handleRemoveGoal}
            onRequestClose={() => this.setState({ isConfirmDeleteGoal: false })}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  lang: state.Localize.lang,
  sprints: state.Project.project.sprints,
  project: state.Project.project,
  isSuccessAddGoal: state.Goals.isSuccess,
  modifyGoalId: state.Goals.modifyId
});

const mapDispatchToProps = {
  create,
  edit,
  getGoalsByProject,
  getProjectInfo,
  remove,
  openCreateTaskModal,
  transfer,
  editSprint
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoadMap);
