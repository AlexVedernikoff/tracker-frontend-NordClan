import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import onClickOutside from 'react-onclickoutside';
import ReactTooltip from 'react-tooltip';

import {
  IconPause,
  IconBook,
  IconList,
  IconLaptop,
  IconCall,
  IconPlane,
  IconTime,
  IconCase,
  IconHospital,
  IconPresentation
} from '../../../../components/Icons';
import All from './All';
import Work from './Work';
import Meeting from './Meeting';
import Presale from './Presale';
import Estimate from './Estimate';
import Education from './Education';
import Vacation from './Vacation';
import Trip from './Trip';
import Hospital from './Hospital';
import * as css from './Playlist.scss';

class Playlist extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isPlaylistOpen: false,
      activityTabs: [
        {
          name: 'all',
          description: 'Все активности',
          content: <All/>,
          icon: <IconList/>
        },
        {
          name: 'work',
          description: 'Работа',
          content: <Work/>,
          icon: <IconLaptop/>
        },
        {
          name: 'meeting',
          description: 'Совещание',
          content: <Meeting/>,
          icon: <IconCall/>
        },
        {
          name: 'presale',
          description: 'Presale',
          content: <Presale/>,
          icon: <IconPresentation/>
        },
        {
          name: 'estimate',
          description: 'Оценка',
          content: <Estimate/>,
          icon: <IconTime/>
        },
        {
          name: 'education',
          description: 'Обучение',
          content: <Education/>,
          icon: <IconBook/>
        },
        {
          name: 'vacation',
          description: 'Отпуск',
          content: <Vacation/>,
          icon: <IconPlane/>
        },
        {
          name: 'trip',
          description: 'Командировка',
          content: <Trip/>,
          icon: <IconCase/>
        },
        {
          name: 'hospital',
          description: 'Больничный',
          content: <Hospital/>,
          icon: <IconHospital/>
        }
      ],
      activeTab: {}
    };
  }

  componentDidMount () {
    ReactTooltip.rebuild();
    this.setState({activeTab: this.state.activityTabs[0]});
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  handleClickOutside = () => {
    this.setState({isPlaylistOpen: false});
  };

  handleToggleList = () => {
    this.setState({isPlaylistOpen: !this.state.isPlaylistOpen});
  }

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
                  <div className={css.day}>Пн <span className={css.countBadge}>8</span></div>
                  <div className={classnames(css.day, css.active)}>Вт <span className={css.countBadge}>7<small>.25</small></span></div>
                  <div className={css.day}>Ср</div>
                  <div className={css.day}>Чт</div>
                  <div className={css.day}>Пт</div>
                  <div className={css.day}>Сб</div>
                  <div className={css.day}>Вс</div>
                </div>
                <div className={css.taskWrapper}>
                  {this.state.activeTab.content}
                </div>
                <div className={css.activity}>
                  {
                    this.state.activityTabs.map((element, index) => {
                      const tab
                      = <div
                          key={index}
                          className={classnames({[css.type]: true, [css.active]: this.state.activeTab.name === this.state.activityTabs[index].name})}
                          data-tip={element.description}
                          onClick={() => {this.setState({activeTab: element});}}
                          data-place="bottom">
                          {element.icon}
                        </div>;
                      return tab;
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

export default onClickOutside(Playlist);
