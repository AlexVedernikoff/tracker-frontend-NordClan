import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';

import TaskRow from '../../../components/TaskRow';
import Input from '../../../components/Input';
import StatusCheckbox from './StatusCheckbox';
import Pagination from '../../../components/Pagination';
import * as css from './TaskList.scss';
import TagsFilter from '../../../components/TagsFilter';
import PerformerFilter from '../../../components/PerformerFilter';
import _ from 'lodash';

import getTasks from '../../../actions/Tasks';

class TaskList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      filterTags: [],
      statusId: [],
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
        filterByName: event.target.value,
        activePage: this.state.filterByName !== event.target.value ? 1 : this.state.activePage
      },
      this.loadTasks
    );
  }

  changeStatusFilter = (id) => {
    this.setState(
      {
        statusId: this.state.statusId.includes(id)
          ? this.state.statusId.filter(statusId => statusId !== id)
          : [...this.state.statusId, id],
        activePage: 1
      },
      this.loadTasks
    );
  }

  changePerformerFilter = (performer) => {
    const performerId = performer ? performer.value : 0;

    this.setState(
      {
        performerId,
        activePage: this.state.performerId !== performerId ? 1 : this.state.activePage
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
    const tags = this.state.filterTags.map(el => el.value).join(',');
    const statusId = this.state.statusId.join(',');
    this.props.getTasks({
      projectId: this.props.project.id,
      performerId: this.state.performerId,
      currentPage: this.state.activePage,
      pageSize: 50,
      name: this.state.filterByName,
      statusId,
      tags,
      ...options
    });
  }

  onTagSelect = (tags) => {
    this.setState({
      filterTags: tags
    }, this.loadTasks);
  };

  onClickTag = (tag) => {
    this.setState({
      filterTags: _.uniqBy(this.state.filterTags.concat({
        value: tag,
        label: tag
      }), 'value')
    }, this.loadTasks);
  };

  render () {
    const { tasksList: tasks, statuses} = this.props;
    const statusCheckboxes = statuses ? statuses.map(status => (
      <Col xs={6} sm key={status.id}>
        <StatusCheckbox
          status={status}
          checked={this.state.statusId.includes(status.id)}
          onChange={this.changeStatusFilter}
        />
      </Col>
    )) : null;

    return (
      <div>
        <section>
          <div className={css.filters}>
            <Row className={css.checkedFilters} top="xs">
              { statusCheckboxes }
            </Row>
            <Row className={css.search}>
              <Col xs={12} sm={6}>
                <Input
                  placeholder="Название задачи"
                  onChange={this.changeNameFilter}
                />
              </Col>
              <Col xs={12} sm={3}>
                <PerformerFilter
                  onPerformerSelect={this.changePerformerFilter}
                  selectedPerformerId={this.state.performerId}
                />
              </Col>
              <Col xs={12} sm={3}>
                <TagsFilter
                  filterFor={'task'}
                  onTagSelect={this.onTagSelect}
                  filterTags={this.state.filterTags}
                />
              </Col>
            </Row>
          </div>
          {
            tasks.map((task) => {
              return <TaskRow
                key={`task-${task.id}`}
                task={task}
                prefix={this.props.project.prefix}
                onClickTag={this.onClickTag}
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
  statuses: PropTypes.array,
  tasksList: PropTypes.array.isRequired
};


const mapStateToProps = state => ({
  tasksList: state.Tasks.tasks,
  pagesCount: state.Tasks.pagesCount,
  project: state.Project.project,
  statuses: state.Dictionaries.taskStatuses
});

const mapDispatchToProps = { getTasks };

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);

