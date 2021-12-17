import React, { Component } from 'react';
import { func, string, object, arrayOf, shape, number, bool } from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';

import CompanyReport from './CompanyReport';
import Title from '~/components/Title';
import localize from './CompanyTimeSheets.json';

import TimesheetsTable from '~/components/TimesheetsTable';
import { CompanyDepartment, TimeSheetsItem } from '~/pages/types';


type CompanyTimeSheetsProps = {
  approveTimesheets: (...args: any[]) => any,
  averageNumberOfEmployees?: string,
  changeProjectWeek: (...args: any[]) => any,
  dateBegin: string,
  dateEnd: string,
  departments: CompanyDepartment[],
  selectApprovedStatus: {name: string, id: number }[],
  getAverageNumberOfEmployees: (...args: any[]) => any,
  getCompanyTimesheets: (...args: any[]) => any,
  getDepartments: (...args: any[]) => any,
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
      })
    ).isRequired,
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
          })
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
          })
        )
      })
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
      approvedStatusFilter:[],
      selectApprovedStatus: [
        {name: `${localize[this.props.lang].TIMESHEETS_CONFIRMED}`, id: 1 },
        {name: `${localize[this.props.lang].TIMESHEETS_REPORT_CONFIRM}`, id: 2 },
        {name: `${localize[this.props.lang].REPORT_SEND_FOR_CONFIRMATION}`, id: 3 }
      ],

    };
  }

  componentDidMount() {
    this.getCurrentDepartments();
    this.getCompanyTimeSheets();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dateBegin !== this.props.dateBegin || prevProps.dateEnd !== this.props.dateEnd) {
      this.getCurrentDepartments();
    }
  }

  getCurrentDepartments = () => {
    const { getDepartments, dateBegin, dateEnd } = this.props;
    return getDepartments({ dateBegin, dateEnd });
  }

  getCompanyTimeSheets = () => {
    const { dateBegin, dateEnd, getCompanyTimesheets, getAverageNumberOfEmployees } = this.props;

    getCompanyTimesheets({ dateBegin, dateEnd });
    getAverageNumberOfEmployees({ dateBegin, dateEnd });
  };

  setDepartmentsFilter = departmentsFilter => {
    this.setState({ departmentsFilter });
  };

  setUsersFilter = usersFilter => {
    this.setState({ usersFilter });
  };

  setApprovedStatus = approvedStatusFilter => {
    this.setState({ approvedStatusFilter });
  };

  get tableItems() {
    const { list } = this.props;
    const { departmentsFilter, usersFilter } = this.state;
    let filteredList: TimeSheetsItem[] = cloneDeep(list || []);

    if (Array.isArray(filteredList) && filteredList.length) {
      if (usersFilter.length) {
        filteredList = filteredList.filter((user) => usersFilter.some((item) => user.id === item.value)) || [];
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
    const { departmentsFilter, usersFilter, selectApprovedStatus, approvedStatusFilter } = this.state;

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
            departmentsFilter={departmentsFilter}
            setApprovedStatus={this.setApprovedStatus}
            usersFilter={usersFilter}
            lang={lang}
            list={list}
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
            />
          )}
        </section>
      </div>
    );
  }
}
