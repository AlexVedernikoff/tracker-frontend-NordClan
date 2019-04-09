import React, { Component } from 'react';
import { connect } from 'react-redux';
import { create, edit, remove, transfer, getGoalsByProject, toggleVisible, toggleStatus } from '../../../actions/Goals';
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
import { minBy, maxBy, isEqual } from 'lodash';

class RoadMap extends Component {
  static propTypes = {
    editSprint: PropTypes.func,
    isCreateTaskModalOpen: PropTypes.bool,
    isSuccessAddGoal: PropTypes.bool,
    lang: PropTypes.string,
    project: PropTypes.object,
    sprints: PropTypes.array.isRequired,
    toggleStatus: PropTypes.func,
    toggleVisible: PropTypes.func,
    transfer: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      activePage: new Date().getFullYear(),
      isConfirmDeleteGoal: false,
      isSuccessAddGoal: null,
      isOpenSprintEditModal: false,
      goalId: null,
      sprint: {}
    };
  }

  componentDidMount() {
    if (this.props.sprints.length) {
      this.getYearsBasedOnSprints(this.props.sprints);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isSuccessAddGoal } = nextProps;
    this.setState({ isSuccessAddGoal });
    if (!isEqual(nextProps.sprints, this.props.sprints)) {
      this.getYearsBasedOnSprints(nextProps.sprints);
    }
  }

  handlePaginationClick = ({ activePage }) => this.setState({ activePage });

  filteredByYear = date => {
    return +moment(date).format('YYYY') === this.state.activePage;
  };

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

  toggleVisible = (id, visible) => this.props.toggleVisible(id, visible, this.props.project.id);

  toggleStatus = (id, status) => this.props.toggleStatus(id, status, this.props.project.id);

  getYearsBasedOnSprints = sprints => {
    try {
      const getYear = key => sprint => {
        return new Date(sprint[key]).getFullYear();
      };
      const min = minBy(sprints, getYear('factStartDate'));
      const max = maxBy(sprints, getYear('factFinishDate'));
      const createdYear = min && new Date(min.factStartDate).getFullYear();
      const completedYear = max && new Date(max.factFinishDate).getFullYear();
      this.setState({
        createdYear,
        completedYear,
        activePage: createdYear !== completedYear ? this.state.activePage : null
      });
    } catch (e) {
      this.setState({
        createdYear: 0,
        completedYear: 0,
        activePage: null
      });
    }
  };

  render() {
    const { activePage, isSuccessAddGoal, sprintId, goalId, createdYear, completedYear } = this.state;
    const { lang, sprints } = this.props;
    const rangeTimeline = { globalStart: activePage, globalEnd: activePage };
    let _sprints = sprints;
    if (activePage !== null) {
      _sprints = _sprints.filter(
        sprint => this.filteredByYear(sprint.factStartDate) || this.filteredByYear(sprint.factFinishDate)
      );
    }
    return (
      <div>
        {_sprints.map(sprint => (
          <Sprint
            isSuccessAddGoal={isSuccessAddGoal}
            key={sprint.id}
            item={sprint}
            lang={lang}
            create={this.props.create}
            edit={this.props.edit}
            remove={this.handleSetRemoveGoal}
            openCreateTaskModal={this.openCreateTaskModal}
            transfer={this.transfer}
            editSprint={this.editSprint}
            toggleVisible={this.toggleVisible}
            toggleStatus={this.toggleStatus}
            {...rangeTimeline}
          />
        ))}
        {createdYear !== completedYear && (
          <Pagination
            itemsCount={completedYear - createdYear}
            from={createdYear}
            to={completedYear}
            activePage={activePage}
            onItemClick={this.handlePaginationClick}
          />
        )}
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
  isSuccessAddGoal: state.Goals.isSuccess
});

const mapDispatchToProps = {
  create,
  edit,
  getGoalsByProject,
  getProjectInfo,
  remove,
  openCreateTaskModal,
  transfer,
  editSprint,
  toggleVisible,
  toggleStatus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoadMap);
