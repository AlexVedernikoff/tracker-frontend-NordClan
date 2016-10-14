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

const TasksTable = (props) => {
  const {tasks, order, onSortOrderToggle, viewSettings, handleClick, showTasks} = props;
  const titleIconBottomColor = 'rgba(0, 0, 0, 0.54)';
  const css = require('./TasksTable.scss');
  return (
    <Paper zDepth={1} rounded={false} className={css.paper}>
      <Table fixedHeader>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn tooltip="Статус" className={css.emptyColumn}>
              <SortOrderSwitch order={order} value="priority" onChange={onSortOrderToggle} className={css.statusSortBadge} color="#FFFFFF" />
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="The ID" className={css.width_30}>
              <SortOrderSwitch label="ID" order={order} value="id" onChange={onSortOrderToggle}/>
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Статус" className={css.width_50}>
              <SortOrderSwitch label="Статус" order={order} value="status" onChange={onSortOrderToggle} />
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Название" className={css.width_70}>
              <SortOrderSwitch label="Название" order={order} value="name" onChange={onSortOrderToggle}/>
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Автор" className={css.width_70}>
                <SortOrderSwitch label="Автор" order={order} value="creatorName" onChange={onSortOrderToggle}/>
            </TableHeaderColumn>

            <TableHeaderColumn />

            <TableHeaderColumn tooltip="Часы" className={css.width_10}>
              Часы
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Дата" className={css.width_120}>
              <SortOrderSwitch label="Дата" order={order} value="planEndDate" onChange={onSortOrderToggle} style={{textAlign: 'center'}} />
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Настройки" className={css.width_70}>
              {viewSettings}
            </TableHeaderColumn>

          </TableRow>
        </TableHeader>
        <TableBody deselectOnClickaway showRowHover
          stripedRows={false}
          displayRowCheckbox={false}>
          {tasks.map((task, index, arr) => {
            const iconArrow = (<IconButton className={css.titleIconBottom}>
              {showTasks[task.idProj] ?
                <KeyboardArrowDown color={titleIconBottomColor} /> :
                <KeyboardArrowUp color={titleIconBottomColor} />
              }
            </IconButton>);
            if (task.delimiter) {
              return (<TableRow className={css.height_70} displayBorder={false} key={index}>
                <TableRowColumn className={css.emptyColumn} />
                <TableRowColumn className={css.width_50} />
                <TableRowColumn className={css.headerStatus} />
                <TableRowColumn className={css.tableRowColumnTitle}>
                  <div className={css.header} onClick={() => handleClick(task.idProj)}>
                    <div className={css.projectNameContainer}>
                      {iconArrow}
                      <div className={css.projectName}>{task.projectName}</div>
                    </div>
                    <div className={css.border}/>
                  </div>
                </TableRowColumn>
                <TableRowColumn className={css.tableRowColumnDefault} />
                <TableRowColumn className={css.tableRowColumnDefault} />
                <TableRowColumn className={css.tableRowColumnDefault} />
                <TableRowColumn className={css.tableRowColumnDefault} />
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
