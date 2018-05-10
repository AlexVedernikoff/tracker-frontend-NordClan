import React from 'react';

import { connect } from 'react-redux';

import * as css from './TaskTimeReports.scss';
import { getTaskSpent } from '../../../actions/Task';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import getColor from '../../../utils/Colors';

class TaskTimeReports extends React.Component {
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
      }
    };
  }

  componentDidMount = () => {
    this.loadSpent();
  };

  componentWillReceiveProps(nextProps) {
    this.getStageData(nextProps.timeSpent);
    this.getUserData(nextProps.userTimeSpent);
    this.getRoleData(nextProps.roleTimeSpent);
  }

  getStageData = timeSpent => {
    const stages = [];
    const stagesDataSet = [];
    const stagesColors = [];

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
    const users = [];
    const usersDataSet = [];
    const usersColors = [];

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
    const roles = [];
    const rolesDataSet = [];
    const rolesColors = [];

    getColor.reset();

    if (timeSpent && this.props.roles) {
      for (const role in timeSpent) {
        if (timeSpent.hasOwnProperty(role)) {
          const roleId = role.match(/[\d+]/g);

          if (roleId.length !== 0) {
            for (const id of roleId) {
              const roleName = this.props.roles.find(roleDictionary => roleDictionary.id === Number(id));
              const roleExist = roles.length !== 0 && roles.findIndex(o => o === roleName.name);

              if (roleExist === -1 || !roleExist) {
                roles.push(roleName.name);
                rolesDataSet.push(timeSpent[role]);
                rolesColors.push(getColor());
              } else {
                rolesDataSet[roleExist] = rolesDataSet[roleExist] + timeSpent[role];
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

  render() {
    const { stagesDataSet, stages, stagesColors } = this.state.stageData;
    const { usersDataSet, users, usersColors } = this.state.userData;
    const { rolesDataSet, roles, rolesColors } = this.state.roleData;

    const isStagesDataSet = stagesDataSet.length !== 0;
    const isUsersDataSet = usersDataSet.length !== 0;
    const isRolesDataSet = rolesDataSet.length !== 0;

    return (
      <div className={css.timeReports} style={{ position: 'relative' }}>
        <h3>Отчеты по времени</h3>
        <Row>
          {isStagesDataSet && (
            <Col xs={12}>
              <h4>по стадиям</h4>
              <div className={css.chartContainer}>
                {stages.map((stage, index) => (
                  <div
                    key={index}
                    className={css.horizontalChart}
                    style={{ backgroundColor: stagesColors[index], flexGrow: stagesDataSet[index] }}
                  >
                    {stage}
                    <div className={css.chartNumber}>{stagesDataSet[index]}</div>
                  </div>
                ))}
              </div>
            </Col>
          )}
          {isUsersDataSet && (
            <Col xs={12}>
              <h4>по людям</h4>
              <div className={css.chartContainer}>
                {users.map((user, index) => {
                  const userArr = user.split(' ');
                  return (
                    <div
                      key={index}
                      className={css.horizontalChart}
                      style={{ backgroundColor: usersColors[index], flexGrow: usersDataSet[index] }}
                    >
                      <span>{userArr[0]}</span>
                      <br />
                      <span>{userArr[1]}</span>
                      <div className={css.chartNumber}>{usersDataSet[index]}</div>
                    </div>
                  );
                })}
              </div>
            </Col>
          )}
          {isRolesDataSet && (
            <Col xs={12}>
              <h4>по ролям</h4>
              <div className={css.chartContainer}>
                {roles.map((role, index) => (
                  <div
                    key={index}
                    className={css.horizontalChart}
                    style={{ backgroundColor: rolesColors[index], flexGrow: rolesDataSet[index] }}
                  >
                    <span>{role}</span>
                    <div className={css.chartNumber}>{rolesDataSet[index]}</div>
                  </div>
                ))}
              </div>
            </Col>
          )}
          {!isStagesDataSet &&
            !isUsersDataSet &&
            !isRolesDataSet && <p className={css.noReports}>Нет существующих отчетов</p>}
        </Row>
      </div>
    );
  }
}

TaskTimeReports.propTypes = {
  getTaskSpent: PropTypes.func.isRequired,
  params: PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired
  }),
  roleTimeSpent: PropTypes.object,
  roles: PropTypes.array,
  timeSpent: PropTypes.object,
  userTimeSpent: PropTypes.object
};

const mapStateToProps = state => ({
  timeSpent: state.Task.timeSpent,
  userTimeSpent: state.Task.userTimeSpent,
  roleTimeSpent: state.Task.roleTimeSpent,
  roles: state.Dictionaries.roles
});

const mapDispatchToProps = {
  getTaskSpent
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskTimeReports);
