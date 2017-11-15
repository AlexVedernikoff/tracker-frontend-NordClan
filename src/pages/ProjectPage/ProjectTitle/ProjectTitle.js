import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ProjectIcon from '../../../components/ProjectIcon';
import { IconEdit, IconCheck } from '../../../components/Icons';
import * as css from './ProjectTitle.scss';
import ReactTooltip from 'react-tooltip';
import {
  ChangeProject,
  StartEditing,
  StopEditing
} from '../../../actions/Project';
import { connect } from 'react-redux';

class ProjectTitle extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ...props,
      prefixIsIncorrect: false,
      nameIsIncorrect: false
    };
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  editIconClickHandler = event => {
    event.stopPropagation();
    if (this.props.titleIsEditing) {
      this.validateSubmit();
    } else {
      this.startTitleEditing();
    }
  };

  startTitleEditing = () => {
    const { StartEditing } = this.props;
    StartEditing('Title');
  };

  stopTitleEditing = () => {
    const { StopEditing } = this.props;
    StopEditing('Title');
  };

  handleIncorrectInput () {
    if (
      this.projectName.innerText.length < 4
      || this.projectName.innerText.length > 255
    ) {
      this.setState({ nameIsIncorrect: true });
    } else if (this.state.nameIsIncorrect) {
      this.setState({ nameIsIncorrect: false });
    }

    if (
      this.projectPrefix.innerText.length < 2
      || this.projectPrefix.innerText.length > 8
    ) {
      this.setState({ prefixIsIncorrect: true });
    } else if (this.state.prefixIsIncorrect) {
      this.setState({ prefixIsIncorrect: false });
    }

    return false;
  }

  submitInput () {
    const { ChangeProject } = this.props;
    this.setState(
      {
        prefixIsIncorrect: false,
        nameIsIncorrect: false,
        name: this.projectName.innerText,
        prefix: this.projectPrefix.innerText
      },
      () => {
        ChangeProject(
          {
            id: this.props.id,
            name: this.state.name,
            prefix: this.state.prefix
          },
          'Title'
        );
      }
    );
  }

  validateSubmit = () => {
    this.projectName.innerText = this.projectName.innerText.trim();
    this.projectPrefix.innerText = this.projectPrefix.innerText.trim();

    if (
      this.projectName.innerText.length < 4
      || this.projectName.innerText.length > 255
      || this.projectPrefix.innerText.length < 2
      || this.projectPrefix.innerText.length > 8
    ) {
      this.handleIncorrectInput();
    } else {
      this.submitInput();
    }
  };

  handleKeyPress = event => {
    const { dispatch } = this.props;

    if (this.props.titleIsEditing) {
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

        this.projectName.innerText = this.props.name;
        this.projectPrefix.innerText = this.props.prefix;
        dispatch(StopEditing('Title'));
      }
    }
  };

  outsideClickHandler = event => {
    if (this.props.titleIsEditing) {
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
        <ProjectIcon projectName={this.props.name} />
        <span
          id="projectName"
          className={this.state.nameIsIncorrect ? css.wrong : ''}
          ref={ref => (this.projectName = ref)}
          contentEditable={this.props.titleIsEditing}
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
            contentEditable={this.props.titleIsEditing}
            onKeyDown={this.handleKeyPress}
          >
            {this.props.prefix}
          </span>
          <span>)</span>
        </span>
        {this.props.titleIsEditing ? (
          <IconCheck
            className={css.save}
            data-tip="Сохранить"
            onClick={this.editIconClickHandler}
          />
        ) : (
          <IconEdit
            className={css.edit}
            data-tip="Редактировать"
            onClick={this.editIconClickHandler}
          />
        )}
      </h1>
    );
  }
}

ProjectTitle.propTypes = {
  name: PropTypes.string.isRequired,
  pic: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  ChangeProject: PropTypes.func.isRequired,
  StartEditing: PropTypes.func.isRequired,
  StopEditing: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  titleIsEditing: state.Project.TitleIsEditing
});

const mapDispatchToProps = {
  ChangeProject,
  StartEditing,
  StopEditing
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTitle);
