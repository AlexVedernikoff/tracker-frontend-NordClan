import React from 'react';
import * as css from './PriorityBox.scss';
import classNames from 'classnames';
import Priority from './../../../pages/TaskPage/Priority';
import { connect } from 'react-redux';
import { changeTask } from './../../../actions/Task';

class PriorityBox extends React.Component {
  render() {
    const { open, taskId, changeTask, hideBox, priorityId } = this.props;
    const styles = [css.container, { [css.open]: open }];
    return <div className={classNames(styles)}>
      <div className={css.content}>
        <Priority
          text={''}
          taskId={taskId}
          priority={priorityId}
          onChange={changeTask}
          inversionColor={true}
          onChangeCallback={hideBox}
        />
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  changeTask
};

export default connect(mapStateToProps, mapDispatchToProps)(PriorityBox);
