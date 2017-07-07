import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';

import TaskRow from '../../../components/TaskRow';
import Input from '../../../components/Input';
import Checkbox from '../../../components/Checkbox';
import * as css from './TaskList.scss';

import GetTasks from '../../../actions/Tasks';

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
      filterByName: ''
    };

  }

  componentDidMount () {
    this.props.GetTasks(this.props.project.id);
  }

  changeNameFilter = event => {
      this.setState(
        {
          filterByName: event.target.value
        },
        () => {
            this.props.GetTasks(this.props.project.id, this.state.filterByName);
        }
      );
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
          {tasks.map((task) => {
              return <TaskRow
                key={`task-${task.id}`}
                task={task}
                prefix={this.props.project.prefix}
              />;
            })
          }
        </section>
      </div>
    );
  }
}

TaskList.propTypes = {
  GetTasks: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  tasksList: PropTypes.array.isRequired
};


const mapStateToProps = state => ({ tasksList: state.Tasks.tasks, project: state.Project.project});
const mapDispatchToProps = { GetTasks };

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);

