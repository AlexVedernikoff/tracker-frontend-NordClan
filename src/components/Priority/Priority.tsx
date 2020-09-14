import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import getProrityById from '../../utils/TaskPriority';
import * as css from './Priority.scss';

interface Props {
  canEdit: boolean
  onChange: (value: {
    id: number
    prioritiesId?: number
  }, name: string) => void
  onChangeCallback?: () => void
  onPrioritySet?: Function
  priority: number
  priorityTitle: string
  taskId?: number
  text?: string
  vertical?: boolean
}

interface State {
}

class Priority extends Component<Props, State> {
  constructor(props) {
    super(props);
  }

  changePriority = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.props.canEdit) {
      if (+event.target.innerText !== this.props.priority) {
        const { onChange } = this.props;
        onChange(
          {
            id: this.props.taskId,
            prioritiesId: +event.target.innerText
          },
          'Priority'
        );
      } else {
        const { onChange } = this.props;
        onChange(
          {
            id: this.props.taskId
          },
          'Priority'
        );
      }

      this.props.onChangeCallback();
    }
  };

  setPriority = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    this.props.onPrioritySet(event.target.innerText);
  };

  render() {
    const { canEdit } = this.props;

    return (
      <div className={classnames(css.priority, { [css.vertical]: this.props.vertical })}>
        {this.props.text === undefined ? this.props.priorityTitle : this.props.text}
        <span className={css.count}>
          {[1, 2, 3, 4, 5].map((priorityId, i) => {
            return (
              <span
                key={`priority-${i}`}
                onClick={this.props.onChange ? this.changePriority : this.setPriority}
                className={classnames({
                  [css.active]: priorityId === this.props.priority,
                  [css.canEdit]: canEdit
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

(Priority as any).propTypes = {
  canEdit: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeCallback: PropTypes.func,
  onPrioritySet: PropTypes.func,
  priority: PropTypes.number,
  priorityTitle: PropTypes.string,
  taskId: PropTypes.number,
  text: PropTypes.string,
  vertical: PropTypes.bool
};

(Priority as any).defaultProps = {
  onChangeCallback: () => {},
  vertical: false
};

export default Priority;
