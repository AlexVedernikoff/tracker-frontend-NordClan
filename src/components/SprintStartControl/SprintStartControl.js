import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as css from './SprintStartControl.scss';
import { IconPlay, IconPause } from '../Icons';
import { editSprint } from '../../actions/Sprint';


class SprintStartControl extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    const { sprint } = this.props;

    return (
      <span
        onClick={() => this.props.editSprint(sprint.id, sprint.statusId === 1 ? 2 : 1)}
        className={classnames({
          [css.status]: true,
          [css.inprogress]: sprint.statusId === 2,
          [css.inhold]: sprint.statusId === 1
        })}
        data-tip={sprint.statusId === 2 ? 'Остановить' : 'Запустить'}
      >
        {sprint.statusId === 2 ? <IconPause /> : <IconPlay />}
      </span>
    );
  }
}

SprintStartControl.propTypes = {
  editSprint: PropTypes.func.isRequired,
  sprint: PropTypes.object.isRequired

};

const mapStateToProps = state => ({
  // sprints: state.Project.project.sprints,
  // project: state.Project.project,
  // leftColumnTasks: state.PlanningTasks.leftColumnTasks,
  // rightColumnTasks: state.PlanningTasks.rightColumnTasks,
  // SprintIsEditing: state.Task.SprintIsEditing
});

const mapDispatchToProps = {
  editSprint
  // getPlanningTasks,
  // changeTask,
  // startTaskEditing,
  // openCreateTaskModal,
  // createSprint,
  // editSprint
};

export default connect(mapStateToProps, mapDispatchToProps)(SprintStartControl);
