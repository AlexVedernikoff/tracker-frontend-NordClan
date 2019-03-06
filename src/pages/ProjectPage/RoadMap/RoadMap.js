import React, { Component } from 'react';
import { connect } from 'react-redux';
import { create, edit, getGoalsByProject } from '../../../actions/Goals';
import { getProjectInfo } from '../../../actions/Project';
import PropTypes from 'prop-types';
import moment from 'moment';
import Sprint from './Sprint';
import Pagination from '../../../components/Pagination';
import Task from './Task';

class RoadMap extends Component {
  static propTypes = {
    isSuccessAddGoal: PropTypes.bool,
    lang: PropTypes.string,
    modifyGoalId: PropTypes.number,
    project: PropTypes.object,
    sprints: PropTypes.array.isRequired
  };

  state = {
    activePage: new Date().getFullYear(),
    isSuccessAddGoal: false
  };

  componentWillReceiveProps(nextProps) {
    const { isSuccessAddGoal } = nextProps;
    this.setState({ isSuccessAddGoal });
  }

  handlePaginationClick = ({ activePage }) => this.setState({ activePage });

  filteredByYear = date => +moment(date).format('YYYY') === this.state.activePage;

  render() {
    const { activePage, isSuccessAddGoal } = this.state;
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
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
  getProjectInfo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoadMap);
