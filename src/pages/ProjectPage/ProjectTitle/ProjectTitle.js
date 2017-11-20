import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router';
import ReactTooltip from 'react-tooltip';
import ProjectIcon from '../../../components/ProjectIcon';
import PortfolioModal from '../../../components/PortfolioModal';
import { IconEdit, IconCheck, IconPreloader } from '../../../components/Icons';
import InlineHolder from '../../../components/InlineHolder';
import * as css from './ProjectTitle.scss';
import {
  changeProject as editProject,
  startEditing as beginEdit,
  stopEditing as finishEdit,
  openPortfolioModal,
  closePortfolioModal
} from '../../../actions/Project';

class ProjectTitle extends Component {
  static propTypes = {
    PortfolioIsEditing: PropTypes.bool,
    changeProject: PropTypes.func.isRequired,
    closePortfolioModal: PropTypes.func,
    id: PropTypes.any,
    name: PropTypes.string.isRequired,
    openPortfolioModal: PropTypes.func,
    portfolio: PropTypes.object,
    prefix: PropTypes.string.isRequired,
    projectId: PropTypes.number,
    startEditing: PropTypes.func.isRequired,
    stopEditing: PropTypes.func.isRequired,
    titleIsEditing: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
      ...props,
      prefixIsIncorrect: false,
      nameIsIncorrect: false
    };
  }
  componentDidMount () {
    window.addEventListener('click', this.outsideClickHandler);
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  componentWillUnmount () {
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
      if (
        event.target !== this.projectName
        && event.target !== this.projectPrefix
        && event.target !== this.portfolio
      ) {
        this.validateSubmit();
      }
    }
  };

  render () {
    return (
      <div className={css.projectTitle}>
        {this.props.name ? <ProjectIcon projectName={this.props.name} /> : <IconPreloader style={{color: 'silver', fontSize: '3rem', marginRight: 10}} />}
        <div>
          {
            this.props.titleIsEditing
            ? <span ref={ref => (this.portfolio = ref)} className={classnames([css.portfolio, css.edited])} onClick={this.props.openPortfolioModal}>
                {this.props.portfolio ? this.props.portfolio.name : 'Вне портфеля'}
              </span>
            : this.props.portfolio
            ? <Link to={`/projects/portfolio/${this.props.portfolio.id}`} className={css.portfolio}>{this.props.portfolio.name}</Link>
            : null
          }
          <h1>
            <span
              id="projectName"
              className={this.state.nameIsIncorrect ? css.wrong : ''}
              ref={ref => (this.projectName = ref)}
              contentEditable={this.props.titleIsEditing}
              onKeyDown={this.handleKeyPress}
            >
              {this.props.name ? this.props.name : <InlineHolder length={7} />}
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
                {this.props.prefix ? this.props.prefix : <InlineHolder length={2} />}
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
        </div>
        {
          this.props.PortfolioIsEditing
          ? <PortfolioModal
              defaultPortfolio={this.props.portfolio || null}
              projectId={this.props.projectId}
              onClose={this.props.closePortfolioModal}
              onChoose={this.props.changeProject}
              title="Изменить портфель проекта"
            />
          : null
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  titleIsEditing: state.Project.TitleIsEditing,
  PortfolioIsEditing: state.Project.PortfolioIsEditing,
  projectId: state.Project.project.id
});

const mapDispatchToProps = {
  changeProject: editProject,
  startEditing: beginEdit,
  stopEditing: finishEdit,
  openPortfolioModal,
  closePortfolioModal
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTitle);
