import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Priority.scss';
import getProrityById from '../../utils/TaskPriority';

class Priority extends Component {
  constructor (props) {
    super(props);
  }

  changePriority = event => {
    event.preventDefault();
    event.stopPropagation();

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
      <div className={classnames(css.priority, {[css.vertical]: this.props.vertical})}>
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
                  [css.active]: priorityId === this.props.priority
                })}
                data-tip={getProrityById(priorityId)}
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
  onChange: PropTypes.func,
  onChangeCallback: PropTypes.func,
  onPrioritySet: PropTypes.func,
  priority: PropTypes.number,
  taskId: PropTypes.number,
  text: PropTypes.string,
  vertical: PropTypes.bool
};

Priority.defaultProps = {
  onChangeCallback: () => {},
  vertical: false
};

export default Priority;
