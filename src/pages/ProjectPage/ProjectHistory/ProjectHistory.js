import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import { getProjectHistory } from '../../../actions/Project';
import UserCard from '../../../components/UserCard';
import HistoryMessage from '../../../components/HistoryMessage';
import * as css from './ProjectHistory.scss';

class ProjectHistory extends React.Component {
  constructor (props) {
    super(props);
    this.state = {isUserCardVisible: false};
  }

  componentDidMount = () => {
    const { getProjectHistory, projectId } = this.props;
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
    const eventList = history.data ? history.data.map((event, i) => {
      return <div className={css.historyEvent} key={event.id}>
        <span className={css.time}> {moment(event.date).format('DD.MM.YYYY HH:mm:ss')}</span>
        <div className={css.historyAction}>
          <UserCard user={event.author}>
            <Link>{event.author.fullNameRu}</Link>
          </UserCard>
          {' '}
          <HistoryMessage
            message={event.message}
            entities={event.entities}
            projectId={projectId}
          />
        </div>
      </div>;
    }) : null;

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
  history: PropTypes.object,
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
