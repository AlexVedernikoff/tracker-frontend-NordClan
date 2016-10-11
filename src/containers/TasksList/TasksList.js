import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { autobind } from 'core-decorators';
import {isLoaded as isTasksLoaded, load as loadTasks, setSearchString, setFilterField, toggleTasksSortOrder, toggleTasksGroups, toggleTasksTableLayout} from '../../redux/modules/tasks';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import sequentialComparator from '../../utils/sequentialComparator';
import sortOrder from '../../utils/sortOrder';
// import AppHead from '../../components/AppHead/AppHead';
import FilterSearchBar from '../../components/FilterSearchBar/FilterSearchBar';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import FilterSwitch from '../../components/FilterSwitch/FilterSwitch';
import Helmet from 'react-helmet';
import Typography from 'material-ui/styles/typography';
import TasksBoard from '../../components/TasksBoard/TasksBoard';
import TasksTable from '../../components/TasksTable/TasksTable';
import TasksListViewSettings from '../../components/TasksListViewSettings/TasksListViewSettings';
import Add from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

@connect(
  state => {
    return {
      tasks: state.tasks.data,
      filter: state.tasks.filter,
      order: state.tasks.order,
      showGroups: state.tasks.showGroups,
      tableLayout: state.tasks.tableLayout
    };
  },
  dispatch => bindActionCreators({
    loadTasks, setSearchString, setFilterField,
    toggleTasksSortOrder, toggleTasksGroups, toggleTasksTableLayout
  }, dispatch)
)

export default class TasksList extends Component {
  static propTypes = {
    tasks: PropTypes.array.isRequired,
    filter: PropTypes.shape({
      search: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired
    }),
    order: PropTypes.object.isRequired,
    showGroups: PropTypes.bool.isRequired,
    tableLayout: PropTypes.bool.isRequired,
    loadTasks: PropTypes.func.isRequired,
    setSearchString: PropTypes.func.isRequired,
    setFilterField: PropTypes.func.isRequired,
    toggleTasksSortOrder: PropTypes.func.isRequired,
    toggleTasksGroups: PropTypes.func.isRequired,
    toggleTasksTableLayout: PropTypes.func.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired
  };

  constructor() {
    super()

    this.state = {
      showTasks: {}
    }
  }

  componentDidMount() {
    const {store} = this.context;
    if (!isTasksLoaded(store.getState())) {
      this.props.loadTasks();
    }
  }

  @autobind
  onSearchStringChange(event) {
    this.props.setSearchString(event.target.value);
  }

  @autobind
  onFilterChange(value) {
    this.props.setFilterField(value);
  }

  @autobind
  onSortOrderToggle(column) {
    this.props.toggleTasksSortOrder(column);
  }

  @autobind
  onGroupVisibilityToggle() {
    this.props.toggleTasksGroups();
  }

  @autobind
  onLayoutToggle() {
    this.props.toggleTasksTableLayout();
  }

  @autobind
  handleClick(task) {
    let tasksProject = this.tasksByProject;
    let state = this.state.showTasks;

    if(state[task] !== undefined) {
      state[task] = !state[task];
    } else {
      state[task] = false;
    }

    this.setState({showTasks: state});

    //При нажатии на заголовок проекта, выводим все таски проекта
    //Пока не используется
    let taskToggle = Object.keys(tasksProject)
      .filter(id => tasksProject[id].idProj == task && tasksProject[id].id !== undefined)
      .map(taskToggle => tasksProject[taskToggle].id)
  }

  get filteredTasks() {
    const {filter} = this.props;
    const query = new RegExp(filter.search, 'ig');
    return this.sortedTasks.filter(task => (!filter.search || filter.search && query.test(task[filter.field])));
  }

  get sortedTasks() {
    const {tasks: tasksList, order, showGroups} = this.props;
    const orderChain = showGroups ? [{
      key: 'projectName',
      order: 'ASC'
    }] : [];
    [
      'priority', 'id', 'status', 'name', 'creatorName', 'planEndDate'
    ].forEach(key => {
      if (order.hasOwnProperty(key) && sortOrder.isSignificant(order[key])) {
        orderChain.push({key, order: order[key]});
      }
    });
    return tasksList.sort((prev, next) => {
      return sequentialComparator(prev, next, orderChain);
    });
  }

  get tasksByProject() {
    const {showGroups, tableLayout} = this.props;
    const filtered = this.filteredTasks;
    if (!showGroups || !tableLayout) {
      return filtered;
    }
    const groupedTasks = filtered.slice(0);
    const filteredTasksProjects = filtered.map(task => (task.idProj));
    // TODO растащить лапшу по утилитам
    filtered.map(task => (task.idProj)).filter((value, index, self) => {
      return self.indexOf(value) === index;
    }).map((projectId, index) => {
      const delimiterPosition = filteredTasksProjects.indexOf(projectId) + index;
      groupedTasks.splice(delimiterPosition, 0, {
        delimiter: true,
        idProj: projectId,
        projectName: groupedTasks[delimiterPosition].projectName
      });
    });
    return groupedTasks;
  }

  render() {
    const {filter, showGroups, tableLayout, order: tasksOrder} = this.props; // eslint-disable-line no-shadow
    const theme = this.context.muiTheme;
    const css = require('./TasksList.scss');
    const styles = {
      h1: {
        color: theme.rawTheme.palette.primary1Color,
        fontWeight: Typography.fontWeightMedium
      }
    };
    const viewSettings = (<TasksListViewSettings
      showGroups={showGroups} onGroupVisibilityToggle={this.onGroupVisibilityToggle}
      tableLayout={tableLayout} onLayoutToggle={this.onLayoutToggle}
    />);

    const renderFilterTask = (
      <FilterPanel label="Фильтр:" onFilterChange={this.onFilterChange} >
        <FilterSwitch active={filter.field} value="projectName" label="проект" />
        <FilterSwitch active={filter.field} value="name" label="название" />
        <FilterSwitch active={filter.field} value="creatorName" label="автор" />
        <FilterSwitch active={filter.field} value="status" label="статус" />
      </FilterPanel>
    );

    return (
      <div>
        <Helmet title="Мои задачи"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1 className={css.h1} style={styles.h1}>Мои задачи</h1>

              <FilterSearchBar value={filter.search}
                onSearchStringChange = {this.onSearchStringChange} />

              {renderFilterTask}

              {tableLayout && (
                <TasksTable
                  showTasks={this.state.showTasks}
                  handleClick={this.handleClick}
                  tasks={this.tasksByProject}
                  onSortOrderToggle={this.onSortOrderToggle}
                  order={tasksOrder}
                  viewSettings={viewSettings}
                />
              ) || (
                <TasksBoard
                  tasks={this.tasksByProject}
                  viewSettings={viewSettings}
                  theme={theme}
                />
              )}
            </Col>
          </Row>
        </Grid>
        <FloatingActionButton style={{position: 'fixed', bottom: 35, right: 60}} backgroundColor="#F06292">
          <Add />
        </FloatingActionButton>
      </div>
    );
  }
}
