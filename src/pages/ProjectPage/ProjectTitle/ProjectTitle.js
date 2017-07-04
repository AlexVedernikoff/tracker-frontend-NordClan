import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { IconEdit, IconCheck } from '../../../components/Icons';
import * as css from './ProjectTitle.scss';
import ReactTooltip from 'react-tooltip';
import { ChangeProject } from '../../../actions/Project';
import { connect } from 'react-redux';

class ProjectTitle extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ...props,
      editing: false,
      prefixIsIncorrect: false,
      nameIsIncorrect: false
    };
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  editIconClickHandler = event => {
    event.stopPropagation();
    if (this.state.editing) {
      this.validateSubmit();
    } else {
      this.startEditing();
    }
  };

  startEditing = () => {
    this.setState({ editing: true });
  };

  stopEditing = () => {
    this.setState({ editing: false });
  };

  handleIncorrectInput () {
    if (this.projectName.innerText.length < 4) {
      this.setState({ nameIsIncorrect: true });
    } else if (this.state.nameIsIncorrect) {
      this.setState({ nameIsIncorrect: false });
    }

    if (this.projectPrefix.innerText.length < 2) {
      this.setState({ prefixIsIncorrect: true });
    } else if (this.state.prefixIsIncorrect) {
      this.setState({ prefixIsIncorrect: false });
    }

    return false;
  }

  submitInput () {
    const { dispatch } = this.props;
    this.setState(
      {
        editing: false,
        prefixIsIncorrect: false,
        nameIsIncorrect: false,
        name: this.projectName.innerText,
        prefix: this.projectPrefix.innerText
      },
      () => {
        dispatch(
          ChangeProject({
            id: this.props.id,
            name: this.state.name,
            prefix: this.state.prefix
          })
        );
      }
    );
  }

  validateSubmit = () => {
    this.projectName.innerText = this.projectName.innerText.trim();
    this.projectPrefix.innerText = this.projectPrefix.innerText.trim();

    if (
      this.projectName.innerText.length < 4
      || this.projectPrefix.innerText.length < 2
    ) {
      this.handleIncorrectInput();
    } else {
      this.submitInput();
    }
  };

  handleKeyPress = event => {
    if (this.state.editing) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.validateSubmit();
      } else if (event.keyCode === 27) {
        event.preventDefault();
        this.setState({
          editing: false,
          prefixIsIncorrect: false,
          nameIsIncorrect: false
        });

        this.projectName.innerText = this.state.name;
        this.projectPrefix.innerText = this.state.prefix;
      }
    }
  };

  outsideClickHandler = event => {
    if (this.state.editing) {
      if (
        event.target !== this.projectName
        && event.target !== this.projectPrefix
      ) {
        this.validateSubmit();
      }
    }
  };

  componentDidMount () {
    window.addEventListener('click', this.outsideClickHandler);
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.outsideClickHandler);
  }

  render () {
    return (
      <h1 className={css.projectTitle}>
        <img src={this.state.pic} className={css.projectPic} />
        <span
          id="projectName"
          className={this.state.nameIsIncorrect ? css.wrong : ''}
          ref={ref => (this.projectName = ref)}
          contentEditable={this.state.editing}
          onKeyDown={this.handleKeyPress}
        >
          {this.props.name}
        </span>
        <span className={css.prefix}>
          <span>(</span>
          <span
            id="projectPrefix"
            className={this.state.prefixIsIncorrect ? css.wrong : ''}
            ref={ref => (this.projectPrefix = ref)}
            contentEditable={this.state.editing}
            onKeyDown={this.handleKeyPress}
          >
            {this.props.prefix}
          </span>
          <span>)</span>
        </span>
        {this.state.editing
          ? <IconCheck
              className={css.save}
              data-tip="Сохранить"
              onClick={this.editIconClickHandler}
            />
          : <IconEdit
              className={css.edit}
              data-tip="Редактировать"
              onClick={this.editIconClickHandler}
            />}
      </h1>
    );
  }
}

ProjectTitle.propTypes = {
  name: PropTypes.string.isRequired,
  pic: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired
};

export default connect(null)(ProjectTitle);
