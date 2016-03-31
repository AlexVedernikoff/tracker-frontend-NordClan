import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {load} from 'redux/modules/tasks';
import List from '../../../node_modules/material-ui/lib/lists/list';
import ListItem from '../../../node_modules/material-ui/lib/lists/list-item';
import Paper from '../../../node_modules/material-ui/lib/paper';
import { isLoaded as isTasksLoaded, load as loadTasks } from 'redux/modules/tasks';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { asyncConnect } from 'redux-async-connect';
import AppHead from '../../components/AppHead/AppHead';
import Helmet from 'react-helmet';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isTasksLoaded(getState())) {
      return dispatch(loadTasks());
    }
  }
}])
@connect(
  state => ({tasks: state.tasks.data}),
  dispatch => bindActionCreators({load}, dispatch))

export default class TasksList extends Component {
  static propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      status: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      about: PropTypes.string.isRequired,
      deadline: PropTypes.string.isRequired
    })),
    load: PropTypes.func.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired
  };


  render() {
    const {tasks} = this.props; // eslint-disable-line no-shadow
    // const styles = require('./TasksList.scss');
    return (
      <div>
        <AppHead/>
        <Helmet title="Task List"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Paper zDepth={1}>
                <List style={{backgroundColor: 'white'}}>
                  {tasks.map(task => <ListItem primaryText={<Link to={`/task/${task._id}`}>{task.name}</Link>}
                                               secondaryText={task.deadline} key={task._id}/>)}
                </List>
              </Paper>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
