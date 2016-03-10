/**
 * Created by ira on 18.02.16.
 */

import React, {Component, PropTypes} from 'react';
// import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setCurrentTask, isCurrentTaskLoaded} from 'redux/modules/current_task';
// import { Link } from 'react-router';
// import config from '../../config';
// import Helmet from 'react-helmet';
import FlatButton from 'material-ui/lib/flat-button';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import ContentInbox from 'material-ui/lib/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/lib/svg-icons/content/drafts';
import ContentSend from 'material-ui/lib/svg-icons/content/send';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { asyncConnect } from 'redux-async-connect';
import AppHead from '../../components/AppHead/AppHead';
// import FullWidthsection from '../FullWidthSection/FullWidthSection';
// import muiThemeable from 'material-ui/lib/muiThemeable';
import {Styles} from 'material-ui';
const {Typography} = Styles;

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}, params}) => {
    if (!isCurrentTaskLoaded(getState())) {
      return dispatch(setCurrentTask(params.taskId));
    }
  }
}])

@connect(
  state => ({task: state.currentTask.data})
)

export default class TaskPage extends Component {

  static propTypes = {
    task: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      status: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      about: PropTypes.string.isRequired,
      deadline: PropTypes.string.isRequired
    }),
    params: PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired
  }
  getStyles() {
    const theme = this.context.muiTheme;
    console.log('theme', theme, Typography);
    const styles = {
      root: {
      //  backgroundColor: Colors.cyan500,
        overflow: 'hidden',
      },
      h1: {
        color: theme.rawTheme.palette.primary1Color,
        fontWeight: Typography.fontWeightMedium,
        fontSize: 20,
        paddingTop: 19,
        marginBottom: 13,
        letterSpacing: 0
      },
      h2: {
        fontSize: '14px',
        lineHeight: '28px',
        paddingTop: 19,
        marginBottom: 13,
        letterSpacing: 0,
      },
      nowrap: {
        whiteSpace: 'nowrap',
      },
      taglineWhenLarge: {
        marginTop: 32,
      },
      h1WhenLarge: {
        fontSize: 56,
      },
      h2WhenLarge: {
        fontSize: 24,
        lineHeight: '32px',
        paddingTop: 16,
        marginBottom: 12,
      },
    };
    return styles;
  }

  render() {
    // const styles = require('./TaskPage.scss');

    const styles = this.getStyles();

    const {task} = this.props;
    return (
      <div>
        <AppHead/>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1 style={styles.h1}>{task.name}</h1>
            </Col>
          </Row>
          <Row between="xs">
            <Col xs={9}>
              <Row>
                <h2 style={styles.h2}>Описание</h2>
                <span >{task.about}</span>
              </Row>
              <Row middle="xs">
                <List subheader="Comments">
                  <ListItem
                    leftAvatar={<Avatar src="" />}
                    primaryText="Brendan Lim"
                    secondaryText={
                  <p>
                    I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
                  </p>
                }
                    secondaryTextLines={2}
                    key={1}
                  />
                  <ListItem
                    leftAvatar={<Avatar src="" />}
                    primaryText="Scott Jennifer"
                    secondaryText={
                  <p>Wish I could come, but I&apos;m out of town this weekend.</p>
                }
                    secondaryTextLines={2}
                    initiallyOpen
                    key={2}
                  />
                </List>
              </Row>
            </Col>
            <Col xs={3}>
              <Row>
              <span>Status:
                <FlatButton primary label="Open"/>
              </span>
              </Row>
              <Row>
                <List subheader="Details">
                  <ListItem primaryText={task.deadline} leftIcon={<ContentSend />} key={1}/>
                  <ListItem primaryText={task.deadline} leftIcon={<ContentDrafts />} key={2}/>
                  <ListItem primaryText={task.status} leftIcon={<ContentInbox />} key={3}/>
                </List>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
