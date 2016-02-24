import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {load} from 'redux/modules/info';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

@connect(
    state => ({info: state.info.data}),
    dispatch => bindActionCreators({load}, dispatch))

export default class TasksList extends Component {
  static propTypes = {
    info: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      status: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      about: PropTypes.string.isRequired,
      deadline: PropTypes.string.isRequired
    })),
    load: PropTypes.func.isRequired
  }

  render() {
    const {info, load} = this.props; // eslint-disable-line no-shadow
    const styles = require('./TasksList.scss');
    return (
      <div className={styles.infoBar + ' well'}>
        <List>
          {info.map(todo => <ListItem primaryText={todo.name} secondaryText={todo.deadline} key={todo._id} />)}

        </List>
          <button className="btn btn-primary" onClick={load}>Reload from server</button>
        </div>
    );
  }
}
