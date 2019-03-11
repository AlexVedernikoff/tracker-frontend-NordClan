import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Sidebar from 'react-sidebar';
import ReactTooltip from 'react-tooltip';
import AppHead from './AppHead';
import NavMenu from './NavMenu';
import * as css from './InnerContainer.scss';
import cssVariables from '!!sass-variable-loader!../../styles/variables.scss';
import * as dictionaryActions from '../../actions/Dictionaries';
import { ScrollContainer } from 'react-router-scroll';
import { history } from '../../History';
import classnames from 'classnames';

const mql = window.matchMedia(`(min-width: ${cssVariables.tabletWidth})`);

class InnerContainer extends Component {
  static propTypes = {
    children: PropTypes.object,
    getMagicActivityTypes: PropTypes.func,
    getMilestoneTypes: PropTypes.func,
    getProjectTypes: PropTypes.func,
    getTaskStatuses: PropTypes.func,
    getTaskTypes: PropTypes.func,
    routes: PropTypes.array,
    user: PropTypes.object
  };

  static childContextTypes = { scrollTop: PropTypes.func };

  getChildContext() {
    return { scrollTop: this.scrollTop };
  }

  constructor(props) {
    super(props);

    this.state = {
      mql: mql,
      sidebarDocked: true,
      sidebarOpen: mql.matches
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
    this.setState({ mql: mql, sidebarDocked: mql.matches });
    this.props.getMagicActivityTypes();
    this.props.getTaskStatuses();
    this.props.getTaskTypes();
    this.props.getMilestoneTypes();
    this.props.getProjectTypes();
    this.listenHistory();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
    this.unlistenHistory();
  }

  scrollTop = element => {
    if (this.contentWrapper) {
      this.contentWrapper.scroll(0, 0);
      this.contentWrapper.scroll(
        0,
        Math.round(element.getBoundingClientRect().top) - element.getBoundingClientRect().height - 50
      );
    }
  };

  getRef = ref => (this.contentWrapper = ref);

  mediaQueryChanged = () => {
    this.setState({ sidebarDocked: this.state.mql.matches, sidebarOpen: this.state.mql.matches });
  };

  listenHistory = () => {
    this.unlistenHistory = history.listen(() => {
      if (!mql.matches) {
        if (this.state.sidebarOpen) {
          this.onSetSidebarOpen(false);
        }
      }
    });
  };

  toggleMenu = () => {
    this.setState({
      sidebarOpen: !this.state.sidebarOpen
    });
  };

  onSetSidebarOpen = open => {
    this.setState({ sidebarOpen: open });
  };

  shouldUpdateScroll = (prevLocation, { routes }) => {
    if (routes.some(route => route.scrollToTop)) {
      return [0, 0];
    }

    // Логика для перехода между роутами со свойством ignoreScrollBehavior и без
    const routeIgnoreScroll = !!routes.some(route => route.ignoreScrollBehavior);
    const prevRouteIgnoreScroll = !!(prevLocation && prevLocation.routes.some(route => route.ignoreScrollBehavior));

    // Если переход осуществлен с ignoreScrollBehavior на ignoreScrollBehavior (между табами) позицию скролла не меняю
    return !(routeIgnoreScroll && prevRouteIgnoreScroll);
  };

  isFullHeight = () => {
    const { routes } = this.props;
    return routes[routes.length - 1].fullHeight;
  };

  render() {
    const sidebar = (
      <NavMenu
        toggleMenu={this.toggleMenu}
        mqlMatches={!!this.state.mql.matches}
        sidebarOpened={this.state.sidebarOpen}
      />
    );
    const sidebarStyles = {
      sidebar: {
        width: this.state.sidebarOpen ? 240 : 60,
        zIndex: cssVariables.zSidebarLayer
      },
      content: {
        overflowY: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }
    };
    const { sidebarDocked, sidebarOpen } = this.state;
    const isFullHeight = this.isFullHeight();
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
            <AppHead
              toggleMenu={
                this.state.mql.matches && !sidebarDocked ? this.toggleMenu : () => this.onSetSidebarOpen(true)
              }
              toggleMenuIcon={this.state.mql.matches && !sidebarDocked}
            />
            <ScrollContainer scrollKey={'innerContainer'} shouldUpdateScroll={this.shouldUpdateScroll}>
              <div
                ref={this.getRef}
                className={classnames({
                  [css.contentWrapper]: true,
                  [css.fullHeight]: isFullHeight
                })}
              >
                <div className={css.content}>{this.props.children}</div>
              </div>
            </ScrollContainer>
          </Sidebar>
        </div>
        <ReactTooltip className="tooltip" />
      </div>
    );
  }
}

const mapDispatchToProps = {
  ...dictionaryActions
};

export default connect(
  null,
  mapDispatchToProps
)(InnerContainer);
