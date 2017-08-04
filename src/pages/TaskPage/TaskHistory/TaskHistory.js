import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import { getTaskHistory} from '../../../actions/Task';

import UserCard from '../../../components/UserCard';

const getMessage = (message, entities) => {
  if (Object.keys(entities).length === 0) {
    return message;
  } else {
    let result = message;
    Object.keys(entities).forEach(entity => {
      switch (entity) {
      case 'performer':
        result = result.replace(`{${entity}}`, entities[entity].fullNameRu);
        break;

      case 'linkedTask':
      case 'parentTask':
      case 'prevParentTask':
        result = result.replace(`{${entity}}`, entities[entity].task.name);
        break;

      case 'sprint':
      case 'prevSprint':
        result = result.replace(`{${entity}}`, entities[entity].name);
        break;

      case 'file':
        // реализовать потом
        break;

      default:
        break;
      }
    });
    return result;
  }
}


class TaskHistory extends React.Component {

  constructor (props) {
    super(props);
    this.state = {isUserCardVisible: false};
  }

  componentDidMount = () => {
    this.props.getTaskHistory(this.props.params.taskId);
  }

  showUserCard = id => {
    this.setState({isUserCardVisible: true, userId: id});
  }

  hideUserCard = () => {
    this.setState({isUserCardVisible: false});
  }

  render () {
    const css = require('./TaskHistory.scss');
    const eventList = this.props.history.map((event, i) => {
      return <div className={css.historyEvent} key={event.id}>
        <span className={css.time}> {moment(event.date).format('DD.MM.YYYY HH:mm:ss')}</span>
        <div className={css.historyAction}>
          <UserCard user={event.author}>
            <Link>{event.author.fullNameRu}</Link>
          </UserCard> {getMessage(event.message, event.entities)}
        </div>
      </div>;
    });

    return (
      <div className={css.history}>
        <h3>История изменений</h3>
        {eventList}
      </div>
    );
  }
}

TaskHistory.propTypes = {
  getTaskHistory: PropTypes.func.isRequired,
  history: PropTypes.array
};

const mapStateToProps = state => ({
  history: state.Task.task.history
});

const mapDispatchToProps = {
  getTaskHistory
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskHistory);
