import React, {Component, PropTypes} from 'react';

import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import * as Colors from 'material-ui/styles/colors';
// import Popover from 'material-ui/Popover';
// import PopoverAnimationFromTop from 'material-ui/Popover/PopoverAnimationVertical';
// import List from 'material-ui/List/List';
// import ListItem from 'material-ui/List/ListItem';
// import Avatar from 'material-ui/Avatar';
// import Divider from 'material-ui/Divider';

import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';

// import SocialPerson from 'material-ui/svg-icons/social/person';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
// import Settings from 'material-ui/svg-icons/action/settings';
import Search from 'material-ui/svg-icons/action/search';

import { Link } from 'react-router';

import styles from './appHead.css';

export default class AppHead extends Component {
  static contextTypes = {
    user: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      pathname: '/scrum'
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

  handleActive = tab => {
    this.setState({
      pathname: tab
    });
  }

  render() {
    // const { load } = this.props; // eslint-disable-line no-shadow
    const {user} = this.context;

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
                leftAvatar={<Avatar src={user.photo} />}
              >
                {user.firstNameRu} {user.lastNameRu}
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

    const renderAppIconsBarLeft = (
      <IconMenu
        iconButtonElement={
          <IconButton><NavigationMenu color={Colors.white} /></IconButton>
        }
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}>

        <MenuItem href="/" primaryText="Главная" />
        <MenuItem href="login" primaryText="Логин" />
        <MenuItem href="about" primaryText="О нас" />
      </IconMenu>
    );

    const renderAppIconsBarRight = (
      <div>
        <IconButton><Search color={Colors.white} /></IconButton>
        <IconMenu
          iconButtonElement={
            <IconButton><MoreVertIcon color={Colors.white} /></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText={user.login} />
          <MenuItem primaryText="Выйти" />
        </IconMenu>
      </div>
    );

    const renderAppMenuBar = (
      <AppBar style={{boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 2px 3px, rgba(0, 0, 0, 0.117647) 0px 2px 3px'}}
        iconElementLeft={
        <Tabs className={styles.tabs} value={location.pathname}>
          <Tab label="scrum" value="/scrum"
            containerElement={<Link to="/scrum" />}
            onActive={this.handleActive} />

          <Tab label="мои проекты" value="/project"
            containerElement={<Link to="/project" />}
            onActive={this.handleActive} />

          <Tab label="мои задачи" value="/tasks"
            containerElement={<Link to="/tasks" />}
            onActive={this.handleActive} />

          <Tab label="отчет по времени" value="/repeat"
            containerElement={<Link to="repeat" />}
            onActive={this.handleActive} />
        </Tabs>
        } />
    );

    return (
      <div>
        <AppBar
          title="SimTracker"
          style={{boxShadow: 'none'}}
          iconElementLeft={renderAppIconsBarLeft}
          iconElementRight={renderAppIconsBarRight}
        />
        {renderAppMenuBar}
      </div>
    );
  }
}
