import React, { Component } from 'react';
import { func, string, object, arrayOf, shape, number, bool } from 'prop-types';

import filter from 'lodash/filter';
import some from 'lodash/some';
import eq from 'lodash/eq';

import CompanyReport from './CompanyReport';
import Title from '../../components/Title';
import localize from './CompanyTimeSheets.json';

import TimesheetsTable from '../../components/TimesheetsTable';

export default class CompanyTimeSheets extends Component<any, any> {
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
      departmentsFilter: []
    };
  }

  componentDidMount() {
    const { getDepartments } = this.props;

    getDepartments();
    this.getCompanyTimeSheets();
  }

  getCompanyTimeSheets = () => {
    const { dateBegin, dateEnd, getCompanyTimesheets, getAverageNumberOfEmployees } = this.props;

    getCompanyTimesheets({ dateBegin, dateEnd });
    getAverageNumberOfEmployees({ dateBegin, dateEnd });
  };

  setDepartmentsFilter = departmentsFilter => {
    this.setState({ departmentsFilter });
  };

  get tableItems() {
    const { list } = this.props;
    const { departmentsFilter } = this.state;

    const listIsArrayStrategy = () => {
      const departmentsFilterIsNotEmptyStrategy = () =>
        filter(list, listElement =>
          some(listElement.department, departmentItem =>
            some(departmentsFilter, departmentsFilterItem => eq(departmentsFilterItem.value, departmentItem.id))
          )
        );
      const departmentsFilterIsEmptyStrategy = () => list;

      return departmentsFilter.length ? departmentsFilterIsNotEmptyStrategy() : departmentsFilterIsEmptyStrategy();
    };
    const listIsNotArrayStrategy = () => [];

    return Array.isArray(list) ? listIsArrayStrategy() : listIsNotArrayStrategy();
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
    const { departmentsFilter } = this.state;

    return (
      <div>
        <Title render={`[Epic] - ${localize[lang].COMPANY_TIMESHEETS_REPORT}`} />
        <section>
          <h1>{localize[lang].COMPANY_TIMESHEETS_REPORT}</h1>
          <hr />
          <CompanyReport
            departments={departments}
            setDepartmentsFilter={this.setDepartmentsFilter}
            departmentsFilter={departmentsFilter}
          />
          {list && (
            <TimesheetsTable
              approveTimesheets={approveTimesheets}
              rejectTimesheets={rejectTimesheets}
              submitTimesheets={submitUserTimesheets}
              changeProjectWeek={changeProjectWeek}
              dateBegin={dateBegin}
              dateEnd={dateEnd}
              getProjectTimesheets={() => {}}
              lang={lang}
              list={this.tableItems}
              params={{}}
              startingDay={startingDay}
              averageNumberOfEmployees={averageNumberOfEmployees}
            />
          )}
        </section>
      </div>
    );
  }
}
