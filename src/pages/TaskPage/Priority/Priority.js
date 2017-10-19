import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Priority.scss';
import { changeTask } from '../../../actions/Task';

class Priority extends Component {
  constructor (props) {
    super(props);
  }

  changePriority = event => {
    event.preventDefault();
    if (+event.target.innerText !== this.props.priority) {
      const { onChange } = this.props;
      onChange(
        {
          id: this.props.taskId,
          prioritiesId: +event.target.innerText
        },
        'Priority'
      );
    }

    this.props.onChangeCallback();
  };

  setPriority = event => {
    this.props.onPrioritySet(event.target.innerText);
  };

  render () {
    return (
      <div className={css.priority}>
        {this.props.text === undefined ? 'Приоритет:' : this.props.text}
        <span className={css.count}>
          {[1, 2, 3, 4, 5].map((priorityId, i) => {
            return (
              <span
                key={`priority-${i}`}
                onClick={
                  this.props.onChange ? this.changePriority : this.setPriority
                }
                className={classnames({
                  [css.active]: priorityId === this.props.priority,
                  [css.inversionColor]: this.props.inversionColor
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
  priority: PropTypes.number,
  onChange: PropTypes.func,
  onPrioritySet: PropTypes.func
};

Priority.defaultProps = {
  onChangeCallback: () => {}
}

export default Priority;
