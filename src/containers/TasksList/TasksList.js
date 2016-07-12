import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Table from 'material-ui/Table/Table';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableRow from 'material-ui/Table/TableRow';
import TableHeader from 'material-ui/Table/TableHeader';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import TableBody from 'material-ui/Table/TableBody';
import {isLoaded as isTasksLoaded, load as loadTasks} from 'redux/modules/tasks';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import {asyncConnect} from 'redux-connect';
import AppHead from '../../components/AppHead/AppHead';
import FilterSearchBar from '../../components/FilterSearchBar/FilterSearchBar';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import FilterSwitch from '../../components/FilterSwitch/FilterSwitch';
import SortOrderSwitch from '../../components/SortOrderSwitch/SortOrderSwitch';
import TaskItem from '../../components/TaskItem/TaskItem';
import TasksListViewSettings from '../../components/TasksListViewSettings/TasksListViewSettings';
import Helmet from 'react-helmet';
import Paper from 'material-ui/Paper';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import Typography from 'material-ui/styles/typography';
import Add from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

@asyncConnect([{
  // deferred: true, //TODO загрузка данных после роутинга (если придумается зачем)
  key: 'tasks',
  promise: ({store: {dispatch, getState}}) => {
    if (!isTasksLoaded(getState())) {
      return dispatch(loadTasks());
    }
    return Promise.resolve(getState().tasks);
  }}],
  state => ({tasks: state.tasks.data}),
  dispatch => bindActionCreators({loadTasks}, dispatch)
)

export default class TasksList extends Component {
  static propTypes = {
    tasks: PropTypes.array.isRequired,
    loadTasks: PropTypes.func.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired
  };

  onFilterChange = (value) => {
    // TODO смена стейта фильтра
  };

  render() {
    const {tasks} = this.props; // eslint-disable-line no-shadow
    const theme = this.context.muiTheme;
    const styles = {
      border: {borderBottom: '2px solid #707070', marginLeft: '-20px', maxWidth: 250},
      allBorder: {borderBottom: 'none'},

      statusSortBadge: {
        marginBottom: '-2px',
        backgroundColor: '#BDBDBD',
        height: 16,
        padding: 2,
        textAlign: 'center',
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
        cursor: 'pointer'
      },
      projectName: {
        fontSize: 18,
        marginLeft: 10,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      },
      projectNameContainer: {
        display: 'flex',
        paddingBottom: 10,
        maxWidth: 230
      },
      h1: {
        color: theme.rawTheme.palette.primary1Color,
        fontWeight: Typography.fontWeightMedium,
        fontSize: '34px',
        paddingTop: 19,
        marginTop: 55,
        WebkitMarginAfter: '0em'
      },
      tableHeader: {
        verticalAlign: 'bottom',
        padding: 0,
        paddingBottom: 5
      }
    };
    return (
      <div>
        <AppHead/>
        <Helmet title="Task List"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1 style={styles.h1}>Мои задачи</h1>
              <FilterSearchBar />
              <FilterPanel label="Фильтр:" onFilterChange={this.onFilterChange} >
                <FilterSwitch value="name" label="название" />
                <FilterSwitch value="date" label="дата" />
                <FilterSwitch value="author" label="автор" />
                <FilterSwitch value="assignee" label="исполнитель" />
              </FilterPanel>

              <Paper zDepth={1} rounded={false} style={{marginBottom: 100}}>
                <Table
                  fixedHeader
                  selectable
                  multiSelectable={false}
                >
                  <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn tooltip="Статус" style={{width: 20, padding: 0, ...styles.tableHeader}}>
                        <SortOrderSwitch style={styles.statusSortBadge} color="#FFFFFF" />
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The ID" style={{...styles.tableHeader, width: 50}}>
                        <SortOrderSwitch label="ID" order="asc" />
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The Status" style={{...styles.tableHeader, width: 64}}>
                        <SortOrderSwitch label="Статус" order="desc" />
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The Name" style={{...styles.tableHeader}}>
                        <div style={{display: 'flex'}}>
                          <div>Название </div>
                          <SortOrderSwitch label="Автор" />
                        </div>
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The Status" style={{...styles.tableHeader, width: 110, textAlign: 'center'}}>
                        Часы
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The Status" style={{...styles.tableHeader, width: 70}}>
                        <SortOrderSwitch label="Дата" style={{textAlign: 'center'}} />
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The Status" style={{...styles.tableHeader, width: 70}}/>
                      <TableHeaderColumn style={{...styles.tableHeader, width: 70}}>
                        <TasksListViewSettings />
                      </TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    deselectOnClickaway
                    showRowHover
                    stripedRows={false}
                    displayRowCheckbox={false}
                  >
                    <TableRow style={{height: 70}} displayBorder={false}>
                      <TableRowColumn style={{width: 20, padding: 0}}/>
                      <TableRowColumn style={{width: 50, padding: 0, paddingBottom: 10, overflow: 'visible'}}>
                        <div style={{display: 'flex', flexDirection: 'column', position: 'absolute', width: 500}}>
                          <div style={{...styles.projectNameContainer}}>
                            <KeyboardArrowDown color={"rgba(0, 0, 0, 0.54)"}/>
                            <div style={styles.projectName}>Simtrack</div>
                          </div>
                          <div style={styles.border}/>
                        </div>
                      </TableRowColumn>
                      <TableRowColumn style={{width: 64, padding: 0}}/>
                      <TableRowColumn />
                      <TableRowColumn style={{ width: 110, maxWidth: 310, padding: 0}}/>
                      <TableRowColumn style={{width: 60, padding: '0px 5px'}}/>
                      <TableRowColumn style={{width: 60, padding: '0px 5px'}}/>
                      <TableRowColumn style={{width: 60, padding: '0px 5px'}}/>
                    </TableRow>
                    {tasks && tasks.map((task, index, arr) => (
                      <TaskItem task={task} key={index}
                        displayBorder={(index !== arr.length - 1 && task.priority !== arr[index + 1].priority)}
                        displayPriorityBadge={(index === 0 || task.priority !== arr[index - 1].priority)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Paper>
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
