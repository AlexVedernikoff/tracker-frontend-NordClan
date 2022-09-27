import cssVariables from '../../styles/variables.scss';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollContainer } from 'react-router-scroll';
import Sidebar from 'react-sidebar';
import ReactTooltip from 'react-tooltip';
import * as dictionaryActions from '../../actions/Dictionaries';
import { history } from '../../History';
import AppHead from './AppHead';
import css from './InnerContainer.scss';
import NavMenu from './NavMenu';

const mql = window.matchMedia(`(min-width: 1024px)`);

class InnerContainer extends Component<any, any> {
  static propTypes = {
    children: PropTypes.object,
    getMagicActivityTypes: PropTypes.func,
    getMilestoneTypes: PropTypes.func,
    getProjectTypes: PropTypes.func,
    getTaskStatuses: PropTypes.func,
    getTaskTypes: PropTypes.func,
    getTestCaseSeverities: PropTypes.func,
    getTestCaseStatuses: PropTypes.func,
    user: PropTypes.object
  };
  unlistenHistory: (() => void) | null = null;

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
    this.props.getTestCaseStatuses();
    this.props.getTestCaseSeverities();
    this.listenHistory();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
    if (this.unlistenHistory) this.unlistenHistory();
  }

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
              <div className={css.contentWrapper}>
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
