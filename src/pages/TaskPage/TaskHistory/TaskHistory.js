import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import { getTaskHistory} from '../../../actions/Task';

import UserCard from '../../../components/UserCard';

const getMessage = (message, entities, projectId) => {
  if (Object.keys(entities).length === 0) {
    return message;
  } else {
    const stringsArray = message.split(/[{}]/);
    stringsArray.pop();

    return stringsArray.map((string, i) => {
      if (i % 2 === 0) {
        return <span>{string}</span>;
      } else {
        switch (string) {
        case 'prevPerformer':
        case 'performer':
          return <UserCard user={entities[string]}>
                   <Link>{entities[string].fullNameRu}</Link>
                 </UserCard>;
        case 'linkedTask':
        case 'parentTask':
        case 'prevParentTask':
          return <Link to={`/projects/${projectId}/tasks/${entities[string].task.id}`}>
                  {entities[string].task.name}
                 </Link>;
        case 'sprint':
        case 'prevSprint':
          return <Link to={`/projects/${projectId}/sprint${entities[string].id}/tasks`}>
                  {entities[string].name}
                </Link>;
        case 'file':
          // реализовать потом
          break;

        default:
          break;
        }
      }
    });
  }
};


class TaskHistory extends React.Component {

  constructor (props) {
    super(props);
    this.state = {isUserCardVisible: false};
  }

  componentDidMount = () => {
    this.props.getTaskHistory(this.props.params.taskId);
  };

  showUserCard = id => {
    this.setState({isUserCardVisible: true, userId: id});
  };

  hideUserCard = () => {
    this.setState({isUserCardVisible: false});
  };

  render () {
    const css = require('./TaskHistory.scss');
    const eventList = this.props.history.map((event, i) => {
      return <div className={css.historyEvent} key={event.id}>
        <span className={css.time}> {moment(event.date).format('DD.MM.YYYY HH:mm:ss')}</span>
        <div className={css.historyAction}>
          <UserCard user={event.author}>
            <Link>{event.author.fullNameRu}</Link>
          </UserCard> {getMessage(event.message, event.entities, this.props.params.projectId)}
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
  history: PropTypes.array,
  params: PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired
  })
};

const mapStateToProps = state => ({
  history: state.Task.task.history
});

const mapDispatchToProps = {
  getTaskHistory
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskHistory);
