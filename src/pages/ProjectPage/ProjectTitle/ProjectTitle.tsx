import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactTooltip from 'react-tooltip';
import ProjectIcon from '../../../components/ProjectIcon';
import PortfolioModal from '../../../components/PortfolioModal';
import { IconEdit, IconCheck, IconPreloader } from '../../../components/Icons';
import InlineHolder from '../../../components/InlineHolder';
import * as css from './ProjectTitle.scss';
import { showNotification } from '../../../actions/Notifications';
import {
  changeProject as editProject,
  startEditing as beginEdit,
  stopEditing as finishEdit,
  openPortfolioModal,
  closePortfolioModal
} from '../../../actions/Project';
import localize from './ProjectTitle.json';
import classnames from 'classnames';
import get from 'lodash/get';

class ProjectTitle extends Component<any, any> {
  static propTypes = {
    PortfolioIsEditing: PropTypes.bool,
    changeProject: PropTypes.func.isRequired,
    closePortfolioModal: PropTypes.func,
    id: PropTypes.any,
    isProjectAdmin: PropTypes.bool,
    lang: PropTypes.string,
    name: PropTypes.string.isRequired,
    openPortfolioModal: PropTypes.func,
    portfolio: PropTypes.object,
    prefix: PropTypes.string.isRequired,
    projectId: PropTypes.number,
    showNotification: PropTypes.func.isRequired,
    startEditing: PropTypes.func.isRequired,
    stopEditing: PropTypes.func.isRequired,
    titleIsEditing: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      ...props,
      prefixIsIncorrect: false,
      nameIsIncorrect: false
    };
  }
  componentDidMount() {
    window.addEventListener('click', this.outsideClickHandler);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.titleIsEditing !== this.props.titleIsEditing) {
      ReactTooltip.hide();
    }
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.outsideClickHandler);
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
    const { startEditing } = this.props;
    startEditing('Title');
  };

  stopTitleEditing = () => {
    const { stopEditing } = this.props;
    stopEditing('Title');
  };

  handleIncorrectInput() {
    const { lang } = this.props;
    if (this.projectName.innerText.length < 4 || this.projectName.innerText.length > 255) {
      this.setState({ nameIsIncorrect: true }, () =>
        this.props.showNotification({
          message: localize[lang].PROJECT_NAME_MESSAGE,
          type: 'error'
        })
      );
    } else if (this.state.nameIsIncorrect) {
      this.setState({ nameIsIncorrect: false });
    }

    if (this.projectPrefix.innerText.length < 2 || this.projectPrefix.innerText.length > 8) {
      this.setState({ prefixIsIncorrect: true }, () =>
        this.props.showNotification({
          message: localize[lang].PROJECT_PREFIX_MESSAGE,
          type: 'error'
        })
      );
    } else if (this.state.prefixIsIncorrect) {
      this.setState({ prefixIsIncorrect: false });
    }

    return false;
  }

  submitInput() {
    const { changeProject } = this.props;
    this.setState(
      {
        prefixIsIncorrect: false,
        nameIsIncorrect: false,
        name: this.projectName.innerText,
        prefix: this.projectPrefix.innerText
      },
      () => {
        changeProject(
          {
            id: this.props.id,
            name: this.state.name,
            prefix: this.state.prefix
          },
          'Title'
        ).catch(this.handleChangeProjectError);
      }
    );
  }

  validateSubmit = () => {
    this.projectName.innerText = this.projectName.innerText.trim();
    this.projectPrefix.innerText = this.projectPrefix.innerText.trim();

    if (
      this.projectName.innerText.length < 4 ||
      this.projectName.innerText.length > 255 ||
      this.projectPrefix.innerText.length < 2 ||
      this.projectPrefix.innerText.length > 8
    ) {
      this.handleIncorrectInput();
    } else {
      this.submitInput();
    }
  };

  handleChangeProjectError = error => {
    const errors = get(error, 'message.errors', []);
    const prefixNotUnique = errors.some(({ param, type }) => param === 'prefix' && type === 'unique violation');
    const message =
      localize[this.props.lang][prefixNotUnique ? 'PREFIX_NOT_UNIQUE_ERROR_MESSAGE' : 'VALIDATION_ERROR_MESSAGE'];

    this.props.showNotification({
      message,
      type: 'error'
    });
  };

  handleKeyPress = event => {
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
        this.stopTitleEditing();
      }
    }
  };

  outsideClickHandler = event => {
    if (this.props.titleIsEditing) {
      if (event.target !== this.projectName && event.target !== this.projectPrefix) {
        this.validateSubmit();
      }
    }
  };

  render() {
    const { lang } = this.props;
    return (
      <div className={css.projectTitle}>
        {this.props.name ? (
          <ProjectIcon projectName={this.props.name} projectPrefix={this.props.prefix} />
        ) : (
          <IconPreloader style={{ color: 'silver', fontSize: '3rem', marginRight: 10 }} />
        )}
        <div className={css.projectTitle__text}>
          {this.props.portfolio ? (
            <span className={css.portfolio}>
              <Link to={`/projects/portfolio/${this.props.portfolio.id}`}>{this.props.portfolio.name}</Link>
              <IconEdit onClick={this.props.openPortfolioModal} />
            </span>
          ) : null}
          <h1>
            <span
              id="projectName"
              className={classnames({ [css.wrong]: this.state.nameIsIncorrect })}
              ref={ref => (this.projectName = ref)}
              onKeyDown={this.handleKeyPress}
              contentEditable={this.props.titleIsEditing}
              suppressContentEditableWarning
            >
              {this.props.name ? this.props.name : <InlineHolder length="3.5em" />}
            </span>
            <span className={css.prefix}>
              <span>(</span>
              <span
                id="projectPrefix"
                className={this.state.prefixIsIncorrect ? css.wrong : ''}
                ref={ref => (this.projectPrefix = ref)}
                onKeyDown={this.handleKeyPress}
                contentEditable={this.props.titleIsEditing}
                suppressContentEditableWarning
              >
                {this.props.prefix ? this.props.prefix : <InlineHolder length="1em" />}
              </span>
              <span>)</span>
            </span>
            {this.props.isProjectAdmin ? (
              this.props.titleIsEditing ? (
                <IconCheck className={css.save} data-tip={localize[lang].SAVE} onClick={this.editIconClickHandler} />
              ) : (
                <IconEdit className={css.edit} data-tip={localize[lang].EDIT} onClick={this.editIconClickHandler} />
              )
            ) : null}
          </h1>
        </div>
        {this.props.isProjectAdmin && this.props.PortfolioIsEditing ? (
          <PortfolioModal
            defaultPortfolio={this.props.portfolio || null}
            projectId={this.props.projectId}
            onClose={this.props.closePortfolioModal}
            onChoose={this.props.changeProject}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  titleIsEditing: state.Project.TitleIsEditing,
  PortfolioIsEditing: state.Project.PortfolioIsEditing,
  projectId: state.Project.project.id
});

const mapDispatchToProps = {
  changeProject: editProject,
  startEditing: beginEdit,
  stopEditing: finishEdit,
  openPortfolioModal,
  closePortfolioModal,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectTitle);
