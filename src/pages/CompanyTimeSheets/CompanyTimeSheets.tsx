import React, { Component } from 'react';
import { func, string, object, arrayOf, shape, number, bool } from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

import CompanyReport from './CompanyReport';
import Title from '~/components/Title';
import localize from './CompanyTimeSheets.json';

import TimesheetsTable from '~/components/TimesheetsTable';
import { CompanyDepartment, TimeSheetsItem, Project } from '~/pages/types';
import { Roles } from '~/constants/Roles';
import { UserType } from './CompanyReport/CompanyReport';
import {
  TIMESHEET_REPORT_SEND_FOR_CONFIRMATION,
  TIMESHEET_STATUS_APPROVED,
  TIMESHEET_STATUS_SUBMITTED,
} from '~/constants/Timesheets';

type CompanyTimeSheetsProps = {
  approveTimesheets: (...args: any[]) => any,
  averageNumberOfEmployees?: string,
  changeProjectWeek: (...args: any[]) => any,
  dateBegin: string,
  dateEnd: string,
  departments: CompanyDepartment[],
  selectApprovedStatus: { name: string, id: number }[],
  getAverageNumberOfEmployees: (...args: any[]) => any,
  getCompanyTimesheets: (...args: any[]) => any,
  getDepartments: (...args: any[]) => any,
  getAllProjects: () => Promise<Pick<Project, 'id' | 'name'>[]>,
  lang: string,
  list: TimeSheetsItem[],
  params: any,
  rejectTimesheets: (...args: any[]) => any,
  startingDay: any,
  submitUserTimesheets: (...args: any[]) => any,
}

export default class CompanyTimeSheets extends Component<CompanyTimeSheetsProps, any> {
  static propTypes = {
    approveTimesheets: func.isRequired,
    averageNumberOfEmployees: string,
    changeProjectWeek: func.isRequired,
    dateBegin: string,
    dateEnd: string,
    departments: arrayOf(
      shape({
        id: number.isRequired,
        name: string.isRequired,
        psId: string.isRequired
      }),
    ).isRequired,
    getAllProjects: func.isRequired,
    getAverageNumberOfEmployees: func.isRequired,
    getCompanyTimesheets: func.isRequired,
    getDepartments: func.isRequired,
    lang: string,
    list: arrayOf(
      shape({
        department: arrayOf(
          shape({
            name: string.isRequired,
            id: number.isRequired
          }),
        ),
        dismissalDate: string,
        employmentDate: string,
        firstNameEn: string,
        firstNameRu: string,
        fullNameEn: string,
        fullNameRu: string,
        global_role: string,
        id: number.isRequired,
        lastNameEn: string,
        lastNameRu: string,
        timesheet: arrayOf(
          shape({
            comment: string,
            id: number.isRequired,
            isBillable: bool.isRequired,
            onDate: string,
            project: shape({
              id: number.isRequired,
              name: string,
              prefix: string
            }),
            projectId: number.isRequired,
            spentTime: string,
            sprint: shape({
              id: number.isRequired,
              name: string
            }),
            statusId: number,
            task: shape({
              id: number.isRequired,
              name: string,
              project: shape({
                id: number.isRequired,
                name: string
              }),
              sprint: shape({ id: number, name: string }),
              typeId: number
            }),
            taskId: number.isRequired,
            taskStatusId: number.isRequired,
            typeId: number,
            updatedAt: string,
            user: shape({
              active: number,
              id: number.isRequired,
              delete_date: string,
              employment_date: string,
              firstNameEn: string,
              firstNameRu: string,
              fullNameEn: string,
              fullNameRu: string,
              lastNameEn: string,
              lastNameRu: string
            }),
            userId: number.isRequired,
            userRoleId: string
          }),
        )
      }),
    ).isRequired,
    params: object,
    rejectTimesheets: func.isRequired,
    startingDay: object,
    submitUserTimesheets: func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      departmentsFilter: [],
      usersFilter: [],
      userTypeFilter: [],
      approvedStatusFilter: [],
      selectApprovedStatus: [
        { name: `${localize[this.props.lang].TIMESHEETS_CONFIRMED}`, id: TIMESHEET_STATUS_APPROVED },
        { name: `${localize[this.props.lang].TIMESHEETS_REPORT_CONFIRM}`, id: TIMESHEET_STATUS_SUBMITTED },
        { name: `${localize[this.props.lang].REPORT_SEND_FOR_CONFIRMATION}`, id: TIMESHEET_REPORT_SEND_FOR_CONFIRMATION }
      ],
      projectsFilter: [],
      projects: []
    };
  }

  componentDidMount() {
    this.getCurrentDepartments();
    this.getCompanyTimeSheetsInfo();
    this.getAllProjects().then(projects => this.setState({ projects }));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dateBegin !== this.props.dateBegin || prevProps.dateEnd !== this.props.dateEnd) {
      this.getCurrentDepartments();
    }
  }

  getCurrentDepartments = () => {
    const { getDepartments, dateBegin, dateEnd } = this.props;
    return getDepartments({ dateBegin, dateEnd });
  };

  getAllProjects = () => {
    const { getAllProjects } = this.props;
    return getAllProjects();
  };

  getCompanyTimeSheets = () => {
    const { dateBegin, dateEnd, getCompanyTimesheets, getAverageNumberOfEmployees } = this.props;

    getCompanyTimesheets({ dateBegin, dateEnd });
  };

  getCompanyTimeSheetsInfo = () => {
    const { dateBegin, dateEnd, getAverageNumberOfEmployees } = this.props;

    this.getCompanyTimeSheets();
    getAverageNumberOfEmployees({ dateBegin, dateEnd });
  };

  setDepartmentsFilter = departmentsFilter => {
    this.setState({ departmentsFilter });
  };

  setUsersFilter = usersFilter => {
    this.setState({ usersFilter });
  };

  setUserTypeFilter = userTypeFilter => {
    this.setState({ userTypeFilter });
  };

  setProjectFilter = projectsFilter => {
    this.setState({ projectsFilter });
  };

  setApprovedStatus = approvedStatusFilter => {
    this.setState({ approvedStatusFilter });
  };

  get tableItems() {
    const { list } = this.props;
    const { departmentsFilter, usersFilter, projectsFilter, userTypeFilter } = this.state;
    let filteredList: TimeSheetsItem[] = cloneDeep(list || []);

    if (Array.isArray(filteredList) && filteredList.length) {
      if (projectsFilter.length) {
        filteredList = filteredList.filter((user) => projectsFilter.some(item => user.projects.includes(item.value)));
      }
      if (usersFilter.length) {
        filteredList = filteredList.filter((user) => usersFilter.some((item) => user.id === item.value)) || [];
      }

      if (userTypeFilter?.length === 1) {
        filteredList = filteredList.reduce((filteredUsers: TimeSheetsItem[], user: TimeSheetsItem) => {
          if (userTypeFilter[0].value == user.global_role) {
            filteredUsers.push(user)
            return filteredUsers
          }

          if (userTypeFilter[0].value !== UserType.EXTERNAL_USER && user.global_role !== Roles.EXTERNAL_USER) {
            filteredUsers.push(user)
          }

          return filteredUsers;
        }, [])
      }

      if (departmentsFilter.length) {
        filteredList = filteredList.filter((user) => {
          return user && user.department && user.department.some((department) => departmentsFilter.some((item) => item.value === department.id));
        });
      }
    }
    return filteredList || [];
  }

  render() {
    const {
      list,
      dateBegin,
      dateEnd,
      lang,
      startingDay,
      averageNumberOfEmployees,
      approveTimesheets,
      rejectTimesheets,
      submitUserTimesheets,
      changeProjectWeek,
      departments
    } = this.props;
    const {
      departmentsFilter,
      usersFilter,
      userTypeFilter,
      projectsFilter,
      projects,
      selectApprovedStatus,
      approvedStatusFilter
    } = this.state;

    return (
      <div>
        <Title render={`[Epic] - ${localize[lang].COMPANY_TIMESHEETS_REPORT}`} />
        <section>
          <h1>{localize[lang].COMPANY_TIMESHEETS_REPORT}</h1>
          <hr />
          <CompanyReport
            approvedStatusFilter={approvedStatusFilter}
            selectApprovedStatus={selectApprovedStatus}
            departments={departments}
            setDepartmentsFilter={this.setDepartmentsFilter}
            setUsersFilter={this.setUsersFilter}
            setUserTypeFilter={this.setUserTypeFilter}
            setProjectsFilter={this.setProjectFilter}
            departmentsFilter={departmentsFilter}
            setApprovedStatus={this.setApprovedStatus}
            usersFilter={usersFilter}
            userTypeFilter={userTypeFilter}
            projectsFilter={projectsFilter}
            lang={lang}
            list={list}
            projects={projects}
          />
          {list && (
            <TimesheetsTable
              approvedStatusFilter={approvedStatusFilter}
              approveTimesheets={approveTimesheets}
              rejectTimesheets={rejectTimesheets}
              submitTimesheets={submitUserTimesheets}
              changeProjectWeek={changeProjectWeek}
              dateBegin={dateBegin}
              dateEnd={dateEnd}
              isSingleProjectPage={false}
              // getProjectTimesheets={() => {}}
              lang={lang}
              list={this.tableItems}
              params={{ projectId: '' }}
              startingDay={startingDay}
              averageNumberOfEmployees={averageNumberOfEmployees}
              refreshData={this.getCompanyTimeSheets}
            />
          )}
        </section>
      </div>
    );
  }
}
