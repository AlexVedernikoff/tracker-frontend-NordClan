import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';

import * as css from './Projects.scss';
import SelectDropdown from '../../components/SelectDropdown';
import Button from '../../components/Button';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Input from '../../components/Input';
import ProjectCard from './ProjectCard';
import StatusCheckbox from './StatusCheckbox';
import Pagination from '../../components/Pagination';
import Portfolio from './Portfolio';
import moment from 'moment';

import CreateProject from './CreateProject';
import getProjects, {
  requestProjectCreate,
  openCreateProjectModal,
  closeCreateProjectModal
} from '../../actions/Projects';

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
    this.props.getProjects(20, this.state.activePage, '', this.state.filterByName, dateFrom, dateTo);
  }

  check = name => {
    const oldValue = this.state[name];
    this.setState({
      [name]: !oldValue
    });
  };

  selectValue = (e, name) => {
    this.setState({ [name]: e });
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
        filterByName: event.target.value
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

  handleDayFromChange = (dateFrom, modifiers) => {
    this.setState({ dateFrom }, () => {
      dateFrom = dateFrom
        ? moment(this.state.dateFrom).format('YYYY-MM-DD')
        : '';
      const dateTo = this.state.dateTo
        ? moment(this.state.dateTo).format('YYYY-MM-DD')
        : '';
      this.loadProjects(dateFrom, dateTo);
    });
  };

  handleDayToChange = (dateTo, modifiers) => {
    this.setState({ dateTo }, () => {
      const dateFrom = this.state.dateFrom
        ? moment(this.state.dateFrom).format('YYYY-MM-DD')
        : '';
      dateTo = dateTo ? moment(this.state.dateTo).format('YYYY-MM-DD') : '';
      this.loadProjects(dateFrom, dateTo);
    });
  };

  handleModal = event => {
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
      [name]: target.value
    });
  };

  sendRequest = event => {
    console.warn('пыщ', event);
    event.preventDefault();
    let portfolioName = '';
    if (this.state.selectedPortfolio && (Object.keys(this.state.selectedPortfolio).length !== 0)) {
      portfolioName
        = !Number.isInteger(this.state.selectedPortfolio.value)
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

  render () {
    const { filteredInProgress, filteredInHold, filteredFinished } = this.state;
    const formattedDayFrom = this.state.dateFrom
      ? moment(this.state.dateFrom).format('DD.MM.YYYY')
      : '';
    const formattedDayTo = this.state.dateTo
      ? moment(this.state.dateTo).format('DD.MM.YYYY')
      : '';

    return (
      <div>
        <section>
          <header className={css.title}>
            <h1 className={css.title}>Мои проекты</h1>
            <Button
              onClick={this.handleModal}
              text="Создать проект"
              type="primary"
              icon="IconPlus"
            />
          </header>
          <hr />
          <div className={css.projectsHeader}>
            <div className={css.statusFilters}>
              <StatusCheckbox
                type="INPROGRESS"
                checked={filteredInProgress}
                onClick={() => this.check('filteredInProgress')}
                label="В процессе"
              />
              <StatusCheckbox
                type="INHOLD"
                checked={filteredInHold}
                onClick={() => this.check('filteredInHold')}
                label="Приостановлен"
              />
              <StatusCheckbox
                type="FINISHED"
                checked={filteredFinished}
                onClick={() => this.check('filteredFinished')}
                label="Завершен"
              />
            </div>
            <Row>
              <Col xs>
                <Input
                  onChange={this.changeNameFilter}
                  placeholder="Введите название проекта..."
                />
              </Col>
              <Col xs>
                <Row>
                  <Col xs>
                    <DatepickerDropdown
                      name="dateFrom"
                      value={formattedDayFrom}
                      onDayChange={this.handleDayFromChange}
                      placeholder="От"
                    />
                  </Col>
                  <Col xs>
                    <DatepickerDropdown
                      name="dateTo"
                      value={formattedDayTo}
                      onDayChange={this.handleDayToChange}
                      placeholder="До"
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs>
                <SelectDropdown
                  name="filterTags"
                  multi
                  placeholder="Введите название тега..."
                  backspaceToRemoveMessage=""
                  value={this.state.filterTags}
                  onChange={e => this.selectValue(e, 'filterTags')}
                  noResultsText="Нет результатов"
                  options={[
                    { value: 'develop', label: 'develop' },
                    { value: 'frontend', label: 'frontend' },
                    { value: 'inner', label: 'внутренний' },
                    { value: 'commerce', label: 'коммерческий' },
                    { value: 'backend', label: 'backend' }
                  ]}
                />
              </Col>
            </Row>
          </div>
          <div>
             {this.props.projectList.map((project, i) => {
              if (project.elemType !== 'portfolio') {
                return (
                  <ProjectCard
                    key={`project-${project.id}`}
                    project={project}
                  />
                );
              } else {
                return (
                  <Portfolio
                    key={`portfolio-${project.id}`}
                    portfolio={project}
                  />
                );
              }
            })}
          </div>
          <hr />
          { this.props.pagesCount > 1
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
        />
      </div>
    );
  }
}

Projects.propTypes = {
  closeCreateProjectModal: PropTypes.func.isRequired,
  getProjects: PropTypes.func.isRequired,
  isCreateProjectModalOpen: PropTypes.bool.isRequired,
  openCreateProjectModal: PropTypes.func.isRequired,
  pagesCount: PropTypes.number.isRequired,
  projectList: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  projectList: state.Projects.projects,
  pagesCount: state.Projects.pagesCount,
  isCreateProjectModalOpen: state.Projects.isCreateProjectModalOpen
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
