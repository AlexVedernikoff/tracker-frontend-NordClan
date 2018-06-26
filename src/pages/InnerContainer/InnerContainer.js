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

const mql = window.matchMedia(`(min-width: ${cssVariables.tabletWidth})`);

class InnerContainer extends Component {
  static propTypes = {
    children: PropTypes.object,
    getMagicActivityTypes: PropTypes.func,
    getMilestoneTypes: PropTypes.func,
    getProjectTypes: PropTypes.func,
    getTaskStatuses: PropTypes.func,
    getTaskTypes: PropTypes.func,
    user: PropTypes.object
  };

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

  mediaQueryChanged = () => {
    this.setState({ sidebarDocked: this.state.mql.matches, sidebarOpen: this.state.mql.matches });
  };

  listenHistory = () => {
    this.unlistenHistory = history.listen(() => {
      if (this.state.sidebarOpen) {
        this.onSetSidebarOpen(false);
      }
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
    const sidebar = <NavMenu />;
    const sidebarStyles = {
      sidebar: {
        width: 240,
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
            <AppHead toggleMenu={() => this.onSetSidebarOpen(true)} />
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

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InnerContainer);
