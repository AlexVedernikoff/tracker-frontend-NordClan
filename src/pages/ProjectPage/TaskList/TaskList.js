import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';

import TaskRow from '../../../components/TaskRow';
import Input from '../../../components/Input';
import Checkbox from '../../../components/Checkbox';
import Pagination from '../../../components/Pagination';
import * as css from './TaskList.scss';

import getTasks from '../../../actions/Tasks';

const sortTasks = (sortedArr) => {
  sortedArr.sort((a, b) => {
    if (a.prioritiesId > b.prioritiesId) return 1;
    if (a.prioritiesId < b.prioritiesId) return -1;
  });
  return sortedArr;
};

class TaskList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      filterByName: '',
      activePage: 1
    };
  }

  componentDidMount () {
    if (this.props.project.id) {
      this.loadTasks();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.project.id !== nextProps.project.id) {
      this.loadTasks({
        projectId: nextProps.project.id
      });
    }
  }

  changeNameFilter = event => {
    this.setState(
      {
        filterByName: event.target.value
      },
      this.loadTasks
    );
  }

  handlePaginationClick = e => {
    this.setState(
      {
        activePage: e.activePage
      },
      this.loadTasks
    );
  };

  loadTasks = (options = {}) => {
    this.props.getTasks({
      projectId: this.props.project.id,
      currentPage: this.state.activePage,
      pageSize: 50,
      name: this.state.filterByName,
      ...options
    });
  }

  render () {
    const tasks = sortTasks(this.props.tasksList);

    return (
      <div>
        <section>
          <div className={css.filters}>
            <div className={css.checkedFilters}>
              <Checkbox label="Баг"/>
              <Checkbox label="Фича / Задача"/>
              <Checkbox label="New"/>
              <Checkbox label="Develop"/>
              <Checkbox label="Code Review"/>
              <Checkbox label="QA"/>
              <Checkbox label="Done"/>
              <Checkbox label="В процессе"/>
            </div>
            <Row>
              <Col xs={6}>
                <Input
                  placeholder="Название задачи"
                  onChange={this.changeNameFilter}
                />
              </Col>
              <Col xs={3}>
                <Input placeholder="Имя исполнителя"/>
              </Col>
              <Col xs={3}>
                <Input placeholder="Теги" />
              </Col>
            </Row>
          </div>
          {
            tasks.map((task) => {
              return <TaskRow
                key={`task-${task.id}`}
                task={task}
                prefix={this.props.project.prefix}
              />;
            })
          }

          <hr/>
          { this.props.pagesCount > 1
            ? <Pagination
                itemsCount={this.props.pagesCount}
                activePage={this.state.activePage}
                onItemClick={this.handlePaginationClick}
              />
            : null
          }
        </section>
      </div>
    );
  }
}

TaskList.propTypes = {
  getTasks: PropTypes.func.isRequired,
  pagesCount: PropTypes.number.isRequired,
  project: PropTypes.object.isRequired,
  tasksList: PropTypes.array.isRequired
};


const mapStateToProps = state => ({
  tasksList: state.Tasks.tasks,
  pagesCount: state.Tasks.pagesCount,
  project: state.Project.project
});

const mapDispatchToProps = { getTasks };

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);

