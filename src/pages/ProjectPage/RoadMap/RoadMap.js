import React, { Component } from 'react';
import { connect } from 'react-redux';
import { create } from '../../../actions/Goals';
import PropTypes from 'prop-types';
import moment from 'moment';
import Sprint from './Sprint';
import Pagination from '../../../components/Pagination';
import Task from './Task';

class RoadMap extends Component {
  static propTypes = {
    project: PropTypes.object,
    sprints: PropTypes.array.isRequired
  };

  state = {
    activePage: new Date().getFullYear(),
    isErrorCreateGoal: null
  };

  componentWillReceiveProps(nextProps) {
    const { isErrorCreateGoal = null } = nextProps;
    console.log('componentWillReceiveProps', nextProps);
    this.setState({ isErrorCreateGoal });
  }

  handlePaginationClick = ({ activePage }) => this.setState({ activePage });

  filteredByYear = date => +moment(date).format('YYYY') === this.state.activePage;

  render() {
    const { activePage, isErrorCreateGoal } = this.state;
    const {
      sprints,
      project: { createdAt, completedAt }
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
              key={sprint.id}
              item={sprint}
              create={this.props.create}
              {...rangeTimeline}
              isErrorCreateGoal={isErrorCreateGoal}
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
  sprints: state.Project.project.sprints,
  project: state.Project.project
});

const mapDispatchToProps = {
  create
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoadMap);
