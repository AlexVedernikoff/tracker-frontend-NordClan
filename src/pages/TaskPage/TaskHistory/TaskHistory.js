import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import UserCard from '../../../components/UserCard';

// Mocks

const data = [
  {
    user: 'Анастасия Горшкова',
    userId: 1,
    event: 'has edit name status from On Track to Off Track.',
    time: '17.02.2017 13:15'
  },
  {
    user: 'Анастасия Горшкова',
    userId: 1,
    event: 'has edit name status from Proposed to On Track.',
    time: '17.02.2017 13:15'
  },
  {
    user: 'Максим Слепухов',
    userId: 2,
    event: 'has edit priority of issue from 3 to 3.',
    time: '17.02.2017 13:15'
  },
  {
    user: 'Анастасия Горшкова',
    userId: 1,
    event: 'has edit name status from On Track to Proposed.',
    time: '17.02.2017 13:15'
  },
  {
    user: 'Анастасия Горшкова',
    userId: 1,
    event: 'has edit name status from Proposed to On Track.',
    time: '17.02.2017 13:15'
  },
  {
    user: 'Виктор Сычев',
    userId: 3,
    event: 'has posted task to Фаза проекта Этап 10.',
    time: '17.02.2017 13:15'
  },
  {
    user: 'Виктор Сычев',
    userId: 3,
    event: 'has add task.',
    time: '17.02.2017 13:15'
  }
];

export default class TaskHistory extends React.Component {

  constructor (props) {
    super(props);
    this.state = {isUserCardVisible: false};
  }

  showUserCard = (id) => {
    this.setState({isUserCardVisible: true, userId: id});
  }

  hideUserCard = () => {
    this.setState({isUserCardVisible: false});
  }

  render () {
    const css = require('./TaskHistory.scss');
    const eventList = data.map((element, i) => {
      return <div className={css.historyEvent} key={i}>
        <span className={css.time}>{element.time}</span>
        <div className={css.historyAction}>
          <Link onClick={() => this.showUserCard(element.userId)} onBlur={() => this.hideUserCard()}>{element.user}</Link> {element.event}
        </div>
      </div>;
    });

    return (
      <div className={css.history}>
        <h3>История изменений</h3>
        {eventList}
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            this.state.isUserCardVisible
            ? <UserCard id={this.state.userId}/>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

TaskHistory.propTypes = {
  task: PropTypes.object
};
