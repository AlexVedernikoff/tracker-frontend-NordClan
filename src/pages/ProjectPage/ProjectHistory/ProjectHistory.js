import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import { getProjectHistory } from '../../../actions/Project';
import UserCard from '../../../components/UserCard';
import TaskHistoryMessage from '../../../components/TaskHistoryMessage';
import * as css from './ProjectHistory.scss';

class ProjectHistory extends React.Component {
  constructor (props) {
    super(props);
    this.state = {isUserCardVisible: false};
  }

  componentDidMount = () => {
    const { getProjectHistory, projectId } = this.props;
    console.log('mount component!');
    console.log(getProjectHistory);
    console.log(projectId);
    getProjectHistory(projectId);
  };

  showUserCard = id => {
    this.setState({isUserCardVisible: true, userId: id});
  };

  hideUserCard = () => {
    this.setState({isUserCardVisible: false});
  };

  render () {
    const { history, projectId } = this.props;
    const eventList = history.map((event, i) => {
      return <div className={css.historyEvent} key={event.id}>
        <span className={css.time}> {moment(event.date).format('DD.MM.YYYY HH:mm:ss')}</span>
        <div className={css.historyAction}>
          <UserCard user={event.author}>
            <Link>{event.author.fullNameRu}</Link>
          </UserCard>
          {' '}
          <TaskHistoryMessage
            message={event.message}
            entities={event.entities}
            projectId={projectId}
          />
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

ProjectHistory.propTypes = {
  getProjectHistory: PropTypes.func.isRequired,
  history: PropTypes.array,
  projectId: PropTypes.number,
};

const mapStateToProps = state => ({
  projectId: state.Project.project.id,
  history: state.Project.project.history
});

const mapDispatchToProps = {
  getProjectHistory
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectHistory);
