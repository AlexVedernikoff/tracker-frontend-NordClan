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

import { getProjects } from '../../actions/Projects';

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSectionOpen: {
        myTasks: true,
        otherTasks: true
      },
      filterTags: [],
      filteredInProgress: false,
      filteredInHold: false,
      filteredFinished: false,
      projects: []
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
    e.preventDefault;
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getProjects(25, 1, ''));
  }

  render() {
    const { filteredInProgress, filteredInHold, filteredFinished } = this.state;

    return (
      <div>
        <section>
          <header className={css.title}>
            <h1 className={css.title}>Мои проекты</h1>
            <Button text="Создать проект" type="primary" icon="IconPlus" />
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
                <Input placeholder="Введите название проекта..." />
              </Col>
              <Col xs>
                <Row>
                  <Col xs>
                    <DatepickerDropdown placeholder="От" />
                  </Col>
                  <Col xs>
                    <DatepickerDropdown placeholder="До" />
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
                    { value: 'frontend', label: 'frontend' },
                    { value: 'backend', label: 'backend' }
                  ]}
                />
              </Col>
            </Row>
          </div>
          <div>
            {this.props.projectList.map((project, i) => {
              if (project.elemType !== 'portfolio') {
                return <ProjectCard key={`project-${project.id}`} project={project} />;
              } else {
                return <Portfolio key={`portfolio-${project.id}`} portfolio={project} />;
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { projectList: state.Projects.projects };
};

export default connect(mapStateToProps)(Projects);
