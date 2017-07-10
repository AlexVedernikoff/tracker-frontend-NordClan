import React, { Component } from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';

import * as css from './Projects.scss';
import SelectDropdown from '../../components/SelectDropdown';
import { IconFolderOpen } from '../../components/Icons';
import Button from '../../components/Button';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Input from '../../components/Input';
import ProjectCard from './ProjectCard';
import StatusCheckbox from './StatusCheckbox';
import Pagination from '../../components/Pagination';
import Portfolio from './Portfolio';
import moment from 'moment';
import CreateProject from './CreateProject';

import GetProjects from '../../actions/Projects';

class Projects extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isCreateProjectModalOpen: false,
      filterTags: [],
      filteredInProgress: false,
      filteredInHold: false,
      filteredFinished: false,
      projects: [],
      filterByName: '',
      dateFrom: undefined,
      dateTo: undefined
    };
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
    e.preventDefault();
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(GetProjects(25, 1, ''));
  }

  changeNameFilter = event => {
    const { dispatch } = this.props;
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
        dispatch(
          GetProjects(25, 1, '', this.state.filterByName, dateFrom, dateTo)
        );
      }
    );
  };

  handleDayFromChange = (dateFrom, modifiers) => {
    const { dispatch } = this.props;
    this.setState({ dateFrom }, () => {
      dateFrom = dateFrom
        ? moment(this.state.dateFrom).format('YYYY-MM-DD')
        : '';
      const dateTo = this.state.dateTo
        ? moment(this.state.dateTo).format('YYYY-MM-DD')
        : '';
      dispatch(
        GetProjects(25, 1, '', this.state.filterByName, dateFrom, dateTo)
      );
    });
  };

  handleDayToChange = (dateTo, modifiers) => {
    const { dispatch } = this.props;
    this.setState({ dateTo }, () => {
      const dateFrom = this.state.dateFrom
        ? moment(this.state.dateFrom).format('YYYY-MM-DD')
        : '';
      dateTo = dateTo ? moment(this.state.dateTo).format('YYYY-MM-DD') : '';
      dispatch(
        GetProjects(25, 1, '', this.state.filterByName, dateFrom, dateTo)
      );
    });
  };

  handleModal = event => {
    this.setState({
      isCreateProjectModalOpen: !this.state.isCreateProjectModalOpen
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
            <Button text="Создать портфель" type="primary" icon="IconPlus" />
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
                  backspaceToRemoveMessage="BackSpace для очистки поля"
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
          {2 > 1
            ? <Pagination
                itemsCount={3}
                activePage={3}
                onItemClick={this.handlePaginationClick}
              />
            : null}
        </section>
        <CreateProject
          isOpen={this.state.isCreateProjectModalOpen}
          onRequestClose={this.handleModal}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({ projectList: state.Projects.projects });

export default connect(mapStateToProps)(Projects);
