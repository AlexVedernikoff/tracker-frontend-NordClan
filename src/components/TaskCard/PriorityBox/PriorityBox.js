import React from 'react';
import * as css from './PriorityBox.scss';
import classNames from 'classnames';
import Priority from './../../../pages/TaskPage/Priority';
import { connect } from 'react-redux';
import { changeTask } from './../../../actions/Task';

class PriorityBox extends React.Component {
  render() {
    const { open, taskId, changeTask, tasks, hideBox } = this.props;
    const styles = {
      [css.container]: true,
      [css.open]: open
    };

    const priorityId = tasks.find(task => task.id === taskId).prioritiesId;
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

const mapStateToProps = state => ({
  tasks: state.Tasks.tasks
});

const mapDispatchToProps = {
  changeTask
};

export default connect(mapStateToProps, mapDispatchToProps)(PriorityBox);
