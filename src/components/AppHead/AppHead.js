import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {load} from 'redux/modules/tasks';

// AppBar
import AppBar from 'material-ui/lib/app-bar';

// AutoComplete
// import AutoComplete from 'material-ui/lib/auto-complete';
import MenuItem from 'material-ui/lib/menus/menu-item';

// Icons
import SocialPerson from 'material-ui/lib/svg-icons/social/person';
import ActionExitToApp from 'material-ui/lib/svg-icons/action/exit-to-app';
import Settings from 'material-ui/lib/svg-icons/action/settings';
import NavigationMenu from 'material-ui/lib/svg-icons/navigation/menu';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import Colors from 'material-ui/lib/styles/colors';
import Popover from 'material-ui/lib/popover/popover';
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Divider from 'material-ui/lib/divider';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

@connect(
  // state => ({tasks: state.tasks.data}),
  dispatch => bindActionCreators({load}, dispatch))

export default class AppHead extends Component {
  static propTypes = {
    // tasks: PropTypes.object,
    load: PropTypes.func.isRequired
  }


  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleTouchTap = (event) => {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };


  render() {
    // const { load } = this.props; // eslint-disable-line no-shadow
    const styles = require('./AppHead.scss');

    const appBarIcons = (
      <div>
        <IconButton onTouchTap={this.handleTouchTap}>
          <SocialPerson color={Colors.white}/>
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationFromTop}
        >
          <div style={styles.popover}>
            <List>
              <ListItem
                disabled
                leftAvatar={
                  <Avatar src={require('./vincent.jpg')} />
                }
              >
                Mega User
              </ListItem>
            </List>
          </div>
        </Popover>
        <IconMenu
          iconButtonElement={
            <IconButton><Settings color={Colors.white} /></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText="Refresh"/>
          <MenuItem primaryText="Help"/>
          <Divider />
          <MenuItem primaryText="Sign out"/>
        </IconMenu>
        <IconButton>
          <ActionExitToApp color={Colors.white}/>
        </IconButton>
      </div>
    );

    return (
      <div>
        <AppBar
          title="SimTracker"
          iconElementLeft={
          <IconMenu
            iconButtonElement={
              <IconButton><NavigationMenu color={Colors.white} /></IconButton>
            }
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          >
            <MenuItem href="/" primaryText="Главная" />
            <MenuItem href="login" primaryText="Логин" />
            <MenuItem href="about" primaryText="О нас" />
          </IconMenu>
        }
          iconElementRight={appBarIcons}
        />
        <AppBar showMenuIconButton={false} style={{minHeight: 0}}>
          <Tabs>
            <Tab
              label="Item One"/>
            <Tab
              label="Item Two"/>
            <Tab
              label="onActive"
              route="/home"/>
          </Tabs>
        </AppBar>
      </div>
    );
  }
}
