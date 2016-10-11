import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import Table from 'material-ui/Table/Table';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableRow from 'material-ui/Table/TableRow';
import TableHeader from 'material-ui/Table/TableHeader';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import TableBody from 'material-ui/Table/TableBody';
import SortOrderSwitch from '../../components/SortOrderSwitch/SortOrderSwitch';
import TaskItem from './TaskItem';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import IconButton from 'material-ui/IconButton';

const width = {
  ten: {
    width: 10
  },
  thirty: {
    width: 30
  },
  fifty: {
    width: 50
  },
  seventy: {
    width: 70
  },
  oneHundredTwenty: {
    width: 120
  }
};

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    width: 500,
    left: 0,
    right: 680,
    margin: '0px auto'
  },
  titleIconBottom: {
    top: '-12px',
    left: 10
  },
  titleIconBottomColor: 'rgba(0, 0, 0, 0.54)'
};

const TasksTable = (props) => {
  const {tasks, order, onSortOrderToggle, viewSettings, handleClick, showTasks} = props;
  const css = require('./TasksTable.scss');
  return (
    <Paper zDepth={1} rounded={false} style={{marginBottom: 100}}>
      <Table
        fixedHeader
      >
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn tooltip="Статус" className={css.tableHeader} style={{width: 30, padding: 0}}>
              <SortOrderSwitch order={order} value="priority" onChange={onSortOrderToggle} className={css.statusSortBadge} color="#FFFFFF" />
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="The ID" className={css.tableHeader} style={{width: 60, padding: 0}}>
              <SortOrderSwitch label="ID" order={order} value="id" onChange={onSortOrderToggle}/>
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Статус" className={css.tableHeader} style={width.fifty}>
              <SortOrderSwitch label="Статус" order={order} value="status" onChange={onSortOrderToggle} />
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Название" className={css.tableHeader} style={width.seventy}>
              <SortOrderSwitch label="Название" order={order} value="name" onChange={onSortOrderToggle}/>
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Автор" className={css.tableHeader} style={width.seventy}>
                <SortOrderSwitch label="Автор" order={order} value="creatorName" onChange={onSortOrderToggle}/>
            </TableHeaderColumn>

            <TableHeaderColumn />

            <TableHeaderColumn tooltip="Часы" className={css.tableHeader} style={width.ten}>
              Часы
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Дата" className={css.tableHeader} style={width.oneHundredTwenty}>
              <SortOrderSwitch label="Дата" order={order} value="planEndDate" onChange={onSortOrderToggle} style={{textAlign: 'center'}} />
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Настройки" className={css.tableHeader} style={width.seventy}>
              {viewSettings}
            </TableHeaderColumn>

          </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway
          showRowHover
          stripedRows={false}
          displayRowCheckbox={false}
        >
          {tasks.map((task, index, arr) => {
            const iconArrow = (<IconButton style={styles.titleIconBottom}>
              {showTasks[task.idProj] ?
                <KeyboardArrowDown color={styles.titleIconBottomColor} /> :
                <KeyboardArrowUp color={styles.titleIconBottomColor} />
              }
            </IconButton>);
            if (task.delimiter) {
              return (<TableRow style={{height: 70}} displayBorder={false} key={index}>
                <TableRowColumn style={{width: 20, padding: 0}} />
                <TableRowColumn style={{width: 50}}/>
                <TableRowColumn style={{width: 50, padding: 0, textAlign: 'center'}} />
                <TableRowColumn style={{width: 500, paddingBottom: 10, cursor: 'pointer'}}>
                  <div style={styles.header} onClick={() => handleClick(task.idProj)}>
                    <div className={css.projectNameContainer}>
                      {iconArrow}
                      <div className={css.projectName}>{task.projectName}</div>
                    </div>
                    <div className={css.border}/>
                  </div>
                </TableRowColumn>
                <TableRowColumn style={{width: 70, padding: 0, textAlign: 'center'}}/>
                <TableRowColumn style={{width: 70, padding: 0, textAlign: 'center'}}/>
                <TableRowColumn style={{width: 70, padding: 0, textAlign: 'center'}}/>
                <TableRowColumn style={{width: 70, padding: 0, textAlign: 'center'}}/>
              </TableRow>);
            }
            return (<TaskItem task={task} key={index} showTasks={showTasks}
              displayBorder={(index !== arr.length - 1 && task.priority !== arr[index + 1].priority)}
              displayPriorityBadge={(index === 0 || task.priority !== arr[index - 1].priority)}
            />);
          })}
        </TableBody>
      ))}
      </Table>
    </Paper>
  );
};

TasksTable.propTypes = {
  tasks: PropTypes.array.isRequired,
  order: PropTypes.object.isRequired,
  onSortOrderToggle: PropTypes.func.isRequired,
  viewSettings: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  showTasks: PropTypes.object
};

TasksTable.defaultProps = {
  showGroups: true,
  tableLayout: true
};

export default TasksTable;
