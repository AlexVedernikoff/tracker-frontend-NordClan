import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import * as css from './PriorityBox.scss';
import classNames from 'classnames';
import Priority from '../../Priority';
import { connect } from 'react-redux';
import { changeTask } from './../../../actions/Task';

class PriorityBox extends React.Component {
  static propTypes = {
    changeTask: PropTypes.func,
    hideBox: PropTypes.func,
    isTime: PropTypes.bool,
    priorityId: PropTypes.number,
    taskId: PropTypes.number
  };

  handleClickOutside = () => {
    this.props.hideBox();
  };

  render () {
    const {
      taskId,
      changeTask, // eslint-disable-line
      hideBox,
      priorityId
    } = this.props;

    return <div className={css.container}>
      <div className={classNames([css.content, {[css.shorter]: this.props.isTime}])}>
        <Priority
          text={''}
          taskId={taskId}
          priority={priorityId}
          onChange={changeTask}
          onChangeCallback={hideBox}
          vertical
        />
      </div>
    </div>;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  changeTask
};

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(PriorityBox));
