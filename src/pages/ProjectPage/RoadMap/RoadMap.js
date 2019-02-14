import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import Sprint from './Sprint';
import Pagination from '../../../components/Pagination';

const globalStart = '2017-09-17T00:00:00.000Z';
const globalEnd = '2018-10-28T00:00:00.000Z';

const mock = [
  {
    id: 3,
    name: 'Спринт 3',
    statusId: 1,
    factStartDate: '2018-01-15T00:00:00.000Z',
    factFinishDate: '2019-10-28T00:00:00.000Z',
    budget: 360,
    riskBudget: 375,
    qaPercent: 30,
    goals: [
      {
        id: 1,
        name: 'Готовый виджет оповещений',
        done: false,
        visible: true,
        description:
          'Предполагается, что здесь будет обширный и подробный комментарий, который в дополнение к названию, красиво опишет цель',
        budget: null,
        tasksCount: 15,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 2,
        name: 'Готовая верстка внешних виджетов',
        done: false,
        visible: true,
        description: null,
        budget: 50,
        tasksCount: 136,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 3,
        name: 'Интегрированное управление потоком сообщений',
        done: false,
        visible: false,
        description: null,
        budget: null,
        tasksCount: null,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 4,
        name: 'Готовый виджет оповещений',
        done: false,
        visible: true,
        description: null,
        budget: 50,
        tasksCount: 15,
        removedFromSprint: { id: 2, name: 'Спринт 2' },
        removedToSprint: null
      }
    ]
  },
  {
    id: 2,
    name: 'Спринт 2',
    statusId: 1,
    factStartDate: '2019-02-01T00:00:00.000Z',
    factFinishDate: '2019-10-14T00:00:00.000Z',
    budget: 500,
    riskBudget: 600,
    qaPercent: 30,
    goals: [
      {
        id: 1,
        name: 'Готовый виджет оповещений',
        done: false,
        visible: true,
        description:
          'Предполагается, что здесь будет обширный и подробный комментарий, который в дополнение к названию, красиво опишет цель',
        budget: null,
        tasksCount: 15,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 2,
        name: 'Готовая верстка внешних виджетов',
        done: true,
        visible: true,
        description: null,
        budget: 50,
        tasksCount: 10,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 3,
        name: 'Интегрированное управление потоком сообщений',
        done: true,
        visible: false,
        description: null,
        budget: null,
        tasksCount: null,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 4,
        name: 'Готовый виджет оповещений',
        done: false,
        visible: true,
        description: null,
        budget: 50,
        tasksCount: 15,
        removedFromSprint: null,
        removedToSprint: { id: 3, name: 'Спринт 3' }
      }
    ]
  },
  {
    id: 1,
    name: 'Спринт 1',
    statusId: 1,
    factStartDate: '2018-09-17T00:00:00.000Z',
    factFinishDate: '2018-09-30T00:00:00.000Z',
    budget: 36,
    riskBudget: 50,
    qaPercent: 30,
    goals: [
      {
        id: 1,
        name: 'Готовая верстка внешних виджетов',
        done: true,
        visible: true,
        description: null,
        budget: 50,
        tasksCount: 0,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 2,
        name: 'Интегрированное управление потоком сообщений',
        done: true,
        visible: false,
        description: null,
        budget: null,
        tasksCount: 21,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 3,
        name: 'Готовая верстка внешних виджетов',
        done: true,
        visible: true,
        description: null,
        budget: 50,
        tasksCount: 10,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 4,
        name: 'Интегрированное управление потоком сообщений',
        done: false,
        visible: false,
        description: null,
        budget: 0,
        tasksCount: 0,
        removedFromSprint: null,
        removedToSprint: null
      }
    ]
  },
  {
    id: 4,
    name: 'Спринт 4',
    statusId: 1,
    factStartDate: '2018-11-17T00:00:00.000Z',
    factFinishDate: '2019-09-30T00:00:00.000Z',
    budget: 36,
    riskBudget: 50,
    qaPercent: 30,
    goals: [
      {
        id: 1,
        name: 'Готовая верстка внешних виджетов',
        done: true,
        visible: true,
        description: null,
        budget: 50,
        tasksCount: 0,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 2,
        name: 'Интегрированное управление потоком сообщений',
        done: true,
        visible: false,
        description: null,
        budget: null,
        tasksCount: 21,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 3,
        name: 'Готовая верстка внешних виджетов',
        done: true,
        visible: true,
        description: null,
        budget: 50,
        tasksCount: 10,
        removedFromSprint: null,
        removedToSprint: null
      },
      {
        id: 4,
        name: 'Интегрированное управление потоком сообщений',
        done: false,
        visible: false,
        description: null,
        budget: 0,
        tasksCount: 0,
        removedFromSprint: null,
        removedToSprint: null
      }
    ]
  }
];

class RoadMap extends Component {
  static propTypes = {
    project: PropTypes.object,
    sprints: PropTypes.array.isRequired
  };

  state = {
    activePage: new Date().getFullYear()
  };

  handlePaginationClick = ({ activePage }) => this.setState({ activePage });

  filteredByYear = date => +moment(date).format('YYYY') === this.state.activePage;

  render() {
    const { activePage } = this.state;
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
            <Sprint item={sprint} key={sprint.id} {...rangeTimeline} />
          ))}
        <Pagination
          itemsCount={completedYear - createdYear}
          from={createdYear}
          to={completedYear}
          activePage={activePage}
          onItemClick={this.handlePaginationClick}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sprints: state.Project.project.sprints,
  project: state.Project.project
});

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoadMap);
