import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as css from './TaskTitle.scss';
import { IconEdit, IconCheck } from '../../../components/Icons';
import { connect } from 'react-redux';
import {
  startTaskEditing,
  stopTaskEditing,
  changeTask
} from '../../../actions/Task';

class TaskTitle extends Component {
  constructor (props) {
    super(props);
    this.state = {
      submitError: false,
    };
  }

  editIconClickHandler = event => {
    event.stopPropagation();
    if (this.props.TitleIsEditing) {
      this.validateAndSubmit();
    } else {
      this.startEditing();
    }
  };

  startEditing = () => {
    const { startTaskEditing } = this.props;
    startTaskEditing('Title');
  };

  stopEditing = () => {
    const { stopTaskEditing } = this.props;
    stopTaskEditing('Title');
  };

  validateAndSubmit = () => {
    const { changeTask } = this.props;
    !this.state.submitError && 
    changeTask(
          {
            id: this.props.id,
            name: this.taskName.innerText.trim()
          },
          'Title'
         );
  };

  handleInput = event => {
    let title = event.target.innerText.trim();
    title.length < 4 ? this.setState({ submitError: true }) : this.setState({ submitError: false });
    
    if (title.length > 300) {
      // TODO: add exceptions for backspace and other needed keys
      event.preventDefault();
    }    

    if (this.props.TitleIsEditing && event.keyCode === 13) {
      event.preventDefault();
      this.validateAndSubmit(event);
    } else if (event.keyCode === 27) {
      event.target.innerText = this.props.name;
      this.stopEditing();
      this.setState({
        submitError: false
      });
    }
  };

  render () {
    return (
      <div className={css.title}>
        <h1 className={css.titleWrapper}>
          <span
            className={classnames({
              [css.taskName]: true,
              [css.wrong]: this.state.submitError
            })}
            ref={ref => (this.taskName = ref)}
            contentEditable={this.props.TitleIsEditing}
            onBlur={this.validateAndSubmit}
            onInput={this.handleInput}
          >
            {this.props.name}
          </span>
          {this.props.TitleIsEditing
            ? <IconCheck
                onClick={this.editIconClickHandler}
                className={css.save}
              />
            : <IconEdit
                onClick={this.editIconClickHandler}
                className={css.edit}
              />}
        </h1>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  TitleIsEditing: state.Task.TitleIsEditing
});

const mapDispatchToProps = {
  startTaskEditing,
  stopTaskEditing,
  changeTask
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskTitle);
