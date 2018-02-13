import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';

import * as css from './Projects.scss';
import Button from '../../components/Button';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Input from '../../components/Input';
import ProjectCard from '../../components/ProjectCard';
import StatusCheckbox from './StatusCheckbox';
import Pagination from '../../components/Pagination';
import moment from 'moment';
import TagsFilter from '../../components/TagsFilter';
import _ from 'lodash';

import CreateProject from './CreateProject';
import getProjects, {
  requestProjectCreate,
  openCreateProjectModal,
  closeCreateProjectModal
} from '../../actions/Projects';
import { getErrorMessageByType } from '../../utils/ErrorMessages';
import { VISOR, ADMIN } from '../../constants/Roles';

import 'moment/locale/ru';

class Projects extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filterTags: [],
      filteredInProgress: false,
      filteredInHold: false,
      filteredFinished: false,
      projects: [],
      filterByName: '',
      dateFrom: '',
      dateTo: '',
      projectName: '',
      projectPrefix: '',
      openProjectPage: false,
      selectedPortfolio: null,
      activePage: 1
    };
  }

  componentDidMount () {
    this.loadProjects();
  }

  loadProjects = (dateFrom, dateTo) => {
    const tags = this.state.filterTags.map(el => el.value).join(',');
    const statuses = [];
    if (this.state.filteredInProgress) statuses.push(1);
    if (this.state.filteredInHold) statuses.push(2);
    if (this.state.filteredFinished) statuses.push(3);

    this.props.getProjects(20, this.state.activePage, tags, this.state.filterByName, dateFrom, dateTo, statuses.join(','));
  };

  check = (name, callback = () => {}) => {
    const oldValue = this.state[name];
    this.setState({
      [name]: !oldValue
    }, callback);
  };

  handlePaginationClick = e => {
    this.setState(
      {
        activePage: e.activePage
      },
      this.loadProjects
    );
  };

  changeNameFilter = event => {
    this.setState(
      {
        filterByName: event.target.value,
        activePage: this.state.filterByName !== event.target.value ? 1 : this.state.activePage
      },
      () => {
        const dateFrom = this.state.dateFrom
          ? moment(this.state.dateFrom).format('YYYY-MM-DD')
          : '';
        const dateTo = this.state.dateTo
          ? moment(this.state.dateTo).format('YYYY-MM-DD')
          : '';
        this.loadProjects(dateFrom, dateTo);
      }
    );
  };

  handleDayFromChange = (dateFrom) => {
    this.setState(
      {
        dateFrom,
        activePage: this.state.dateFrom !== dateFrom ? 1 : this.state.activePage
      },
      () => {
        dateFrom = dateFrom
          ? moment(this.state.dateFrom).format('YYYY-MM-DD')
          : '';
        const dateTo = this.state.dateTo
          ? moment(this.state.dateTo).format('YYYY-MM-DD')
          : '';
        this.loadProjects(dateFrom, dateTo);
      });
  };

  handleDayToChange = (dateTo) => {
    this.setState(
      {
        dateTo,
        activePage: this.state.dateTo !== dateTo ? 1 : this.state.activePage
      }, () => {
        const dateFrom = this.state.dateFrom
          ? moment(this.state.dateFrom).format('YYYY-MM-DD')
          : '';
        dateTo = dateTo ? moment(this.state.dateTo).format('YYYY-MM-DD') : '';
        this.loadProjects(dateFrom, dateTo);
      }
    );
  };

  handleFilterChange = () => {
    this.setState(
      {
        activePage: 1
      },
      () => {
        const dateFrom = this.state.dateFrom ? moment(this.state.dateFrom).format('YYYY-MM-DD') : '';
        const dateTo = this.state.dateTo ? moment(this.state.dateTo).format('YYYY-MM-DD') : '';
        this.loadProjects(dateFrom, dateTo);
      });
  };

  handleModal = () => {
    const {
      isCreateProjectModalOpen,
      openCreateProjectModal,
      closeCreateProjectModal
    } = this.props;
    if (isCreateProjectModalOpen) {
      this.setState({
        projectName: '',
        projectPrefix: '',
        selectedPortfolio: null
      });
      closeCreateProjectModal();
    } else {
      openCreateProjectModal();
    }
  };

  handleModalChange = event => {
    const { target } = event;
    const { name } = event.target;
    this.setState({
      [name]: target.value.trim()
    });
  };

  sendRequest = event => {
    event.preventDefault();
    let portfolioName = '';
    if (this.state.selectedPortfolio && (Object.keys(this.state.selectedPortfolio).length !== 0)) {
      portfolioName = !Number.isInteger(this.state.selectedPortfolio.value)
        ? this.state.selectedPortfolio.value
        : null;
    } else {
      portfolioName = null;
    }
    this.props.requestProjectCreate(
      {
        name: this.state.projectName,
        prefix: this.state.projectPrefix,
        portfolioId: portfolioName ? null : this.state.selectedPortfolio ? this.state.selectedPortfolio.value : null,
        portfolioName
      },
      this.state.openProjectPage
    );
  };

  sendRequestAndOpen = event => {
    this.setState({openProjectPage: true}, () => this.sendRequest(event));
  };

  handleModalCheckBoxChange = event => {
    const { target } = event;
    this.setState({
      openProjectPage: target.checked
    });
  };

  handlePortfolioChange = event => {
    let portfolio = event;
    if (Array.isArray(event)) portfolio = null;
    this.setState({
      selectedPortfolio: portfolio
    });
  };

  onTagSelect = (tags) => {
    this.setState({
      filterTags: tags
    }, this.handleFilterChange);
  };

  onClickTag = (tag) => {
    this.setState({
      filterTags: _.uniqBy(this.state.filterTags.concat({
        value: tag,
        label: tag
      }), 'value')
    }, this.handleFilterChange);
  };

  getFieldError = fieldName => {
    const errorsArr = this.props.projectError
      ? this.props.projectError.message.errors.filter(error => error.param === fieldName)
      : [];

    if (errorsArr.length) {
      return getErrorMessageByType(errorsArr[0].type);
    }

    return null;
  };
  render () {
    const { filteredInProgress, filteredInHold, filteredFinished } = this.state;
    const formattedDayFrom = this.state.dateFrom
      ? moment(this.state.dateFrom).format('DD.MM.YYYY')
      : '';
    const formattedDayTo = this.state.dateTo
      ? moment(this.state.dateTo).format('DD.MM.YYYY')
      : '';
    /*const isVisor = this.props.globalRole === VISOR;*/
    const isAdmin = this.props.globalRole === ADMIN;
    return (
      <div>
        <section>
          <header className={css.title}>
            <h1 className={css.title}>Мои проекты</h1>
            {
              isAdmin
                ? <Button
                  onClick={this.handleModal}
                  text="Создать проект"
                  type="primary"
                  icon="IconPlus"
                />
                : null
            }
          </header>
          <hr />
          <div className={css.projectsHeader}>
            <div className={css.statusFilters}>
              <StatusCheckbox
                type="INPROGRESS"
                checked={filteredInProgress}
                onClick={() => {this.check('filteredInProgress', this.handleFilterChange);}}
                label="В процессе"
              />
              <StatusCheckbox
                type="INHOLD"
                checked={filteredInHold}
                onClick={() => {this.check('filteredInHold', this.handleFilterChange);}}
                label="Приостановлен"
              />
              <StatusCheckbox
                type="FINISHED"
                checked={filteredFinished}
                onClick={() => {this.check('filteredFinished', this.handleFilterChange);}}
                label="Завершен"
              />
            </div>
            <Row className={css.search}>
              <Col xs={12} sm={4}>
                <Input
                  onChange={this.changeNameFilter}
                  placeholder="Введите название проекта..."
                />
              </Col>
              <Col xs={12} sm={4}>
                <Row>
                  <Col xs={6} sm={6}>
                    <DatepickerDropdown
                      name="dateFrom"
                      value={formattedDayFrom}
                      onDayChange={this.handleDayFromChange}
                      placeholder="От"
                    />
                  </Col>
                  <Col xs={6} sm={6}>
                    <DatepickerDropdown
                      name="dateTo"
                      value={formattedDayTo}
                      onDayChange={this.handleDayToChange}
                      placeholder="До"
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} sm={4}>
                <TagsFilter
                  filterFor={'project'}
                  onTagSelect={this.onTagSelect}
                  filterTags={this.state.filterTags}
                />
              </Col>
            </Row>
          </div>
          <div>
            {this.props.projectList.map((project, i) => {
              return (
                <ProjectCard
                  key={`project-${project.id}`}
                  project={project}
                  onClickTag={this.onClickTag}
                />
              );
            })}
          </div>
          {
            this.props.pagesCount > 1
              ? <Pagination
                itemsCount={this.props.pagesCount}
                activePage={this.state.activePage}
                onItemClick={this.handlePaginationClick}
              />
              : null
          }
        </section>
        <CreateProject
          isOpen={this.props.isCreateProjectModalOpen}
          onRequestClose={this.handleModal}
          onChange={this.handleModalChange}
          onSubmit={this.sendRequest}
          onSubmitAndOpen={this.sendRequestAndOpen}
          handleCheckBox={this.handleModalCheckBoxChange}
          onPortfolioSelect={this.handlePortfolioChange}
          selectedPortfolio={this.state.selectedPortfolio}
          validateProjectName = {this.state.projectName.length > 3}
          validateProjectPrefix = {this.state.projectPrefix.length > 1}
          prefixErrorText={this.getFieldError('prefix')}
        />
      </div>
    );
  }
}
Projects.propTypes = {
  closeCreateProjectModal: PropTypes.func.isRequired,
  getProjects: PropTypes.func.isRequired,
  globalRole: PropTypes.string.isRequired,
  isCreateProjectModalOpen: PropTypes.bool.isRequired,
  openCreateProjectModal: PropTypes.func.isRequired,
  pagesCount: PropTypes.number.isRequired,
  projectError: PropTypes.object,
  projectList: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  projectList: state.Projects.projects,
  pagesCount: state.Projects.pagesCount,
  isCreateProjectModalOpen: state.Projects.isCreateProjectModalOpen,
  projectError: state.Projects.error,
  globalRole: state.Auth.user.globalRole
});

const mapDispatchToProps = {
  requestProjectCreate,
  openCreateProjectModal,
  closeCreateProjectModal,
  getProjects
};

Projects.propTypes = {
  GetProjects: PropTypes.func,
  closeCreateProjectModal: PropTypes.func,
  isCreateProjectModalOpen: PropTypes.bool,
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onRequestClose: PropTypes.func,
  openCreateProjectModal: PropTypes.func,
  projectList: PropTypes.array,
  requestProjectCreate: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
