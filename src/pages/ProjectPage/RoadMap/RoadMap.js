import React, { Component } from 'react';
import { connect } from 'react-redux';
import { create, edit, remove, transfer, getGoalsByProject } from '../../../actions/Goals';
import { getProjectInfo, openCreateTaskModal } from '../../../actions/Project';
import PropTypes from 'prop-types';
import moment from 'moment';
import Sprint from './Sprint';
import CreateTaskModal from '../../../components/CreateTaskModal';
import Pagination from '../../../components/Pagination';
import Task from './Task';

class RoadMap extends Component {
  static propTypes = {
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
    isSuccessAddGoal: null,
    goalId: null
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
              remove={this.props.remove}
              openCreateTaskModal={this.openCreateTaskModal}
              transfer={this.transfer}
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
  transfer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoadMap);
