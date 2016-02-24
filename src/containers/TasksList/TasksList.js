import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {load} from 'redux/modules/tasks';
import List from '../../../node_modules/material-ui/lib/lists/list';
import ListItem from '../../../node_modules/material-ui/lib/lists/list-item';
import Paper from '../../../node_modules/material-ui/lib/paper';
import { isLoaded as isTasksLoaded, load as loadTasks } from 'redux/modules/tasks';
import { Link } from 'react-router';

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
  static reduxAsyncConnect(params, store) {
    const {dispatch, getState} = store;
    if (!isTasksLoaded(getState())) {
      return dispatch(loadTasks());
    }
  }
  render() {
    const {tasks} = this.props; // eslint-disable-line no-shadow
    // const styles = require('./TasksList.scss');
    return (
      <Paper zDepth={1}>
        <List>
          {tasks.map(task => <ListItem primaryText={<Link to={`/task/${task._id}`}>task.name</Link>} secondaryText={task.deadline} key={task._id}/>)}
        </List>
      </Paper>
    );
  }
}
