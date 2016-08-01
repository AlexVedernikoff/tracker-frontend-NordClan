import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { autobind } from 'core-decorators';
import {isLoaded as isTasksLoaded, load as loadTasks, setSearchString, setFilterField} from '../../redux/modules/tasks';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import sequentialComparator from '../../utils/sequentialComparator';
import AppHead from '../../components/AppHead/AppHead';
import FilterSearchBar from '../../components/FilterSearchBar/FilterSearchBar';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import FilterSwitch from '../../components/FilterSwitch/FilterSwitch';
import Helmet from 'react-helmet';
import Typography from 'material-ui/styles/typography';
import TasksTable from '../../components/TasksTable/TasksTable';
import Add from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

@connect(
  state => {
    return {
      tasks: state.tasks.data,
      filter: state.tasks.filter
    };
  },
  dispatch => bindActionCreators({loadTasks, setSearchString, setFilterField}, dispatch)
)

export default class TasksList extends Component {
  static propTypes = {
    tasks: PropTypes.array.isRequired,
    filter: PropTypes.shape({
      search: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired
    }),
    loadTasks: PropTypes.func.isRequired,
    setSearchString: PropTypes.func.isRequired,
    setFilterField: PropTypes.func.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired
  };

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

  get filteredTasks() {
    const {filter} = this.props;
    const query = new RegExp(filter.search, 'ig');
    return this.sortedTasks.filter(task => (!filter.search || filter.search && query.test(task[filter.field])));
  }

  get sortedTasks() {
    const {tasks: tasksList} = this.props;
    // TODO перенести сортировку в state и прицепить на виджет
    const defaultChain = [
      {key: 'idProj', order: 'desc'},
      {key: 'priority', order: 'asc'}
    ];
    return tasksList.sort((prev, next) => {
      return sequentialComparator(prev, next, defaultChain);
    });
  }

  get tasksByProject() {
    const filtered = this.filteredTasks;
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
    const {filter} = this.props; // eslint-disable-line no-shadow
    const theme = this.context.muiTheme;
    const css = require('./TasksList.scss');
    const styles = {
      h1: {
        color: theme.rawTheme.palette.primary1Color,
        fontWeight: Typography.fontWeightMedium
      }
    };
    return (
      <div>
        <AppHead/>
        <Helmet title="Task List"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1 className={css.h1} style={styles.h1}>Мои задачи</h1>
              <FilterSearchBar value={filter.search} onSearchStringChange = {this.onSearchStringChange} />
              <FilterPanel label="Фильтр:" onFilterChange={this.onFilterChange} >
                <FilterSwitch active={filter.field} value="projectName" label="проект" />
                <FilterSwitch active={filter.field} value="name" label="название" />
                <FilterSwitch active={filter.field} value="creatorName" label="автор" />
                <FilterSwitch active={filter.field} value="status" label="статус" />
              </FilterPanel>

              <TasksTable tasks={this.tasksByProject} />

            </Col>
          </Row>
        </Grid>
        <FloatingActionButton style={{position: 'fixed', bottom: 35, right: 60}}>
          <Add />
        </FloatingActionButton>
      </div>
    );
  }
}
