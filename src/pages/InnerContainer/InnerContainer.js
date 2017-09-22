import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Sidebar from 'react-sidebar';
import ReactTooltip from 'react-tooltip';
import AppHead from './AppHead';
import NavMenu from './NavMenu';
import * as css from './InnerContainer.scss';
// import { phoneWidth } from '../../constants/Breakpoints';
import { tabletWidth } from '../../constants/Breakpoints';
import * as dictionaryActions from '../../actions/Dictionaries';
import { ScrollContainer } from 'react-router-scroll';

// const mql = window.matchMedia(`(min-width: ${phoneWidth})`);
const mql = window.matchMedia(`(min-width: ${tabletWidth})`);

class InnerContainer extends Component {

  static propTypes = {
    children: PropTypes.object,
    getMagicActivityTypes: PropTypes.func,
    getTaskStatuses: PropTypes.func,
    user: PropTypes.object
  };

  constructor (props) {
    super(props);

    this.state = {
      mql: mql,
      sidebarDocked: true,
      sidebarOpen: true
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentWillMount () {
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, sidebarDocked: mql.matches});
    this.props.getMagicActivityTypes();
    this.props.getTaskStatuses();
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  componentWillUnmount () {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  mediaQueryChanged = () => {
    this.setState({sidebarDocked: this.state.mql.matches, sidebarOpen: !this.state.mql.matches});
  }

  onSetSidebarOpen = (open) => {
    this.setState({sidebarOpen: open});
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
        width: 240,
        zIndex: 3
      },
      content: {
        overflowY: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }
    };
    const { sidebarDocked, sidebarOpen } = this.state;

    return (
      <div>
        <div>
          <Sidebar
            sidebar={sidebar}
            shadow={false}
            docked={sidebarDocked}
            open={sidebarOpen}
            styles={sidebarStyles}
            onSetOpen={this.onSetSidebarOpen}
          >
            <AppHead toggleMenu={() => this.onSetSidebarOpen(true)} />
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

const mapDispatchToProps = {
  ...dictionaryActions
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(InnerContainer);
