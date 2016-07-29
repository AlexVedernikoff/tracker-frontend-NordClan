import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { autobind } from 'core-decorators';
import {isLoaded as isTasksLoaded, load as loadTasks, setSearchString} from '../../redux/modules/tasks';
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
      searchString: state.tasks.searchString
    };
  },
  dispatch => bindActionCreators({loadTasks, setSearchString}, dispatch)
)

export default class TasksList extends Component {
  static propTypes = {
    tasks: PropTypes.array.isRequired,
    searchString: PropTypes.string.isRequired,
    loadTasks: PropTypes.func.isRequired,
    setSearchString: PropTypes.func.isRequired
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

  onFilterChange = (value) => {
    // TODO смена стейта фильтра
  };

  get filteredTasks() {
    const {searchString: str} = this.props;
    const query = new RegExp(str, 'ig');
    return this.sortedTasks.filter(task => (!str || str && query.test(task.name)));
  }

  get sortedTasks() {
    const {tasks: tasksList} = this.props;
    // TODO перенести фильтрацию в state и прицепить на виджет
    const defaultChain = [
      {key: 'idProj', order: 'desc'},
      {key: 'priority'}
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
    const {searchString} = this.props; // eslint-disable-line no-shadow
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
              <FilterSearchBar value={searchString} onSearchStringChange = {this.onSearchStringChange} />
              <FilterPanel label="Фильтр:" onFilterChange={this.onFilterChange} >
                <FilterSwitch value="name" label="название" />
                <FilterSwitch value="date" label="дата" />
                <FilterSwitch value="author" label="автор" />
                <FilterSwitch value="assignee" label="исполнитель" />
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
