import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'react-sidebar';
import ReactTooltip from 'react-tooltip';
import AppHead from './AppHead';
import NavMenu from './NavMenu';
import * as css from './InnerContainer.scss';

export default class InnerContainer extends Component {
  static propTypes = {
    children: PropTypes.object,
    user: PropTypes.object
  };

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  render () {
    const sidebar = <NavMenu />;
    const sidebarStyles = {
      sidebar: {
        width: 240
      },
      content: {
        // overflowY: 'scroll',
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
            <div className={css.contentWrapper}>
              <div className={css.content}>
                {this.props.children}
              </div>
            </div>
            <div/>
          </Sidebar>
        </div>
        <ReactTooltip className="tooltip"/>
      </div>
    );
  }
}
