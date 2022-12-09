import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import 'moment/locale/ru';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';
import Title from '../../components/Title';
import { getPortfolios } from '../../actions/Portfolios';
import getProjects, {
  closeCreateProjectModal,
  openCreateProjectModal,
  requestProjectCreate
} from '../../actions/Projects';
import Button from '../../components/Button';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import { IconPreloader } from '../../components/Icons';
import InlineHolder from '../../components/InlineHolder';
import Input from '../../components/Input';
import Pagination from '../../components/Pagination';
import ProjectCard from '../../components/ProjectCard';
import ScrollTop from '../../components/ScrollTop';
import TagsFilter from '../../components/TagsFilter';
import { getErrorMessageByType } from '../../utils/ErrorMessages';
import CreateProject from './CreateProject';
import localize from './projects.json';
import css from './Projects.scss';
import StatusCheckbox from './StatusCheckbox';
import TypeFilter from './TypeFilter';
import Guide from '~/guides/Guide';
import { isGuide, setCurrentGuide} from '~/guides/utils';
import { guideProject} from '~/guides/ProjectPage/const';

class Projects extends Component<any, any> {
  constructor(props) {
    super(props);
    const projectListFilters = this.getSavedFilters();
    this.state = {
      ...this.initialFilters,
      projects: [],
      projectPrefix: '',
      openProjectPage: false,
      selectedPortfolio: null,
      activePage: 1,
      filterSelectedTypes: [],
      filterRequestTypes: [],
      wasTouchedAfterRequest: undefined,
      selectedType: 1,
      dateFromIncorrect: false,
      dateToIncorrect: false,
      ...projectListFilters
    };
  }

  componentDidMount() {
    this.loadProjects();
    this.props.getPortfolios();
  }

  initialFilters = {
    filterTags: [],
    filteredInProgress: false,
    filteredInHold: false,
    filteredFinished: false,
    filterByName: '',
    dateFrom: '',
    dateTo: '',
    projectName: ''
  };

  selectType = filterSelectedTypes => {
    const filterRequestTypes = filterSelectedTypes.map(type => type.value);
    this.setState({ filterSelectedTypes, filterRequestTypes }, () => {
      this.loadProjects();
    });
  };

  loadProjects = (dateFrom?: string, dateTo?: string) => {
    const tags = this.state.filterTags.map(el => el.value).join(',');
    const typeId = this.state.filterRequestTypes.join(',');
    const statuses: string[] = [];
    if (this.state.filteredInProgress) statuses.push('1');
    if (this.state.filteredInHold) statuses.push('2');
    if (this.state.filteredFinished) statuses.push('3');

    this.props.getProjects(
      20,
      this.state.activePage,
      tags,
      this.state.filterByName,
      dateFrom,
      dateTo,
      statuses.join(','),
      typeId
    );
    this.saveFilters();
  };

  saveFilters = () => {
    localStorage.setItem(
      'projectListFilters',
      JSON.stringify({
        filterSelectedTypes: this.state.filterSelectedTypes,
        filterRequestTypes: this.state.filterRequestTypes
      })
    );
  };

  getSavedFilters = () => {
    const filters = JSON.parse(localStorage.getItem('projectListFilters') || '{}');
    return filters;
  };

  check = (name, callback = () => { }) => {
    const oldValue = this.state[name];
    this.setState(
      {
        [name]: !oldValue
      },
      callback
    );
  };

  onTypeSelect = option => {
    const selectedType = option ? option.value : 1;
    this.setState({ selectedType });
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
        const dateFrom = this.state.dateFrom ? moment(this.state.dateFrom).format('YYYY-MM-DD') : '';
        const dateTo = this.state.dateTo ? moment(this.state.dateTo).format('YYYY-MM-DD') : '';
        this.loadProjects(dateFrom, dateTo);
      }
    );
  };

  handleDayFromChange = dateFrom => {
    this.setState(
      {
        dateFrom,
        activePage: this.state.dateFrom !== dateFrom ? 1 : this.state.activePage
      },
      () => {
        const newDateFrom = dateFrom ? moment(this.state.dateFrom).format('YYYY-MM-DD') : '';
        const dateTo = this.state.dateTo ? moment(this.state.dateTo).format('YYYY-MM-DD') : '';
        this.loadProjects(newDateFrom, dateTo);
      }
    );
  };

  handleDayToChange = dateTo => {
    this.setState(
      {
        dateTo,
        activePage: this.state.dateTo !== dateTo ? 1 : this.state.activePage
      },
      () => {
        const dateFrom = this.state.dateFrom ? moment(this.state.dateFrom).format('YYYY-MM-DD') : '';
        const newDateTo = dateTo ? moment(this.state.dateTo).format('YYYY-MM-DD') : '';
        this.loadProjects(dateFrom, newDateTo);
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
      }
    );
  };

  handleModalChange = event => {
    const { target } = event;
    const { name } = event.target;
    this.setState(prevState => ({
      [name]: target.value.trim(),
      wasTouchedAfterRequest: prevState.wasTouchedAfterRequest !== undefined ? true : undefined
    }));
  };

  handleModalTypeSelected = type => {
    this.setState({
      selectedType: type.value
    });
  };

  sendRequest = () => {
    const { selectedPortfolio } = this.state;
    let portfolioName: string | null = '';
    if (selectedPortfolio && Object.keys(selectedPortfolio).length !== 0) {
      portfolioName = !Number.isInteger(selectedPortfolio.value) ? selectedPortfolio.value : null;
    } else {
      portfolioName = null;
    }
    this.props.requestProjectCreate(
      {
        name: this.state.projectName,
        prefix: this.state.projectPrefix,
        portfolioId: portfolioName ? null : selectedPortfolio ? selectedPortfolio.value : null,
        portfolioName,
        typeId: this.state.selectedType || 0
      },
      this.state.openProjectPage
    );
    this.setState({
      wasTouchedAfterRequest: false
    });
  };

  sendRequestAndOpen = () => {
    this.setState({ openProjectPage: true }, this.sendRequest);
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
  handleFiltersClear = () => {
    localStorage.setItem(
      'projectListFilters',
      JSON.stringify({})
    );
    this.setState({
      filteredInProgress: false,
      filteredInHold: false,
      filteredFinished: false,
      filterSelectedTypes: [],
      filterByName: '',
      dateFrom: '',
      dateTo: '',
      filterTags: []
    });
    this.props.getProjects();
  }
  onTagSelect = tags => {
    this.setState(
      {
        filterTags: tags
      },
      this.handleFilterChange
    );
  };

  onClickTag = tag => {
    this.setState(
      {
        filterTags: uniqBy(
          this.state.filterTags.concat({
            value: tag,
            label: tag
          }),
          'value'
        )
      },
      this.handleFilterChange
    );
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

  isFiltered() {
    for (const key in this.initialFilters) {
      if (this.state[key] && (!Array.isArray(this.state[key]) || this.state[key].length)) {
        return true;
      }
    }
    return false;
  }

  handleModal = () => {
    const {
      isCreateProjectModalOpen,
      openCreateProjectModal: openCreateProjectModalFunc,
      closeCreateProjectModal: closeCreateProjectModalFunc
    } = this.props;
    if (isCreateProjectModalOpen) {
      this.setState({
        projectName: '',
        projectPrefix: '',
        selectedPortfolio: null
      });
      closeCreateProjectModalFunc();
    } else {
      openCreateProjectModalFunc();
    }
  };

  renderProjectsList = () =>
       this.props.projectList.map(project => (
        <ProjectCard key={`project-${project.id}`} project={project} onClickTag={this.onClickTag} />
      ));

  renderPreloader = () => {
    return (
      <div className={css.projectsPreloader}>
        <Row>
          <Col xs={12} sm={4}>
            <IconPreloader style={{ color: 'silver', fontSize: '2rem', marginRight: 10, float: 'left' }} />
            <InlineHolder length="60%" />
          </Col>
          <Col xs={12} sm={4} className={css.box}>
            <InlineHolder length="80%" />
            <InlineHolder length="40%" />
          </Col>
          <Col xs={12} sm={4} className={css.box}>
            <InlineHolder length="30%" />
          </Col>
        </Row>
      </div>
    );
  };

  inputChecker = (e) => {
    const input = e.target;

    const date = new Date(input.value.split('.').reverse().join(' '));

    const dateIsInvalid = !moment(date).isValid();

    switch (input.name) {
      case 'dateFrom':
        this.setState({ dateFromIncorrect: dateIsInvalid });
        break;
      case 'dateTo':
        this.setState({ dateToIncorrect: dateIsInvalid });
        break;
      default:
        console.log('error');
        break;
    }
  }

  render() {
    const { lang, isProjectsReceived, pagesCount } = this.props;
    const {
      filterByName,
      filteredInProgress,
      filteredInHold,
      filteredFinished,
      filterSelectedTypes,
      dateFrom,
      dateTo,
      wasTouchedAfterRequest
    } = this.state;
    const formattedDayFrom = dateFrom ? moment(dateFrom).format('DD.MM.YYYY') : '';
    const formattedDayTo = dateTo ? moment(dateTo).format('DD.MM.YYYY') : '';
    const isFiltered = this.isFiltered();
    const withoutProjects = isProjectsReceived ? (
      <div className={css.notFound}>{localize[lang][isFiltered ? 'NOTHING_FOUND' : 'NO_PROJECT_ASSIGNED']}</div>
    ) : (
      this.renderPreloader()
    );

    return (
      <div>
        <Title render={`[Epic] - ${localize[lang].MY_PROJECTS}`} />

        <section>
          <header className={css.title}>
            <h1 className={css.title}>{localize[lang].MY_PROJECTS}</h1>
            {this.props.globalRole !== 'EXTERNAL_USER' && (
              <div>
                <div className={`${css.create} create`}>
                  <Button
                    onClick={this.handleModal}
                    text={localize[lang].SELECT_JIRA_PROJECT}
                    type="primary"
                    icon="IconPlus"
                    disabled={isGuide()}
                  />
                </div>
              </div>
            )}
          </header>
          <hr />
          <div className={css.projectsHeader}>
            <Row>
              <Col xs={12} sm={5}>
                <div className={css.statusFilters}>
                  <StatusCheckbox
                    type="INPROGRESS"
                    checked={filteredInProgress}
                    onClick={() => {
                      this.check('filteredInProgress', this.handleFilterChange);
                    }}
                    label={localize[lang].INPROGRESS}
                  />
                  <StatusCheckbox
                    type="INHOLD"
                    checked={filteredInHold}
                    onClick={() => {
                      this.check('filteredInHold', this.handleFilterChange);
                    }}
                    label={localize[lang].INHOLD}
                  />
                  <StatusCheckbox
                    type="FINISHED"
                    checked={filteredFinished}
                    onClick={() => {
                      this.check('filteredFinished', this.handleFilterChange);
                    }}
                    label={localize[lang].FINISHED}
                  />
                </div>
              </Col>
              <Col xs={12} sm={3}>
                <Button
                  onClick={this.handleFiltersClear}
                  text={localize[lang].CLEAR_FILTERS}
                  type="primary"
                  icon="IconBroom"
                />
              </Col>
              <Col xs={12} sm={4}>
                <TypeFilter onChange={this.selectType} value={filterSelectedTypes} />
              </Col>
            </Row>
            <Row className={css.search}>
              <Col xs={12} sm={4}>
                <Input onChange={this.changeNameFilter} placeholder={localize[lang].NAME_PROJECT} value={filterByName} />
              </Col>
              <Col xs={12} sm={4}>
                <Row>
                  <Col xs={6} sm={6}>
                    <DatepickerDropdown
                      className={this.state.dateFromIncorrect ? css.incorrectInput : ''}
                      name="dateFrom"
                      value={formattedDayFrom}
                      onDayChange={this.handleDayFromChange}
                      onBlur={this.inputChecker}
                      placeholder={localize[lang].FROM}
                    />
                  </Col>
                  <Col xs={6} sm={6}>
                    <DatepickerDropdown
                      className={this.state.dateToIncorrect ? css.incorrectInput : ''}
                      name="dateTo"
                      value={formattedDayTo}
                      onDayChange={this.handleDayToChange}
                      onBlur={this.inputChecker}
                      placeholder={localize[lang].TO}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} sm={4}>
                <TagsFilter filterFor={'project'} onTagSelect={this.onTagSelect} filterTags={this.state.filterTags} />
              </Col>
            </Row>
          </div>
          {this.props.projectList.length ? this.renderProjectsList() : withoutProjects}
          {pagesCount > 1 ? (
            <Pagination
              itemsCount={pagesCount}
              activePage={this.state.activePage}
              onItemClick={this.handlePaginationClick}
            />
          ) : null}
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
          projectName={this.state.projectName}
          projectPrefix={this.state.projectPrefix}
          prefixErrorText={!wasTouchedAfterRequest ? this.getFieldError('prefix') : null}
          onTypeSelect={this.handleModalTypeSelected}
          selectedType={this.state.selectedType}
        />
        <ScrollTop />
      </div>
    );
  }
}
(Projects as any).propTypes = {
  closeCreateProjectModal: PropTypes.func.isRequired,
  getPortfolios: PropTypes.func.isRequired,
  getProjects: PropTypes.func.isRequired,
  globalRole: PropTypes.string.isRequired,
  isCreateProjectModalOpen: PropTypes.bool.isRequired,
  isProjectsReceived: PropTypes.bool,
  lang: PropTypes.string,
  loading: PropTypes.number,
  openCreateProjectModal: PropTypes.func.isRequired,
  pagesCount: PropTypes.number.isRequired,
  projectError: PropTypes.object,
  projectList: PropTypes.array.isRequired,
  projectTypes: PropTypes.array,
  requestProjectCreate: PropTypes.func,
  setCurrentGuide: PropTypes.func
};

const mapStateToProps = state => ({
  projectList: state.Projects.projects,
  pagesCount: state.Projects.pagesCount,
  isCreateProjectModalOpen: state.Projects.isCreateProjectModalOpen,
  loading: state.Loading.loading,
  projectError: state.Projects.error,
  globalRole: state.Auth.user.globalRole,
  lang: state.Localize.lang,
  isProjectsReceived: state.Projects.isProjectsReceived
});

const mapDispatchToProps = {
  requestProjectCreate,
  openCreateProjectModal,
  closeCreateProjectModal,
  getPortfolios,
  getProjects,
  setCurrentGuide
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Projects);
