import React from 'react';
import { connect } from 'react-redux';
import sum from 'lodash/sum';
import get from 'lodash/get';

import css from './TaskTimeReports.scss';
import { getTaskSpent } from '../../../actions/Task';
import { createTimesheet } from '../../../actions/Timesheets';
import { getTimesheets } from '../../../actions/Timesheets';
import PropTypes from 'prop-types';
import getColor from '../../../utils/Colors';
import { ADMIN } from '../../../constants/Roles';
import RadioGroup from '../../../components/RadioGroup';
import TimeSheetsHistory from './TimeSheetsHistory.js';
import localize from './taskTimeReports.json';
import { getLocalizedTaskStatuses, getLocalizedRoles } from '../../../selectors/dictionaries';
import { uniq } from 'lodash';

class TaskTimeReports extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      stageData: {
        stages: [],
        stagesDataSet: [],
        stagesColors: []
      },
      userData: {
        users: [],
        usersDataSet: [],
        usersColors: []
      },
      roleData: {
        roles: [],
        rolesDataSet: [],
        rolesColors: []
      },
      chartBy: 'byStage'
    };
  }

  componentDidMount = () => {
    this.loadSpent();
    this.getTimesheets();
  };

  componentWillReceiveProps(nextProps) {
    this.getStageData(nextProps.timeSpent);
    this.getUserData(nextProps.userTimeSpent);
    this.getRoleData(this.getRolesIdsWithoutDublicates(nextProps.roleTimeSpent));
  }

  getRolesIdsWithoutDublicates = roles => {
    const obj = {};
    for (const i in roles) {
      const ids = i.match(/\d+/g);
      obj[`[${uniq(ids)}]`] = roles[i];
    }
    return obj;
  };

  getStageData = timeSpent => {
    const stages: any[] = [];
    const stagesDataSet: any[] = [];
    const stagesColors: any[] = [];

    getColor.reset();

    if (timeSpent) {
      for (const stage in timeSpent) {
        if (timeSpent.hasOwnProperty(stage)) {
          stages.push(stage);
          stagesDataSet.push(timeSpent[stage]);
          stagesColors.push(getColor());
        }
      }

      this.setState({
        stageData: {
          stages,
          stagesDataSet,
          stagesColors
        }
      });
    }
  };

  getUserData = timeSpent => {
    const users: any = [];
    const usersDataSet: any = [];
    const usersColors: any = [];

    getColor.reset();

    if (timeSpent) {
      for (const user in timeSpent) {
        if (timeSpent.hasOwnProperty(user)) {
          users.push(user);
          usersDataSet.push(timeSpent[user]);
          usersColors.push(getColor());
        }
      }

      this.setState({
        userData: {
          users,
          usersDataSet,
          usersColors
        }
      });
    }
  };

  getRoleData = timeSpent => {
    const roles: any[] = [];
    const rolesDataSet: any[] = [];
    const rolesColors: any[] = [];

    getColor.reset();
    if (timeSpent && this.props.roles) {
      for (const role in timeSpent) {
        if (timeSpent.hasOwnProperty(role)) {
          const roleId = role.match(/\d+/g);

          if (roleId && roleId.length !== 0) {
            for (const id of roleId) {
              const roleName = this.props.roles.find(roleDictionary => roleDictionary.id === Number(id));
              if (roleName) {
                if (roles.find(el => el === roleName.name)) {
                  rolesDataSet[roles.findIndex(el => el === roleName.name)] += timeSpent[role];
                } else {
                  roles.push(roleName.name);
                  rolesDataSet.push(timeSpent[role]);
                  rolesColors.push(getColor());
                }
              }
            }
          }
        }
      }

      this.setState({
        roleData: {
          roles,
          rolesDataSet,
          rolesColors
        }
      });
    }
  };

  loadSpent = () => {
    this.props.getTaskSpent(this.props.params.taskId);
  };

  getTimesheets = () => {
    this.props.getTimesheets({ taskId: this.props.params.taskId });
  };

  render() {
    const { stagesDataSet, stages, stagesColors } = this.state.stageData;
    const { usersDataSet, users, usersColors } = this.state.userData;
    const { rolesDataSet, roles, rolesColors } = this.state.roleData;
    const { timesheets, project, task, taskStatuses, lang, user: currentUser, preloaders } = this.props;

    const isStagesDataSet = stagesDataSet.length !== 0;
    const isUsersDataSet = usersDataSet.length !== 0;
    const isRolesDataSet = rolesDataSet.length !== 0;
    const projectUsers = get(project, 'users', []);
    const isCurrentUserIsMember = projectUsers.indexOf(currentUser.id) > -1;

    const pmAccess = this.props.project.users.find(user => user.id === this.props.user.id);

    return (
      <div className={css.timeReports} style={{ position: 'relative' }}>
        {(this.props.globalRole === ADMIN || (pmAccess && (pmAccess.roles.pm || pmAccess.roles.account))) && (
          <div className={css.timeCharts}>
            <h3>{localize[lang].TIMING}</h3>
            <div className={css.viewSwitcher}>
              <RadioGroup
                name="chartView"
                value={this.state.chartBy}
                onChange={chartBy => this.setState({ chartBy })}
                options={[
                  { text: localize[lang].BY_STAGE, value: 'byStage' },
                  { text: localize[lang].BY_USER, value: 'byUser' },
                  { text: localize[lang].BY_ROLE, value: 'byRole' }
                ]}
              />
            </div>
            {isStagesDataSet &&
              this.state.chartBy === 'byStage' && (
                <div className={css.timeChart}>
                  <div className={css.chartContainer}>
                    {stages.map((stage, index) => (
                      <div
                        key={index}
                        className={css.horizontalChart}
                        style={{
                          backgroundColor: stagesColors[index],
                          width: (stagesDataSet[index] / sum(stagesDataSet)) * 100 + '%'
                        }}
                        title={`${stage}: ${stagesDataSet[index]}`}
                      >
                        <div className={css.chartLabelContainer}>{stage}</div>
                        <div className={css.chartNumber}>{stagesDataSet[index]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {isUsersDataSet &&
              this.state.chartBy === 'byUser' && (
                <div className={css.timeChart}>
                  <div className={css.chartContainer}>
                    {users.map((user, index) => {
                      const userArr = user.split(' ');
                      return (
                        <div
                          key={index}
                          className={css.horizontalChart}
                          style={{
                            backgroundColor: usersColors[index],
                            width: (usersDataSet[index] / sum(usersDataSet)) * 100 + '%'
                          }}
                          title={`${user}: ${usersDataSet[index]}`}
                        >
                          <div className={css.chartLabelContainer}>{userArr[0]}</div>
                          <div className={css.chartLabelContainer}>{userArr[1]}</div>
                          <div className={css.chartNumber}>{usersDataSet[index]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            {isRolesDataSet &&
              this.state.chartBy === 'byRole' && (
                <div className={css.timeChart}>
                  <div className={css.chartContainer}>
                    {roles.map((role, index) => (
                      <div
                        key={index}
                        className={css.horizontalChart}
                        style={{
                          backgroundColor: rolesColors[index],
                          width: (rolesDataSet[index] / sum(rolesDataSet)) * 100 + '%'
                        }}
                        title={`${role}: ${rolesDataSet[index]}`}
                      >
                        <div className={css.chartLabelContainer}>{role}</div>
                        <div className={css.chartNumber}>{rolesDataSet[index]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {!isStagesDataSet &&
              !isUsersDataSet &&
              !isRolesDataSet && <p className={css.noReports}>{localize[lang].NO_DATA_DISPLAY}</p>}
            <hr />
          </div>
        )}
        {isCurrentUserIsMember && (
          <TimeSheetsHistory
            users={projectUsers.map(projectUser => projectUser.user)}
            currentUser={currentUser}
            currentTask={task}
            timesheets={timesheets}
            taskStatuses={taskStatuses}
            createTimesheet={this.props.createTimesheet}
            preloaders={preloaders}
            localizeText={{
              selectDropdownStatus: localize[lang].STATUS,
              selectDropdownNoResults: localize[lang].NO_RESULTS,
              isAlreadyCreatedTrue: localize[lang].IS_ALREADY_CREATE,
              isAlreadyCreatedFalse: localize[lang].FILL_FIELDS
            }}
          />
        )}
      </div>
    );
  }
}

(TaskTimeReports as any).propTypes = {
  createTimesheet: PropTypes.func.isRequired,
  getTaskSpent: PropTypes.func.isRequired,
  getTimesheets: PropTypes.func.isRequired,
  globalRole: PropTypes.string.isRequired,
  lang: PropTypes.string,
  params: PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired
  }),
  preloaders: PropTypes.object,
  project: PropTypes.object,
  roleTimeSpent: PropTypes.object,
  roles: PropTypes.array,
  task: PropTypes.object,
  taskStatuses: PropTypes.array,
  timeSpent: PropTypes.object,
  timesheets: PropTypes.array,
  user: PropTypes.object,
  userTimeSpent: PropTypes.object
};

const mapStateToProps = state => ({
  timeSpent: state.Task.timeSpent,
  timesheets: state.Timesheets.list,
  preloaders: state.Timesheets.preloaders,
  taskStatuses: getLocalizedTaskStatuses(state),
  userTimeSpent: state.Task.userTimeSpent,
  roleTimeSpent: state.Task.roleTimeSpent,
  roles: getLocalizedRoles(state),
  user: state.Auth.user,
  project: state.Project.project,
  task: state.Task.task,
  globalRole: state.Auth.user.globalRole,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getTaskSpent,
  getTimesheets,
  createTimesheet
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskTimeReports);
