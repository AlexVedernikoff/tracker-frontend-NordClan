import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {load} from 'redux/modules/tasks';
import Table from 'material-ui/Table/Table';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableRow from 'material-ui/Table/TableRow';
import TableHeader from 'material-ui/Table/TableHeader';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import TableBody from 'material-ui/Table/TableBody';
// import TableFooter from 'material-ui/lib/table/table-footer';
import {isLoaded as isTasksLoaded, load as loadTasks} from 'redux/modules/tasks';
import { Link } from 'react-router';
import {Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import {asyncConnect} from 'redux-async-connect';
import AppHead from '../../components/AppHead/AppHead';
import DeadlineDate from '../../components/DeadlineDate/DeadlineDate';
import Helmet from 'react-helmet';
import Paper from 'material-ui/Paper';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import Search from 'material-ui/svg-icons/action/search';
import Typography from 'material-ui/styles/typography';
import Add from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import * as Colors from 'material-ui/styles/colors';
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TaskProgressBar from '../../components/TaskProgressBar/TaskProgressBar';
import NewCommentBage from '../../components/NewCommentBage/NewCommentBage';
import {AccountSwitch} from '../../components/Icons/Icons';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isTasksLoaded(getState())) {
      return dispatch(loadTasks());
    }
  }
}])
@connect(
  state => ({tasks: state.tasks.data}),
  dispatch => bindActionCreators({load}, dispatch))

export default class TasksList extends Component {
  static propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      status: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      about: PropTypes.string.isRequired,
      deadline: PropTypes.string.isRequired
    })),
    load: PropTypes.func.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired
  };


  render() {
    const {tasks} = this.props; // eslint-disable-line no-shadow
    const theme = this.context.muiTheme;
    const styles = {
      border: {borderBottom: '2px solid #707070', marginLeft: '-20px', maxWidth: 250},
      allBorder: {borderBottom: 'none'},
      status: {
        height: '100%',
        borderLeftColor: theme.rawTheme.palette.primary1Color,
        borderLeftWidth: '5px',
        borderLeftStyle: 'solid',
        position: 'relative',
        color: 'white'
      },
      statusBage: {
        backgroundColor: theme.rawTheme.palette.primary1Color,
        height: 20,
        textAlign: 'center',
        borderBottomRightRadius: 2,
        borderTopRightRadius: 2
      },
      statusSortBage: {
        backgroundColor: '#BDBDBD',
        height: 20,
        textAlign: 'center',
        borderRadius: 2,
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
              <Paper zDepth={1} style={{marginTop: 50, backgroundColor: 'white', height: 50, display: 'flex'}}>
                <Search color={theme.rawTheme.palette.primary1Color} style={{margin: '12px 20px'}}/>
                <input type="text" style={{width: '100%', border: 'none', boxShadow: 'none', outline: 'none'}}
                       placeholder="Введите текст"></input>
              </Paper>
              <div style={{marginBottom: 50, display: 'flex', padding: '0px 20px', justifyContent: 'flex-start' }}>
                <span style={{fontSize: '12', color: theme.rawTheme.palette.accent3Color, padding: 5}}>Фильтр:</span>
                <span style={{fontSize: 13, display: 'block', padding: '5px 10px', marginRight: 2, cursor: 'pointer'}}>название</span>
                <span
                  style={{color: theme.rawTheme.palette.alternateTextColor, backgroundColor: Colors.purple700, fontSize: 13, display: 'block', padding: '5px 10px', marginRight: 2, cursor: 'pointer', marginTop: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.12)'}}>дата</span>
                <span
                  style={{color: theme.rawTheme.palette.alternateTextColor, backgroundColor: Colors.purple700, fontSize: 13, display: 'block', padding: '5px 10px', marginRight: 2, cursor: 'pointer', marginTop: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.12)'}}>автор</span>
                <span
                  style={{color: theme.rawTheme.palette.alternateTextColor, backgroundColor: Colors.purple700, fontSize: 13, display: 'block', padding: '5px 10px', marginRight: 2, cursor: 'pointer', marginTop: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.12)'}}>исполнитель</span>
              </div>

              <Paper zDepth={1} rounded={false} style={{marginBottom: 100}}>
                <Table
                  fixedHeader
                  fixedFooter
                  selectable
                  multiSelectable={false}
                  style={{backgroundColor: 'white'}}
                >
                  <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn tooltip="Статус" style={{width: 20, padding: 0, ...styles.tableHeader}}>
                        <div style={styles.statusSortBage}>
                          <ArrowUpward style={{height: 16, width: 16, padding: 2}} color={"#FFFFFF"}/>
                        </div>
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The ID" style={{...styles.tableHeader, width: 50}}>
                        <div style={{cursor: 'pointer', display: 'flex'}}><ArrowUpward style={{height: 16}}
                                                                                       color={"rgba(0, 0, 0, 0.54)"}/>
                          <div>ID</div>
                        </div>
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The Status" style={{...styles.tableHeader, width: 64}}>
                        <div style={{cursor: 'pointer', display: 'flex'}}><ArrowDownward style={{height: 16}}
                                                                                         color={"rgba(0, 0, 0, 0.87)"}/>
                          <div>Статус</div>
                        </div>
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The Name" style={{...styles.tableHeader, minWidth: 310}}>
                        <div style={{display: 'flex'}}>
                          <div>Название </div>
                          <div style={{cursor: 'pointer', display: 'flex'}}><ArrowUpward style={{height: 16}}
                                                                        color={"rgba(0, 0, 0, 0.54)"}/>
                            <div>Автор</div>
                          </div>
                        </div>
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The Status" style={{...styles.tableHeader, width: 100}}>
                        <div>Часы</div>
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The Status" style={{...styles.tableHeader, width: 75}}>
                        <div style={{cursor: 'pointer', display: 'flex'}}><ArrowUpward style={{height: 16}}
                                                                                       color={"rgba(0, 0, 0, 0.54)"}/>
                          <div>Дата</div>
                        </div>
                      </TableHeaderColumn>
                      <TableHeaderColumn tooltip="The Status" style={{...styles.tableHeader, width: 50}}/>
                      <TableHeaderColumn style={{...styles.tableHeader, width: 75}}>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                          <IconMenu
                            iconButtonElement={<IconButton style={{paddingTop: 20, paddingBottom: 0}}><MoreVertIcon style={{marginBottom: -4}} color={"rgba(0, 0, 0, 0.54)"}/></IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                          >
                            <MenuItem primaryText="Refresh"/>
                            <MenuItem primaryText="Send feedback"/>
                            <MenuItem primaryText="Settings"/>
                            <MenuItem primaryText="Help"/>
                            <MenuItem primaryText="Sign out"/>
                          </IconMenu>
                        </div>
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
                      <TableRowColumn style={{minWidth: 310, padding: 0}}/>
                      <TableRowColumn style={{ width: 110, maxWidth: 310, padding: 0}}/>
                      <TableRowColumn style={{width: 60, padding: '0px 5px'}}/>
                      <TableRowColumn style={{width: 60, padding: '0px 5px'}}/>
                      <TableRowColumn style={{width: 60, padding: '0px 5px'}}/>
                    </TableRow>
                    { /* <TableRow style={{height: 70}} displayBorder={false}>
                     <TableRowColumn colspan={7} style={{paddingLeft: 0, overflow: 'visible'}}>
                     <div style={{display: 'flex', flexDirection: 'column'}}>
                     <div style={{...styles.projectNameContainer}}>
                     <KeyboardArrowDown color={"rgba(0, 0, 0, 0.54)"}/>
                     <div style={styles.projectName}>Simtrack</div>
                     </div>
                     <div style={styles.border}/>
                     </div>
                     </TableRowColumn>
                     </TableRow> */}
                    {tasks.map((row, index, arr) => (
                      <TableRow key={index} selectable
                                displayBorder={(index !== arr.length - 1 && row.status !== arr[index + 1].status)}
                      >
                        <TableRowColumn style={{width: 20, padding: 0}}>
                          <div
                            style={styles.status}>
                            {(index === 0 || row.status !== arr[index - 1].status) &&
                            <div style={styles.statusBage}>2</div>
                            }
                          </div>
                        </TableRowColumn>
                        <TableRowColumn style={{padding: 0, minWidth: 50}}>{index}12343</TableRowColumn>
                        <TableRowColumn style={{minWidth: 64, padding: 5, textAlign: 'center'}}><Add /></TableRowColumn>
                        <TableRowColumn style={{minWidth: 310, padding: 0}}>
                          <div style={{display: 'flex', flexDirection: 'column'}}>
                            <Link to={`/task/${row._id}`} style={{color: 'rgba(0, 0, 0, 0.87)'}}>Нарисовать макет сайта под все разрешения</Link>
                            <div style={{color: 'rgba(0, 0, 0, 0.54)'}}>Создал(а) задачу {row.name}</div>
                          </div>
                        </TableRowColumn>
                        <TableRowColumn style={{minWidth: 110, padding: 0}}>
                          <TaskProgressBar spent={10} planned={100} spentLabel={'Потрачено'}
                                           plannedLabel={'Планируемое'}
                                           style={{marginBottom: 10}}/>
                        </TableRowColumn>
                        <TableRowColumn style={{width: 210, minWidth: 110, padding: '0px 5px', textAlign: 'center'}}>
                          <DeadlineDate date={{day: 16, month: 'мая'}} style={{fontSize: 18}}/>
                        </TableRowColumn>
                        <TableRowColumn style={{minWidth: 60, padding: '0px 5px', textAlign: 'center'}}>
                          <NewCommentBage/>
                        </TableRowColumn>
                        <TableRowColumn style={{minWidth: 60, padding: '0px 5px', textAlign: 'center'}}>
                          <AccountSwitch/>
                        </TableRowColumn>
                      </TableRow>
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
