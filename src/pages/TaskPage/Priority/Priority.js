import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Priority.scss';
import { changeTask } from '../../../actions/Task';
import { connect } from 'react-redux';

class Priority extends Component {
  constructor (props) {
    super(props);
  }

  changePriority = event => {
    event.preventDefault();
    if (+event.target.innerText !== this.props.priority) {
      const { changeTask } = this.props;
      changeTask({
        id: this.props.taskId,
        prioritiesId: +event.target.innerText
      }, 'Priority');
    }
  };

  render () {
    return (
      <div className={css.priority}>
        Приоритет:
        <span className={css.count}>
          {[1, 2, 3, 4, 5].map((priorityId, i) => {
            return (
              <span
                key={`priority-${i}`}
                onClick={this.changePriority}
                className={classnames({
                  [css.active]: priorityId === this.props.priority
                })}
              >
                {priorityId}
              </span>
            );
          })}
        </span>
      </div>
    );
  }
}

Priority.propTypes = {
  taskId: PropTypes.number,
  priorityId: PropTypes.number
};

const mapDispatchToProps = {
  changeTask
};

export default connect(null, mapDispatchToProps)(Priority);
