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
import All from './All';
import Work from './Work';
import Meeting from './Meeting';
import Presale from './Presale';
import Control from './Control';
import Education from './Education';
import Vacation from './Vacation';
import Trip from './Trip';
import Hospital from './Hospital';
import * as css from './Playlist.scss';
import {
  getTimesheetsPlayerData
} from '../../../../actions/TimesheetPlayer';

class Playlist extends Component {
  constructor (props) {
    super(props);
    this.activityTabs = [
      {
        name: 'all',
        description: 'Все активности',
        content: <All/>,
        icon: <IconList/>,
        summary: 7.25
      },
      {
        name: 'work',
        description: 'Работа',
        content: <Work/>,
        icon: <IconLaptop/>,
        summary: 5
      },
      {
        name: 'meeting',
        description: 'Совещание',
        content: <Meeting/>,
        icon: <IconCall/>,
        summary: 0.25
      },
      {
        name: 'presale',
        description: 'Преселлинг и оценка',
        content: <Presale/>,
        icon: <IconCheckList/>,
        summary: 0.25
      },
      {
        name: 'education',
        description: 'Обучение',
        content: <Education/>,
        icon: <IconBook/>,
        summary: 0
      },
      {
        name: 'vacation',
        description: 'Отпуск',
        content: <Vacation/>,
        icon: <IconPlane/>,
        summary: 0
      },
      {
        name: 'trip',
        description: 'Командировка',
        content: <Trip/>,
        icon: <IconCase/>,
        summary: 0
      },
      {
        name: 'hospital',
        description: 'Больничный',
        content: <Hospital/>,
        icon: <IconHospital/>,
        summary: 0
      },
      {
        name: 'control',
        description: 'Управление',
        content: <Control/>,
        icon: <IconOrganization/>,
        summary: 0
      }
    ];

    this.state = {
      activeDayTab: moment().day() - 1,
      activeActivityTab: 0,
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
      if (this.ifFutureTab(tab)) {
        return;
      }

      this.setState((state) => ({
        ...state,
        activeDayTab: tab
      }), getTimesheetsPlayerData(new Date().toISOString().slice(0, 10)));
    };
  };

  ifFutureTab = (tab) => {
    return moment().diff(moment().startOf('isoWeek').add(tab, 'days')) < 0;
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
    let activeTraks = this.filterTracksByDayTab(tracks, activeDayTab);
    activeTraks = {
      visible: this.filterTracksByActivityTab(tracks.visible, activeActivityTab),
      invisible: []
    }
    //activeTraks = this.filterTracksByActivityTab(activeTraks, activeActivityTab);

  };
  filterTracksByDayTab = (tracks, activeDayTab) => {
    const activeDate = moment().startOf('isoWeek').add(activeDayTab, 'days').format('YYYY-MM-DD');
    if (tracks[activeDate]) {
      return tracks[activeDate];
    }
    return {};
  };

  filterTracksByActivityTab = (tracks, activeDayTab) => {
    if (Array.isArray(tracks)) return tracks.filter(el => el.typeId === activeDayTab);
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
                  {/*{this.getActiveContent(this.props.tracks, this.state.activeDayTab)}*/}
                  {<All tracks={this.activeTracks(this.props.tracks, this.state.activeDayTab, this.state.activeActivityTab)}/>}
                </div>
                <div className={css.activity}>
                  {
                    this.activityTabs.map((element, index) => {
                      return <div
                          key={index}
                          className={this.activityTabStyle(index)}
                          data-tip={element.description}
                          onClick={this.changeActiveActivityTab(index)}

                          data-place="bottom">
                          {element.icon}
                          {this.getSummaryTime(element.summary)}
                        </div>;
                    })
                  }
                  <div className={css.time}>
                    <div className={css.today}>
                      <input type="text" value={7.25} data-tip="Итого"/>
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
