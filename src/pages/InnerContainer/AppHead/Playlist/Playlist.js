import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import onClickOutside from 'react-onclickoutside';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import moment from 'moment';
import getMaIcon from '../../../../constants/MagicActivityIcons';
import ActiveTaskPanel from './ActiveTaskPanel';
import { changeTask } from '../../../../actions/Task';
import { IconPause, IconPlay, IconList } from '../../../../components/Icons';
import List from './List';
import * as css from './Playlist.scss';

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.activityTabs = [];
    this.state = {
      activeDayTab: moment().day() - 1,
      activeActivityTab: 'all',
      isPlaylistOpen: false,
      activeTab: {}
    };
  }

  componentDidMount() {
    ReactTooltip.rebuild();
    this.setState({ activeTab: this.activityTabs[0] });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.magicActivitiesTypes.length) {
      this.activityTabs = newProps.magicActivitiesTypes.map(element => ({
        activityId: element.id,
        description: element.name,
        icon: getMaIcon(element.id)
      }));

      this.activityTabs.unshift({
        activityId: 'all',
        description: 'Все активности',
        icon: <IconList />
      });
    }
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  handleClickOutside = () => {
    if (this.state.isPlaylistOpen) {
      this.setState({ isPlaylistOpen: false });
    }
  };

  handleToggleList = () => {
    this.setState({ isPlaylistOpen: !this.state.isPlaylistOpen });
  };

  isActiveDayTab = tab => {
    return tab === this.state.activeDayTab;
  };

  dayTabStyle = tab => {
    return classnames({
      [css.day]: true,
      [css.active]: this.isActiveDayTab(tab),
      [css.inactive]: this.ifFutureTab(tab)
    });
  };

  changeActiveDayTab = tab => {
    return () => {
      this.setState(state => ({
        ...state,
        activeDayTab: tab
      }));
    };
  };

  ifFutureTab = tab => {
    return moment().diff(this.getDateByDayTab(tab)) < 0;
  };

  getDateByDayTab = tab => {
    return moment()
      .startOf('isoWeek')
      .add(tab, 'days');
  };

  isActiveActivityTab = tab => {
    return tab === this.state.activeActivityTab;
  };

  activityTabStyle = tab => {
    return classnames({
      [css.type]: true,
      [css.active]: this.isActiveActivityTab(tab)
    });
  };

  changeActiveActivityTab = tab => {
    return () => {
      this.setState(state => ({
        ...state,
        activeActivityTab: tab
      }));
    };
  };

  getScale = (tracks, activeDayTab, activeActivityTab) => {
    const activeTabContent = this.filterTracksByDayTab(tracks, activeDayTab);
    if (!activeTabContent.scales) {
      return '';
    }

    const time = activeTabContent.scales[activeActivityTab];
    if (!time) {
      return '';
    }

    const timeParts = ('' + time).split('.');
    const wholePart = timeParts[0];
    const fraction = timeParts[1] ? timeParts[1] : null;

    return (
      <span className={css.countBadge}>
        {wholePart}
        {fraction ? <small>.{fraction}</small> : ''}
      </span>
    );
  };

  activeTracks = (tracks, activeDayTab, activeActivityTab) => {
    let activeTracks = this.filterTracksByDayTab(tracks, activeDayTab);
    activeTracks = this.filterTracksByActivityTab(activeTracks.tracks, activeActivityTab);

    const isMagicActivityTab = activeActivityTab !== 'all' && activeActivityTab !== 1;
    const additionalMagicActivityTracks = isMagicActivityTab ? this.addAdditionalMagicActivities(activeTracks) : [];

    const allTracks = activeTracks.concat(additionalMagicActivityTracks);
    const allSortedTracks = allTracks.sort((track1, track2) => {
      if (!track1.project) {
        return -1;
      }
      if (!track2.project) {
        return 1;
      }

      return track1.project.id - track2.project.id;
    });

    return allSortedTracks;
  };

  filterTracksByDayTab = (tracks, activeDayTab) => {
    const activeDate = this.getDateByDayTab(activeDayTab).format('YYYY-MM-DD');
    if (activeDate in tracks) {
      return tracks[activeDate];
    }
    return {};
  };

  filterTracksByActivityTab = (tracks, activeDayTab) => {
    if (Array.isArray(tracks) && activeDayTab && activeDayTab !== 'all') {
      return tracks.filter(el => el.typeId === activeDayTab);
    } else if (Array.isArray(tracks)) {
      return tracks.filter(el => el.isDraft === false || el.task !== null); // Фильтрую драфты магической активности
    }
    return [];
  };

  addAdditionalMagicActivities = activeTracks => {
    const { availableProjects } = this.props;
    const { activeActivityTab } = this.state;
    const projects = availableProjects.filter(data =>
      activeTracks.every(track => {
        const isProjectWihoutMagicActivity = !track.project || (track.project && track.project.id !== data.project.id);

        return isProjectWihoutMagicActivity;
      })
    );

    const hasActivityWithoutProject = activeTracks.find(track => !track.project);
    const activityWithoutProject = !hasActivityWithoutProject
      ? this.createMagicActivityDraft(this.state.activeActivityTab)
      : [];
    if (activeActivityTab === 5 || activeActivityTab === 7) {
      return [activityWithoutProject];
    }
    const additionalTracks = projects
      .map(project => this.createMagicActivityDraft(this.state.activeActivityTab, project))
      .concat(activityWithoutProject);
    return additionalTracks;
  };

  createMagicActivityDraft = (type, data) => {
    const onDate = this.getDateByDayTab(this.state.activeDayTab).format('YYYY-MM-DD');

    const magicActivity = {
      id: data ? `temp-${data.project.id}` : 'temp-0',
      isCreatedTimesheet: false,
      isVisible: true,
      isDraft: true,
      typeId: type,
      onDate,
      projectId: data ? data.project.id : 0,
      spentTime: 0
    };

    return data ? { ...magicActivity, project: data.project } : magicActivity;
  };

  getCountBadge = (tracks, dayTab) => {
    const value = this.getScaleAll(tracks, dayTab);
    if (value) {
      return <span className={css.countBadge}>{value}</span>;
    }
    return '';
  };

  getScaleAll = (tracks, dayTab) => {
    const date = this.getDateByDayTab(dayTab).format('YYYY-MM-DD');
    if (date in tracks) {
      if ('scales' in tracks[date] && tracks[date].scales.all) {
        return tracks[date].scales.all;
      }
      return 0;
    }
    return '';
  };

  filterTracksByCurrentUser = (allTracks, currentUserId) => {
    const dayTabs = Object.keys(allTracks);
    const currentUserTracks = {};
    dayTabs.forEach(dayTab => {
      currentUserTracks[dayTab] = {
        ...allTracks[dayTab],
        tracks: allTracks[dayTab].tracks.filter(track => track.userId === currentUserId)
      };
    });
    return currentUserTracks;
  };

  render() {
    const { isPlaylistOpen } = this.state;
    const { activeTask, changeTask, tracks, currentUserId } = this.props;
    const currentUserTracks = this.filterTracksByCurrentUser(tracks, currentUserId);

    return (
      <div className={css.playlistWrapper}>
        <ActiveTaskPanel
          className={classnames(css.displayTask, css.task)}
          onClick={this.handleToggleList}
          activeTask={activeTask}
          changeTask={changeTask}
        />
        <ReactCSSTransitionGroup
          transitionName="animatedElement"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {isPlaylistOpen ? (
            <div className={css.list}>
              <div className={css.week}>
                <div className={this.dayTabStyle(0)} onClick={this.changeActiveDayTab(0)}>
                  Пн {this.getCountBadge(currentUserTracks, 0)}
                </div>
                <div className={this.dayTabStyle(1)} onClick={this.changeActiveDayTab(1)}>
                  Вт {this.getCountBadge(currentUserTracks, 1)}
                </div>
                <div className={this.dayTabStyle(2)} onClick={this.changeActiveDayTab(2)}>
                  Ср {this.getCountBadge(currentUserTracks, 2)}
                </div>
                <div className={this.dayTabStyle(3)} onClick={this.changeActiveDayTab(3)}>
                  Чт {this.getCountBadge(currentUserTracks, 3)}
                </div>
                <div className={this.dayTabStyle(4)} onClick={this.changeActiveDayTab(4)}>
                  Пт {this.getCountBadge(currentUserTracks, 4)}
                </div>
                <div className={this.dayTabStyle(5)} onClick={this.changeActiveDayTab(5)}>
                  Сб {this.getCountBadge(currentUserTracks, 5)}
                </div>
                <div className={this.dayTabStyle(6)} onClick={this.changeActiveDayTab(6)}>
                  Вс {this.getCountBadge(currentUserTracks, 6)}
                </div>
              </div>
              <div className={css.taskWrapper}>
                <List
                  handleToggleList={this.handleToggleList}
                  tracks={this.activeTracks(currentUserTracks, this.state.activeDayTab, this.state.activeActivityTab)}
                />
              </div>
              <div className={css.activity}>
                {this.activityTabs.map((element, index) => {
                  return (
                    <div
                      key={index}
                      className={this.activityTabStyle(element.activityId)}
                      data-tip={element.description}
                      onClick={this.changeActiveActivityTab(element.activityId)}
                      data-place="bottom"
                    >
                      {element.icon}
                      {this.getScale(currentUserTracks, this.state.activeDayTab, element.activityId)}
                    </div>
                  );
                })}
                <div className={css.time}>
                  <div className={css.today}>
                    <input
                      type="text"
                      value={this.getScaleAll(currentUserTracks, this.state.activeDayTab)}
                      data-tip="Итого"
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

Playlist.propTypes = {
  currentUserId: PropTypes.number,
  magicActivitiesTypes: PropTypes.array,
  tracks: PropTypes.object
};

const mapStateToProps = state => {
  return {
    currentUserId: state.Auth.user.id,
    activeTask: state.TimesheetPlayer.activeTask,
    tracks: state.TimesheetPlayer.tracks,
    availableProjects: state.TimesheetPlayer.availableProjects,
    magicActivitiesTypes: state.Dictionaries.magicActivityTypes
  };
};

const mapDispatchToProps = {
  changeTask
};

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(Playlist));
