import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {load} from 'redux/modules/info';

// AppBar
import AppBar from 'material-ui/lib/app-bar';

// AutoComplete
// import AutoComplete from 'material-ui/lib/auto-complete';
import MenuItem from 'material-ui/lib/menus/menu-item';

// Icons
import SocialPerson from 'material-ui/lib/svg-icons/social/person';
// import ActionHome from 'material-ui/lib/svg-icons/action/home';
import NavigationMenu from 'material-ui/lib/svg-icons/navigation/menu';
import ActionSearch from 'material-ui/lib/svg-icons/action/search';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import Colors from 'material-ui/lib/styles/colors';
import Popover from 'material-ui/lib/popover/popover';
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Divider from 'material-ui/lib/divider';

// Test data
// const fruit = [
//   'Apple', 'Apricot', 'Avocado',
//   'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
//   'Boysenberry', 'Blood Orange',
//   'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry',
//   'Coconut', 'Cranberry', 'Clementine',
//   'Damson', 'Date', 'Dragonfruit', 'Durian',
//   'Elderberry',
//   'Feijoa', 'Fig',
//   'Goji berry', 'Gooseberry', 'Grape', 'Grapefruit', 'Guava',
//   'Honeydew', 'Huckleberry',
//   'Jabouticaba', 'Jackfruit', 'Jambul', 'Jujube', 'Juniper berry',
//   'Kiwi fruit', 'Kumquat',
//   'Lemon', 'Lime', 'Loquat', 'Lychee',
//   'Nectarine',
//   'Mango', 'Marion berry', 'Melon', 'Miracle fruit', 'Mulberry', 'Mandarine',
//   'Olive', 'Orange',
//   'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Plum', 'Pineapple',
//   'Pumpkin', 'Pomegranate', 'Pomelo', 'Purple Mangosteen',
//   'Quince',
//   'Raspberry', 'Raisin', 'Rambutan', 'Redcurrant',
//   'Salal berry', 'Satsuma', 'Star fruit', 'Strawberry', 'Squash', 'Salmonberry',
//   'Tamarillo', 'Tamarind', 'Tomato', 'Tangerine',
//   'Ugli fruit',
//   'Watermelon',
// ];
//
@connect(
    // state => ({info: state.info.data}),
    dispatch => bindActionCreators({load}, dispatch))

export default class AppHead extends Component {
  static propTypes = {
    // info: PropTypes.object,
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
        <IconButton><ActionSearch color={Colors.white} /></IconButton>
        <IconButton onTouchTap={this.handleTouchTap}>
          <SocialPerson color={Colors.white} />
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
            <IconButton><MoreVertIcon color={Colors.white} /></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText="Refresh" />
          <MenuItem primaryText="Help" />
          <Divider />
          <MenuItem primaryText="Sign out" />
        </IconMenu>
      </div>
    );

    return (
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
    );
  }
}
