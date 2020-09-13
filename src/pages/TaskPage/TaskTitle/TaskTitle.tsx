import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as css from './TaskTitle.scss';
import { IconEdit, IconCheck } from '../../../components/Icons';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { startTaskEditing, stopTaskEditing, changeTask } from '../../../actions/Task';
import localize from './taskTitle.json';

class TaskTitle extends Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    changeTask: PropTypes.func,
    id: PropTypes.number,
    lang: PropTypes.string,
    name: PropTypes.string,
    startTaskEditing: PropTypes.func,
    stopTaskEditing: PropTypes.func,
    titleIsEditing: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      submitError: false
    };
  }
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  editIconClickHandler = event => {
    event.stopPropagation();
    if (this.props.titleIsEditing) {
      this.validateAndSubmit();
    } else {
      this.startEditing();
    }
  };

  startEditing = () => {
    this.props.startTaskEditing('Title');
  };

  stopEditing = () => {
    this.props.stopTaskEditing('Title');
  };

  validateAndSubmit = () => {
    !this.state.submitError &&
      this.props.changeTask(
        {
          id: this.props.id,
          name: this.taskName.innerText.trim()
        },
        'Title'
      );
  };

  handleInput = event => {
    const title = event.target.innerText.trim();
    this.setState({ submitError: title.length < 4 });

    if (title.length > 300) {
      // TODO: add exceptions for backspace and other needed keys
      event.preventDefault();
    }
  };

  handleKeyDown = event => {
    if (this.props.titleIsEditing && event.key === 'Enter') {
      event.preventDefault();
      this.validateAndSubmit(event);
    } else if (event.key === 'Escape') {
      event.target.innerText = this.props.name;
      this.stopEditing();
      this.setState({
        submitError: false
      });
    }
  };

  render() {
    const { lang } = this.props;
    return (
      <div className={css.title}>
        <h1 className={css.titleWrapper}>
          <span
            className={classnames({
              [css.taskName]: true,
              [css.wrong]: this.state.submitError
            })}
            ref={ref => (this.taskName = ref)}
            onBlur={this.validateAndSubmit}
            onInput={this.handleInput}
            onKeyDown={this.handleKeyDown}
            contentEditable={this.props.titleIsEditing}
            suppressContentEditableWarning
          >
            {this.props.name}
          </span>
          {this.props.canEdit ? (
            this.props.titleIsEditing ? (
              <IconCheck
                onClick={this.editIconClickHandler}
                className={css.save}
                id={this.props.id}
                data-tip={localize[lang].SAVE}
              />
            ) : (
              <IconEdit
                onClick={this.editIconClickHandler}
                className={css.edit}
                id={this.props.id}
                data-tip={localize[lang].EDIT}
              />
            )
          ) : null}
        </h1>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  titleIsEditing: state.Task.TitleIsEditing,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  startTaskEditing,
  stopTaskEditing,
  changeTask
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskTitle);
