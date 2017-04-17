import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import List from 'material-ui/List/List';
import Subheader from 'material-ui/Subheader/Subheader';
import IconButton from 'material-ui/IconButton';
import IconSeparatorDown from 'material-ui/svg-icons/navigation/expand-more';
import IconSeparatorUp from 'material-ui/svg-icons/navigation/expand-less';
import { Col } from 'react-flexbox-grid/lib/index';

import ExecutorsListItem from './ExecutorsListItem';

export default class ExecutorsList extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    css: PropTypes.object
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  }
  constructor(props, context) {
    super(props, context);

    this.state = {
      executorsExpand: true
    };
  }

  getStyles() {
    const theme = this.context.muiTheme;
    const styles = {
      execWrapExpand: {
        maxHeight: '248px'
      },
      execItem: {
        position: 'relative',
        backgroundColor: theme.rawTheme.palette.backgroundColor
      },
      execSeparatorLine: {
        height: '1px',
        width: '100%',
        backgroundColor: theme.rawTheme.palette.borderColor
      },
      execIconActive: {
        fill: theme.rawTheme.palette.activeIcon
      },
    };
    return styles;
  }

  handleExecutorsExpand = () => {
    this.setState({
      executorsExpand: !this.state.executorsExpand
    });
  };

  render() {
    const styles = this.getStyles();
    const { css, data } = this.props;

    return (
      <Col xs>
        <div className={css.execBlock}>
          <div
            className={css.execWrap} style={
          this.state.executorsExpand ? styles.execWrapExpand :
          { maxHeight: findDOMNode(this.refs.executorsList).offsetHeight }
        }
          >
            <List ref="executorsList">
              <Subheader>Исполнители</Subheader>
              {Object.keys(data).map(key => (
                <ExecutorsListItem
                  key={key}
                  index={key}
                  date={data[key].date}
                  name={data[key].name}
                  status={data[key].status}
                />
              ))}
            </List>
          </div>
          <div className={css.execSeparator}>
            <IconButton
              tooltip={this.state.executorsExpand ? 'Развернуть' : 'Свернуть'}
              className={css.execSeparatorBtn}
              style={styles.execSeparatorBtn}
              onClick={this.handleExecutorsExpand}
            >
              {this.state.executorsExpand ? <IconSeparatorDown /> : <IconSeparatorUp />}
            </IconButton>
            <div style={styles.execSeparatorLine} />
          </div>
        </div>
      </Col>
    );
  }
}

ExecutorsList.defaultProps = {
  css: require('./executorsList.scss')
};
