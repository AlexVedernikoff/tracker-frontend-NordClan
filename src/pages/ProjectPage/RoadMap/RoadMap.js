import React, { Component } from 'react';

import Sprint from './Sprint';

const globalStart = '2018-10-20T00:00:00.000Z';
const globalEnd = '2018-11-30T00:00:00.000Z';

const mock = [
  {
    id: 1,
    name: 'Спринт 1',
    statusId: 1,
    factStartDate: '2018-11-20T00:00:00.000Z',
    factFinishDate: '2018-11-30T00:00:00.000Z',
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
          'Предполагается, что здесь будет обширный и подробный комментарий, который в дополнение к название, красиво опишет цель',
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
        removedFromSprint: 2,
        removedToSprint: null
      }
    ]
  }
];

class RoadMap extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const sprints = mock.map(sprint => <Sprint item={sprint} key={sprint.id} {...{ globalEnd, globalStart }} />);
    return <div>{sprints}</div>;
  }
}

export default RoadMap;
