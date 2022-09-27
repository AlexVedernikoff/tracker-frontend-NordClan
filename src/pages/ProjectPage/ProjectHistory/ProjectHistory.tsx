import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import css from './ProjectHistory.scss';
import { getProjectHistory } from '../../../actions/Project';
import HistoryMessage from '../../../components/HistoryMessage';
import Pagination from '../../../components/Pagination';
import UserCard from '../../../components/UserCard';
import localize from './ProjectHistory.json';
import { getFullName, getMessage } from '../../../utils/NameLocalisation';

class ProjectHistory extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isUserCardVisible: false,
      activePage: 1
    };
  }

  componentDidMount = () => {
    this.loadHistoryEvents();
  };

  showUserCard = id => {
    this.setState({ isUserCardVisible: true, userId: id });
  };

  hideUserCard = () => {
    this.setState({ isUserCardVisible: false });
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

  render() {
    const { historyEvents, projectId, lang } = this.props;
    const eventList = historyEvents.filter(event => event).map(event => {
      return (
        <div className={css.historyEvent} key={event.id}>
          <span className={css.time}> {moment(event.date).format('DD.MM.YYYY HH:mm:ss')}</span>
          <div className={css.historyAction}>
            {event.author ? (
              <UserCard user={event.author}>
                <Link>{getFullName(event.author)}</Link>
              </UserCard>
            ) : null}{' '}
            <HistoryMessage message={getMessage(event)} entities={event.entities} projectId={projectId} />
          </div>
        </div>
      );
    });

    return (
      <div className={css.history}>
        <h3>{localize[lang].CHANGES_HISTORY}</h3>
        {eventList}

        {this.props.pagesCount > 1 ? (
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

(ProjectHistory as any).propTypes = {
  getProjectHistory: PropTypes.func.isRequired,
  historyEvents: PropTypes.array,
  lang: PropTypes.string,
  pagesCount: PropTypes.number,
  params: PropTypes.object,
  projectId: PropTypes.number
};

const mapStateToProps = state => ({
  projectId: state.Project.project.id,
  historyEvents: state.Project.project.history.events,
  pagesCount: state.Project.project.history.pagesCount,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getProjectHistory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectHistory);
