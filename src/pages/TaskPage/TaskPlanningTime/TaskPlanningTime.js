import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as css from './TaskPlanningTime.scss';
import { IconEdit, IconCheck } from '../../../components/Icons';
import { connect } from 'react-redux';
import {
  startTaskEditing,
  stopTaskEditing,
  changeTask
} from '../../../actions/Task';
import roundNum from '../../../utils/roundNum';

class TaskPlanningTime extends Component {
  constructor (props) {
    super(props);
    this.state = {
      submitError: false,
      time: null
    };
  }

  editIconClickHandler = event => {
    event.stopPropagation();
    if (this.props.PlanningTimeIsEditing) {
      this.validateAndSubmit();
    } else {
      this.startEditing();
    }
  };

  startEditing = () => {
    this.props.startTaskEditing('PlanningTime');
  };

  stopEditing = () => {
    this.props.stopTaskEditing('PlanningTime');
  };

  validateAndSubmit = () => {
    this.taskPlanningTime.innerText = this.taskPlanningTime.innerText.replace(',', '.').trim();
    if (!(/^\d+(\.\d{0,})?$/.test(this.taskPlanningTime.innerText))) {
      this.setState({ submitError: true });
    } else {
      this.setState(
        {
          submitError: false
        },
        this.props.changeTask(
          {
            id: this.props.id,
            plannedExecutionTime: +this.taskPlanningTime.innerText
          },
          'PlanningTime'
        ));
    }
  };

  handleKeyPress = event => {
    if (this.props.PlanningTimeIsEditing && event.keyCode === 13) {
      event.preventDefault();
      this.validateAndSubmit(event);
    } else if (event.keyCode === 27) {
      event.target.innerText = this.state.time;
      this.setState({
        submitError: false
      });
    }
  };

  render () {
    return (
        <div className={css.wrapper}>
          <span
            className={classnames({
              [css.taskTime]: true,
              [css.wrong]: this.state.submitError
            })}
            ref={ref => (this.taskPlanningTime = ref)}
            contentEditable={this.props.PlanningTimeIsEditing}
            onBlur={this.validateAndSubmit}
            onKeyDown={this.handleKeyPress}
          >
            {roundNum(this.props.time, 2)}
          </span>
          <span> ч.</span>
          {this.props.PlanningTimeIsEditing
            ? <IconCheck
                onClick={this.editIconClickHandler}
                className={css.save}
              />
            : <IconEdit
                onClick={this.editIconClickHandler}
                className={css.edit}
              />}
       </div>
    );
  }
}

TaskPlanningTime.propTypes = {
  PlanningTimeIsEditing: PropTypes.bool.isRequired,
  changeTask: PropTypes.func.isRequired,
  id: PropTypes.number,
  startTaskEditing: PropTypes.func.isRequired,
  stopTaskEditing: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  PlanningTimeIsEditing: state.Task.PlanningTimeIsEditing
});

const mapDispatchToProps = {
  startTaskEditing,
  stopTaskEditing,
  changeTask
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskPlanningTime);
