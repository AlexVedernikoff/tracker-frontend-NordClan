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
import Paper from 'material-ui/lib/paper';
import FlatButton from 'material-ui/lib/flat-button';
import Divider from 'material-ui/lib/divider';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import ContentInbox from 'material-ui/lib/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/lib/svg-icons/content/drafts';
import ContentSend from 'material-ui/lib/svg-icons/content/send';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { asyncConnect } from 'redux-async-connect';
import AppHead from '../../components/AppHead/AppHead';

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
    params: PropTypes.object.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired
  };


  render() {
    const styles = require('./TaskPage.scss');
    const {task} = this.props;
    return (
      <div>
        <AppHead/>
        <Grid>
          <Paper className={styles.paper}>
            <Row>
              <Col xs={3}>
                <FlatButton label="Edit"/>
              </Col>
              <Col xs={9}>
                <Row start="xs">
                  <FlatButton label="Assign"/>
                  <FlatButton label="Start"/>
                  <FlatButton label="Close"/>
                </Row>
              </Col>
            </Row>
            <Divider />
            <Row between="xs">
              <Col xs={9}>
                <h3>{task.name}</h3>
                <span >{task.about}</span>
                <Row middle="xs"/>
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
                    nestedItems={[
                      <ListItem
                        leftAvatar={<Avatar src="" />}
                        primaryText="Brendan Lim"
                        secondaryText={
                          <p>
                            I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
                          </p>
                        }
                        secondaryTextLines={2}
                      />,
                      <ListItem
                        leftAvatar={<Avatar src="" />}
                        primaryText="Scott Jennifer"
                        secondaryText={
                          <p>Wish I could come, but I&apos;m out of town this weekend.</p>
                        }
                        secondaryTextLines={2}
                        key={1}
                        nestedItems={[
                          <ListItem
                            leftAvatar={<Avatar src="" />}
                            primaryText="Brendan Lim"
                            secondaryText={
                              <p>
                                I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
                              </p>
                            }
                            secondaryTextLines={2}
                          />,
                          <ListItem
                            leftAvatar={<Avatar src="" />}
                            primaryText="Scott Jennifer"
                            key={2}
                            secondaryText={
                              <p>Wish I could come, but I&apos;m out of town this weekend.</p>
                            }
                            secondaryTextLines={2}
                          />
                        ]}
                      />
                    ]}
                  />
                </List>
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
          </Paper>
        </Grid>
      </div>
    );
  }
}
