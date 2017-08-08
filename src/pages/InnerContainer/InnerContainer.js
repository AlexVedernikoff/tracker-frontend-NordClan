import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'react-sidebar';
import ReactTooltip from 'react-tooltip';
import AppHead from './AppHead';
import NavMenu from './NavMenu';
import * as css from './InnerContainer.scss';
import { ScrollContainer } from 'react-router-scroll';

export default class InnerContainer extends Component {
  static propTypes = {
    children: PropTypes.object,
    user: PropTypes.object
  };

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  shouldUpdateScroll (prevLocation, { routes }) {

    if (routes.some(route => route.scrollToTop)) {
      return [0, 0];
    }

    // Логика для перехода между роутами со свойством ignoreScrollBehavior и без
    const routeIgnoreScroll = !!(routes.some(route => route.ignoreScrollBehavior));
    const prevRouteIgnoreScroll = !!(prevLocation && prevLocation.routes.some(route => route.ignoreScrollBehavior));

    // Если переход осуществлен с ignoreScrollBehavior на ignoreScrollBehavior (между табами) позицию скролла не меняю
    return !(routeIgnoreScroll && prevRouteIgnoreScroll);
  }

  render () {
    const sidebar = <NavMenu />;
    const sidebarStyles = {
      sidebar: {
        width: 240
      },
      content: {
        overflowY: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }
    };
    const sidebarDocked = true;

    return (
      <div>
        <div>
          <Sidebar
            sidebar={sidebar}
            shadow={false}
            docked={sidebarDocked}
            styles={sidebarStyles}
          >
            <AppHead />
            <ScrollContainer
              scrollKey={'innerContainer'}
              shouldUpdateScroll={this.shouldUpdateScroll}
            >
            <div className={css.contentWrapper}>
              <div className={css.content}>
                {this.props.children}
              </div>
            </div>
            </ScrollContainer>
          </Sidebar>
        </div>
        <ReactTooltip className="tooltip"/>
      </div>
    );
  }
}
