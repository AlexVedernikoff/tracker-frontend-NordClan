import React, { Component, PropTypes } from 'react';
import ListItem from 'material-ui/List/ListItem';
import IconCompleted from 'material-ui/svg-icons/action/check-circle';
import IconPaused from 'material-ui/svg-icons/toggle/radio-button-checked';
import IconInProcess from 'material-ui/svg-icons/av/play-circle-filled';

export default class ExecutorsListItem extends Component {
  static propTypes = {
    date: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
  }

  getStyles() {
    const theme = this.context.muiTheme;
    const styles = {
      background: {
        background: theme.rawTheme.palette.borderColor
      },
      backgroundColor: {
        backgroundColor: theme.rawTheme.palette.backgroundColor
      },
      activeIcon: {
        fill: theme.rawTheme.palette.activeIcon
      }
    };
    return styles;
  }

  handleMouseEnter = () => {};
  handleMouseLeave = () => {};
  handleTouchTap = () => {};

  render() {
    const styles = this.getStyles();
    const css = require('./executorsList.scss');
    const { date, name, status } = this.props;

    const icon = {
      iconPaused: <IconPaused />,
      iconInProcess: <IconInProcess style={styles.activeIcon} />,
      iconCompleted: <IconCompleted />
    };

    return (
      <ListItem
        disabled
        style={styles.backgroundColor}
        primaryText={<div className={css.execPrimaryText}>{name}<span className={css.execDate}>{date}</span></div>}
        secondaryText={
          <div><span className={css.execLine} style={styles.background}></span>
            <span>js - разработчик</span></div>
        }
        secondaryTextLines={1}
        leftIcon={icon[status]}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onTouchTap={this.handleTouchTap} />
    );
  }
}
