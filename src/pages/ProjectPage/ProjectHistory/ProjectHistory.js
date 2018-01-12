import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import * as css from './ProjectHistory.scss';
import { getProjectHistory } from '../../../actions/Project';
import HistoryMessage from '../../../components/HistoryMessage';
import Pagination from '../../../components/Pagination';
import UserCard from '../../../components/UserCard';

class ProjectHistory extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isUserCardVisible: false,
      activePage: 0
    };
  }

  componentDidMount = () => {
    this.loadHistoryEvents();
  };

  showUserCard = id => {
    this.setState({isUserCardVisible: true, userId: id});
  };

  hideUserCard = () => {
    this.setState({isUserCardVisible: false});
  };

  handlePaginationClick = e => {
    this.setState(
      {
        activePage: e.activePage
      },
      this.loadHistoryEvents
    );
  };

  loadHistoryEvents = () => {
    const pageSize = 20;
    this.props.getProjectHistory(this.props.params.projectId, {
      pageSize,
      currentPage: this.state.activePage
    });
  };

  render () {
    const { historyEvents, projectId } = this.props;
    const eventList = historyEvents.map((event, i) => {
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
    });

    return (
      <div className={css.history}>
        <h3>История изменений</h3>
        {eventList}

        { this.props.pagesCount > 1
          ? <Pagination
              itemsCount={this.props.pagesCount}
              activePage={this.state.activePage}
              onItemClick={this.handlePaginationClick}
            />
          : null
        }
      </div>
    );
  }
}

ProjectHistory.propTypes = {
  getProjectHistory: PropTypes.func.isRequired,
  historyEvents: PropTypes.array,
  pagesCount: PropTypes.number,
  projectId: PropTypes.number
};

const mapStateToProps = state => ({
  projectId: state.Project.project.id,
  historyEvents: state.Project.project.history.events,
  pagesCount: state.Project.project.history.pagesCount
});

const mapDispatchToProps = {
  getProjectHistory
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectHistory);
