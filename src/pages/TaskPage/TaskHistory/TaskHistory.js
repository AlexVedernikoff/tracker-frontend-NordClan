import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import { getTaskHistory } from '../../../actions/Task';
import UserCard from '../../../components/UserCard';
import HistoryMessage from '../../../components/HistoryMessage';
import Pagination from '../../../components/Pagination';
import * as css from './TaskHistory.scss';

class TaskHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isUserCardVisible: false, activePage: 1 };
  }

  componentDidMount = () => {
    this.props.getTaskHistory(this.props.params.taskId);
  };

  handlePaginationClick = e => {
    this.setState(
      {
        activePage: e.activePage
      },
      this.loadHistoryEvents
    );
  };
  showUserCard = id => {
    this.setState({ isUserCardVisible: true, userId: id });
  };

  hideUserCard = () => {
    this.setState({ isUserCardVisible: false });
  };

  render() {
    const { history } = this.props;
    console.log('pagesCount', this.props.pagesCount);
    const eventList = history.data
      ? history.data.map((event, i) => {
          return (
            <div className={css.historyEvent} key={event.id}>
              <span className={css.time}> {moment(event.date).format('DD.MM.YYYY HH:mm:ss')}</span>
              <div className={css.historyAction}>
                <UserCard user={event.author}>
                  <Link>{event.author.fullNameRu}</Link>
                </UserCard>{' '}
                <HistoryMessage
                  message={event.message}
                  entities={event.entities}
                  projectId={+this.props.params.projectId}
                />
              </div>
            </div>
          );
        })
      : null;

    return (
      <div className={css.history}>
        <h3>История изменений</h3>
        {eventList}
        {this.props.pagesCount > 0 ? (
          <Pagination
            itemsCount={this.props.pagesCount}
            activePage={this.state.activePage}
            onItemClick={this.handlePaginationClick}
          />
        ) : null}
      </div>
    );
  }
}

TaskHistory.propTypes = {
  getTaskHistory: PropTypes.func.isRequired,
  history: PropTypes.object,
  pagesCount: PropTypes.number,
  params: PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired
  })
};

const mapStateToProps = state => ({
  history: state.Task.history,
  pagesCount: state.Task.history.pagesCount
});

const mapDispatchToProps = {
  getTaskHistory
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskHistory);
