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
import localize from './TaskHistory.json';
import { getFullName, getMessage } from '../../../utils/NameLocalisation';

class TaskHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isUserCardVisible: false, activePage: 1 };
  }

  componentDidMount = () => {
    this.loadHistoryEvents();
  };

  handlePaginationClick = e => {
    const activePage = e.activePage;
    this.setState(
      {
        activePage: activePage
      },
      this.loadHistoryEvents
    );
  };

  loadHistoryEvents = () => {
    const pageSize = 10;
    this.props.getTaskHistory(this.props.params.taskId, {
      currentPage: this.state.activePage,
      pageSize
    });
  };

  showUserCard = id => {
    this.setState({ isUserCardVisible: true, userId: id });
  };

  hideUserCard = () => {
    this.setState({ isUserCardVisible: false });
  };

  render() {
    const { history, lang } = this.props;
    const eventList = history.data
      ? history.data.map(event => {
          return (
            <div className={css.historyEvent} key={event.id}>
              <span className={css.time}> {moment(event.date).format('DD.MM.YYYY HH:mm:ss')}</span>
              <div className={css.historyAction}>
                <UserCard user={event.author}>
                  <Link>{getFullName(event.author)}</Link>
                </UserCard>{' '}
                <HistoryMessage
                  message={getMessage(event)}
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
        <h3>{localize[lang].CHANGES_HISTORY}</h3>
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
  lang: PropTypes.string,
  pagesCount: PropTypes.number,
  params: PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired
  })
};

const mapStateToProps = state => ({
  history: state.Task.history,
  pagesCount: state.Task.history.pagesCount,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getTaskHistory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskHistory);
