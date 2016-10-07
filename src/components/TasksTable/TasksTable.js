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

const styles = {
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
  eighty: {
    width: 80
  }
}

const TasksTable = (props) => {
  const {tasks, order, onSortOrderToggle, viewSettings} = props;
  const css = require('./TasksTable.scss');
  return (
    <Paper zDepth={1} rounded={false} style={{marginBottom: 100}}>
      <Table
        fixedHeader
      >
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn tooltip="Статус" className={css.tableHeader} style={{width: 20, padding: 0}}>
              <SortOrderSwitch order={order} value="priority" onChange={onSortOrderToggle} className={css.statusSortBadge} color="#FFFFFF" />
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="The ID" className={css.tableHeader} style={styles.thirty}>
              <SortOrderSwitch label="ID" order={order} value="id" onChange={onSortOrderToggle}/>
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Статус" className={css.tableHeader} style={styles.fifty}>
              <SortOrderSwitch label="Статус" order={order} value="status" onChange={onSortOrderToggle} />
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Название" className={css.tableHeader} style={styles.seventy}>
              <SortOrderSwitch label="Название" order={order} value="name" onChange={onSortOrderToggle}/>
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Автор" className={css.tableHeader} style={styles.seventy}>
                <SortOrderSwitch label="Автор" order={order} value="creatorName" onChange={onSortOrderToggle}/>
            </TableHeaderColumn>

            <TableHeaderColumn />

            <TableHeaderColumn tooltip="Часы" className={css.tableHeader} style={styles.ten}>
              Часы
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Дата" className={css.tableHeader} style={styles.eighty}>
              <SortOrderSwitch label="Дата" order={order} value="planEndDate" onChange={onSortOrderToggle} style={{textAlign: 'center'}} />
            </TableHeaderColumn>

            <TableHeaderColumn tooltip="Настройки" className={css.tableHeader} style={styles.seventy}>
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
            if (task.delimiter) {
              return (<TableRow style={{height: 70}} displayBorder={false} key={index}>
                <TableRowColumn style={{width: 20, padding: 0}}/>
                <TableRowColumn style={{width: 50, padding: 0, paddingBottom: 10, overflow: 'visible'}}>
                  <div style={{display: 'flex', flexDirection: 'column', position: 'absolute', width: 500}}>
                    <div className={css.projectNameContainer}>
                      <KeyboardArrowDown color={"rgba(0, 0, 0, 0.54)"}/>
                      <div className={css.projectName}>{task.projectName}</div>
                    </div>
                    <div className={css.border}/>
                  </div>
                </TableRowColumn>
                <TableRowColumn style={{width: 64, padding: 0}}/>
                <TableRowColumn />
                <TableRowColumn style={{width: 110, maxWidth: 310, padding: 0}}/>
                <TableRowColumn style={{width: 60, padding: '0px 5px'}}/>
                <TableRowColumn style={{width: 60, padding: '0px 5px'}}/>
                <TableRowColumn style={{width: 60, padding: '0px 5px'}}/>
              </TableRow>);
            }
            return (<TaskItem task={task} key={index}
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
  viewSettings: PropTypes.object
};

TasksTable.defaultProps = {
  showGroups: true,
  tableLayout: true
};

export default TasksTable;
