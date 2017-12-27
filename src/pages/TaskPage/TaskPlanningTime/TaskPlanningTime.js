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

  componentDidUpdate() {
    this.taskPlanningTime.focus();
  }

  editIconClickHandler = event => {
    event.stopPropagation();
    if (this.props.timeIsEditing) {
      this.validateAndSubmit();
    } else {
      this.startEditing();
    }
  };

  startEditing = () => {
    this.props.startTaskEditing(this.props.isExecutionTime ? 'ExecutionTime' : 'PlanningTime');
  };

  stopEditing = () => {
    this.props.stopTaskEditing(this.props.isExecutionTime ? 'ExecutionTime' : 'PlanningTime');
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
            [this.props.isExecutionTime ? 'factExecutionTime' : 'plannedExecutionTime']: +this.taskPlanningTime.innerText
          },
          this.props.isExecutionTime ? 'ExecutionTime' : 'PlanningTime'
        ));
    }
  };

  handleKeyPress = event => {
    if (this.props.timeIsEditing && event.keyCode === 13) {
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
          key={this.props.key}
          className={classnames({
            [css.taskTime]: true,
            [css.wrong]: this.state.submitError,
            [css.alert]: this.props.isExecutionTime,
            [css.factTime]: this.props.isExecutionTime
          })}
          ref={ref => (this.taskPlanningTime = ref)}
          contentEditable={this.props.timeIsEditing}
          onBlur={this.validateAndSubmit}
          onKeyDown={this.handleKeyPress}
          { ...(this.props.tooltip ? {
            'data-tip': !!this.props.tooltip,
            'data-place': 'right',
            'data-for': this.props.dataFor
          } : null)
          }
        >
          {roundNum(this.props.time, 2)}
        </span>
        <span
          className={classnames({
            [css.alert]: this.props.isExecutionTime,
            [css.factTime]: this.props.isExecutionTime
          })}
          { ...(this.props.tooltip ? {
            'data-tip': !!this.props.tooltip,
            'data-place': 'right',
            'data-for': this.props.dataFor
          } : null)
          }
        > ч.</span>
        {this.props.timeIsEditing
          ? <IconCheck
            onClick={this.editIconClickHandler}
            className={css.save}
          />
          : <IconEdit
            onClick={this.editIconClickHandler}
            className={css.edit}
          />}
        {this.props.tooltip || null}
      </div>
    );
  }
}

TaskPlanningTime.propTypes = {
  changeTask: PropTypes.func.isRequired,
  dataFor: PropTypes.string,
  id: PropTypes.number,
  isExecutionTime: PropTypes.bool,
  startTaskEditing: PropTypes.func.isRequired,
  stopTaskEditing: PropTypes.func.isRequired,
  key: PropTypes.string,
  time: PropTypes.string.isRequired,
  timeIsEditing: PropTypes.bool.isRequired,
  tooltip: PropTypes.object
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  startTaskEditing,
  stopTaskEditing,
  changeTask
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskPlanningTime);
