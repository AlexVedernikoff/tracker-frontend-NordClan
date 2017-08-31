import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import onClickOutside from 'react-onclickoutside';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  IconPause,
  IconBook,
  IconList,
  IconLaptop,
  IconCall,
  IconPlane,
  IconCase,
  IconHospital,
  IconCheckList,
  IconOrganization
} from '../../../../components/Icons';
import List from './List';
import * as css from './Playlist.scss';
import {
  getTimesheetsPlayerData
} from '../../../../actions/TimesheetPlayer';
import * as TimesheetTypes from '../../../../constants/TimesheetTypes';

class Playlist extends Component {
  constructor (props) {
    super(props);
    this.activityTabs = [
      {
        activityId: null,
        name: 'all',
        description: 'Все активности',
        icon: <IconList/>,
        summary: 7.25
      },
      {
        activityId: TimesheetTypes.IMPLEMENTATION,
        name: 'work',
        description: 'Работа',
        icon: <IconLaptop/>,
        summary: 5
      },
      {
        activityId: TimesheetTypes.MEETING,
        name: 'meeting',
        description: 'Совещание',
        icon: <IconCall/>,
        summary: 0.25
      },
      {
        activityId: 91, // Нет соотвествия с беком
        name: 'presale',
        description: 'Преселлинг и оценка',
        icon: <IconCheckList/>,
        summary: 0.25
      },
      {
        activityId: TimesheetTypes.EDUCATION,
        name: 'education',
        description: 'Обучение',
        icon: <IconBook/>,
        summary: 0
      },
      {
        activityId: TimesheetTypes.VACATION,
        name: 'vacation',
        description: 'Отпуск',
        icon: <IconPlane/>,
        summary: 0
      },
      {
        activityId: 3,
        name: 'trip',
        description: TimesheetTypes.BUSINESS_TRIP,
        icon: <IconCase/>,
        summary: 0
      },
      {
        activityId: TimesheetTypes.HOSPITAL,
        name: 'hospital',
        description: 'Больничный',
        icon: <IconHospital/>,
        summary: 0
      },
      {
        activityId: 90, // Нет соотвествия с беком
        name: 'control',
        description: 'Управление',
        icon: <IconOrganization/>,
        summary: 0
      }
    ];

    this.state = {
      activeDayTab: moment().day() - 1,
      activeActivityTab: null,
      isPlaylistOpen: false,
      activeContent: {},
      activeTab: {}
    };
  }

  componentDidMount () {
    ReactTooltip.rebuild();
    this.setState({activeTab: this.activityTabs[0]});
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  handleClickOutside = () => {
    this.setState({isPlaylistOpen: false});
  };

  handleToggleList = () => {
    this.setState({isPlaylistOpen: !this.state.isPlaylistOpen});

  };

  isActiveDayTab = (tab) => {
    return tab === this.state.activeDayTab;
  };

  dayTabStyle = (tab) => {
    return classnames({
      [css.day]: true,
      [css.active]: this.isActiveDayTab(tab),
      [css.inactive]: this.ifFutureTab(tab)
    });
  };

  changeActiveDayTab = (tab) => {
    return () => {
      this.setState((state) => ({
        ...state,
        activeDayTab: tab
      }), () => this.props.getTimesheetsPlayerData(this.getDateByDayTab(tab).format('YYYY-MM-DD')));
    };
  };

  ifFutureTab = (tab) => {
    return moment().diff(this.getDateByDayTab(tab)) < 0;
  };

  getDateByDayTab = (tab) => {
    return moment().startOf('isoWeek').add(tab, 'days');
  };

  isActiveActivityTab = (tab) => {
    return tab === this.state.activeActivityTab;
  };

  activityTabStyle = (tab) => {
    return classnames({
      [css.type]: true,
      [css.active]: this.isActiveActivityTab(tab)
    });
  };

  changeActiveActivityTab = (tab) => {
    return () => {
      this.setState((state) => ({
        ...state,
        activeActivityTab: tab
      }));
    };
  };

  getSummaryTime = (time) => {
    if (time) {
      return (
        <span className={css.countBadge}>
          {Math.floor(time)}
          <small>
            {((Math.round(time * 100) / 100) - Math.floor(time)).toString().substring(1)}
          </small>
        </span>
      );
    }

    return null;
  };

  activeTracks = (tracks, activeDayTab, activeActivityTab) => {
    let activeTracks = this.filterTracksByDayTab(tracks, activeDayTab);
    activeTracks = {
      visible: this.filterTracksByActivityTab(activeTracks.visible, activeActivityTab),
      invisible: this.filterTracksByActivityTab(activeTracks.invisible, activeActivityTab)
    };

    return activeTracks;
  };

  filterTracksByDayTab = (tracks, activeDayTab) => {
    const activeDate = this.getDateByDayTab(activeDayTab).format('YYYY-MM-DD');
    if (activeDate in tracks) {
      return tracks[activeDate];
    }
    return {};
  };

  filterTracksByActivityTab = (tracks, activeDayTab) => {
    if (Array.isArray(tracks) && activeDayTab) {
      return tracks.filter(el => el.typeId === activeDayTab);
    } else if (Array.isArray(tracks)) {
      return tracks;
    }
    return [];
  };


  render () {
    const { isPlaylistOpen } = this.state;

    return (
      <div className={css.playlistWrapper}>
        <div className={classnames(css.displayTask, css.task)} onClick={this.handleToggleList}>
          <div className={css.actionButton}>
            <IconPause style={{width: '1.5rem', height: '1.5rem'}}/>
          </div>
          <div className={css.taskNameWrapper}>
            <div className={css.taskTitle}>
              <div className={css.meta}>
                Активная задача: ST-48
              </div>
              <div className={css.taskName}>
                UI: Страница задачи. Не хватает кнопки Создания задачи со страницы задачи
              </div>
            </div>
          </div>
        </div>
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            isPlaylistOpen
            ? <div className={css.list}>
                <div className={css.week}>
                  <div className={this.dayTabStyle(0)} onClick={this.changeActiveDayTab(0)}>Пн <span className={css.countBadge}>8</span></div>
                  <div className={this.dayTabStyle(1)} onClick={this.changeActiveDayTab(1)}>Вт <span className={css.countBadge}>7<small>.25</small></span></div>
                  <div className={this.dayTabStyle(2)} onClick={this.changeActiveDayTab(2)}>Ср</div>
                  <div className={this.dayTabStyle(3)} onClick={this.changeActiveDayTab(3)}>Чт</div>
                  <div className={this.dayTabStyle(4)} onClick={this.changeActiveDayTab(4)}>Пт</div>
                  <div className={this.dayTabStyle(5)} onClick={this.changeActiveDayTab(5)}>Сб</div>
                  <div className={this.dayTabStyle(6)} onClick={this.changeActiveDayTab(6)}>Вс</div>
                </div>
                <div className={css.taskWrapper}>
                  <List tracks={this.activeTracks(this.props.tracks, this.state.activeDayTab, this.state.activeActivityTab)}/>
                </div>
                <div className={css.activity}>
                  {
                    this.activityTabs.map((element, index) => {
                      return <div
                          key={index}
                          className={this.activityTabStyle(element.activityId)}
                          data-tip={element.description}
                          onClick={this.changeActiveActivityTab(element.activityId)}

                          data-place="bottom">
                          {element.icon}
                          {this.getSummaryTime(element.summary)}
                        </div>;
                    })
                  }
                  <div className={css.time}>
                    <div className={css.today}>
                      <input type="text" value={7.25} data-tip="Итого" onChange={() => {}}/>
                    </div>
                  </div>
                </div>
            </div>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

Playlist.propTypes = {
  getTimesheetsPlayerData: PropTypes.func,
  tracks: PropTypes.object
};


const mapStateToProps = state => {
  return {
    tracks: state.TimesheetPlayer.tracks
  };
};

const mapDispatchToProps = {
  getTimesheetsPlayerData
};

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(Playlist));
