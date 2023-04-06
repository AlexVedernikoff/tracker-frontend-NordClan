import React, { Component } from 'react';
import { string, func, arrayOf, array, oneOfType, shape, number, bool } from 'prop-types';
import moment from 'moment/moment';
import Select from '~/components/Select';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import css from './CompanyReport.scss';
import localize from './CompanyReport.json';
import { API_URL } from '~/constants/Settings';
import DatepickerDropdown from '~/components/DatepickerDropdown/DatepickerDropdown';
import { CompanyDepartment } from '~/pages/types';
import { sortAlphabetically } from '~/utils/sortAlphabetically';

export enum UserType {
  EXTERNAL_USER = 'EXTERNAL_USER',
  MEMBER = 'NOT_EXTERNAL_USER'
}

const dateFormat2 = 'YYYY-MM-DD';
const dateFormat = 'DD.MM.YYYY';

type CompanyReportProp = {
  lang: string,
  departments: CompanyDepartment[],
  departmentsFilter: { label: string, value: number },
  projectsFilter: { label: string, value: number },
  approvedStatusFilter: { label: string, id: number },
  startDate?: string,
  endDate?: string,
  setDepartmentsFilter: (...args: any) => any,
  setUsersFilter: (...args: any) => any,
  setUserTypeFilter: (...args: any) => any,
  setProjectsFilter: (...args: any) => any,
  setApprovedStatus: (...args: any) => any,
  showNotification: (...args: any) => any,
  selectApprovedStatus: { name: string, id: number, nameRu, isBlocked: boolean }[],
  usersFilter: { label: string, value: number },
  userTypeFilter: { label: string, value: string },
  list: any[],
  projects: any[]
}

type CompanyReportState = {
  selectedFrom: string,
  selectedTo: string,
  fromOutlined: boolean,
  toOutlined: boolean,
  userType: UserType | null,
  projectIds: number[],
  departmentIds: number[],
  userIds: number[],
  statusIds: number[]
}

export default class CompanyReport extends Component<CompanyReportProp, CompanyReportState> {
  static propTypes = {
    approvedStatusFilter: arrayOf(
      shape({
        label: string.isRequired,
        id: number.isRequired
      })
    ),
    departments: arrayOf(
      shape({
        id: number.isRequired,
        name: string.isRequired,
        psId: string.isRequired
      })
    ).isRequired,
    departmentsFilter: arrayOf(
      shape({
        label: string.isRequired,
        value: number.isRequired
      })
    ),
    endDate: string,
    lang: string.isRequired,
    list: oneOfType([
      arrayOf(
        shape({
          id: number.isRequired,
          fullNameRu: string.isRequired,
          fullNameEn: string.isRequired
        })
      ).isRequired,
      array
    ]),
    projects: arrayOf(
      shape({
        id: number.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    projectsFilter: arrayOf(
      shape({
        label: string.isRequired,
        value: number.isRequired
      })
    ),
    selectApprovedStatus: arrayOf(
      shape({
        label: string,
        id: number
      })
    ),
    setDepartmentsFilter: func.isRequired,
    setProjectsFilter: func.isRequired,
    setUsersFilter: func.isRequired,
    setUserTypeFilter: func.isRequired,
    showNotification: func.isRequired,
    startDate: string,
    userTypeFilter: arrayOf(
      shape({
        label: string.isRequired,
        value: string.isRequired
      })
    ),
    usersFilter: arrayOf(
      shape({
        label: string.isRequired,
        value: number.isRequired
      })
    )
  };

  state = {
    selectedFrom: moment()
      .startOf('month')
      .format(dateFormat),
    selectedTo: moment()
      .endOf('day')
      .format(dateFormat),
    fromOutlined: false,
    toOutlined: false,
    userType: null,
    projectIds: [],
    departmentIds: [],
    userIds: [],
    statusIds: []
  };

  componentWillReceiveProps(newProps) {
    if (newProps.startDate) {
      this.updatePickers({
        selectedFrom: this.formatDate(newProps.startDate),
        selectedTo: moment().format(dateFormat)
      });
    }
  }

  formatDate = date => date && moment(date).format(dateFormat);

  updatePickers = value => {
    const { selectedFrom, selectedTo } = value;
    this.setState({ selectedFrom, selectedTo });
  };

  handleDayFromChange = date => {
    this.setState({
      selectedFrom: this.formatDate(date),
      fromOutlined: !this.isDateValid(this.formatDate(date))
    });
  };

  handleDayToChange = date => {
    this.setState({
      selectedTo: this.formatDate(date),
      toOutlined: !this.isDateValid(this.formatDate(date))
    });
  };

  handleUserType = userType => {
    this.props.setUserTypeFilter(userType)
    this.setState({
      userType: userType.length === 1 ? userType[0].value : null
    })
  }

  handleProjects = projectIds => {
    this.props.setProjectsFilter(projectIds)
    this.setState({ projectIds: projectIds.map(p => p.value) })
  }

  handleDepartments = departmentIds => {
    this.props.setDepartmentsFilter(departmentIds)
    this.setState({ departmentIds: departmentIds.map(p => p.value) })
  }

  handleUsers = userIds => {
    this.props.setUsersFilter(userIds)
    this.setState({ userIds: userIds.map(p => p.value) })
  }

  handleStatuses = statusIds => {
    this.props.setApprovedStatus(statusIds)
    this.setState({ statusIds: statusIds.map(p => p.value) })
  }

  isRangeInvalid = () => {
    const fromDate = this.parseDate(this.state.selectedFrom);
    const toDate = this.parseDate(this.state.selectedTo);

    return fromDate.isValid() && toDate.isValid() && fromDate.isAfter(toDate);
  };

  allDatesValid = () => {
    const fromDate = this.parseDate(this.state.selectedFrom);
    const toDate = this.parseDate(this.state.selectedTo);

    return fromDate.isValid() && toDate.isValid() && fromDate.isSameOrBefore(toDate);
  };

  getBorderColor = outlined => {
    return outlined ? 'red' : '#ebebeb';
  };

  parseDate = dateString => moment(dateString, dateFormat, true);

  isDateValid = dateString => this.parseDate(dateString).isValid();

  handleOutline = () => {
    if (this.isRangeInvalid()) {
      this.outlineDateInputs();
      this.props.showNotification({ message: localize[this.props.lang].DATE_RANGE_ERROR, type: 'error' });
    } else if (this.allDatesValid()) {
      this.removeDateOutlines();
    }
  };

  outlineDateInputs = () =>
    this.setState({
      fromOutlined: true,
      toOutlined: true
    });

  removeDateOutlines = () =>
    this.setState({
      fromOutlined: false,
      toOutlined: false
    });

  getQueryParams = () => {
    const {
      selectedFrom,
      selectedTo,
      userType,
      projectIds,
      departmentIds,
      userIds,
      statusIds
    } = this.state;
    const { lang } = this.props;
    const from = moment(selectedFrom, dateFormat, true).format(dateFormat2);
    const to = moment(selectedTo, dateFormat, true).format(dateFormat2);
    const result = new URLSearchParams();
    result.append('lang', lang);
    result.append('startDate', from);
    result.append('endDate', to);

    if (userType) {
      result.append('userType', userType);
    }

    if (projectIds.length > 0) {
      result.append('projects', JSON.stringify(projectIds));
    }

    if (departmentIds.length > 0) {
      result.append('departments', JSON.stringify(departmentIds));
    }

    if (userIds.length > 0) {
      result.append('users', JSON.stringify(userIds));
    }

    if (statusIds.length > 0) {
      result.append('statuses', JSON.stringify(statusIds));
    }
    return result.toString();
  };

  inputValidFrom = val =>
    this.setState({ selectedFrom: val, fromOutlined: !this.isDateValid(val) }, this.handleOutline);

  inputValidTo = val => {
    this.setState({ selectedTo: val, toOutlined: !this.isDateValid(val) }, this.handleOutline);
  };

  render() {
    const {
      lang,
      departments,
      projects,
      departmentsFilter,
      list,
      usersFilter,
      userTypeFilter,
      projectsFilter,
      selectApprovedStatus,
      approvedStatusFilter
    } = this.props;
    
    const sortProjects = sortAlphabetically(projects, 'name');
    
    const prefLocal = lang.charAt(0).toUpperCase() + lang.slice(1);
    
    return (
      <div className={css.SprintReport}>
        <Row end="xs" className={css.modile_style}>
          <Col className={css.filter_field} md={4} xs={12}>
            <Select
              name="globalRole"
              multi
              backspaceRemoves={false}
              placeholder={localize[lang].SELECT_PROJECTS}
              className={css.selectType}
              options={sortProjects.map(el => ({ label: el.name, value: el.id }))}
              value={projectsFilter}
              onChange={this.handleProjects}
            />
          </Col>
          <Col className={css.filter_field} md={4} xs={6}>
            <Select
              name="globalRole"
              multi
              backspaceRemoves={false}
              placeholder={localize[lang].APPROVED_STATUS_TIMESHEETS}
              className={css.selectType}
              options={selectApprovedStatus.map(el => ({ label: lang === 'ru' ? el.nameRu : el.name, value: el.id }))}
              value={approvedStatusFilter}
              onChange={this.handleStatuses}
            />
          </Col>
          <Col className={css.filter_field} md={4} xs={6}>
            <Select
              name="globalRole"
              multi
              backspaceRemoves={false}
              placeholder={localize[lang].SELECT_DEPARTMENTS}
              className={css.selectType}
              options={departments.map(el => ({ label: el.name, value: el.id }))}
              value={departmentsFilter}
              onChange={this.handleDepartments}
            />
          </Col>
          <Col className={css.filter_field} md={6} xs={6}>
            <Select
              name="userType"
              multi
              backspaceRemoves={false}
              placeholder={localize[lang].SELECT_USER_TYPE}
              className={css.selectType}
              options={[
                { label: localize[lang].EXTERNAL_USERS, value: UserType.EXTERNAL_USER },
                { label: localize[lang].COMPANY_MEMBERS, value: UserType.MEMBER }
              ]}
              value={userTypeFilter}
              onChange={this.handleUserType}
            />
          </Col>
          <Col className={css.filter_field} md={6} xs={6}>
            <Select
              name="globalRole"
              multi
              backspaceRemoves={false}
              placeholder={localize[lang].SELECT_USERS}
              className={css.selectType}
              options={list.map(el => ({ label: `${el[`lastName${prefLocal}`]} ${el[`firstName${prefLocal}`]}`, value: el.id }))}
              value={usersFilter}
              onChange={this.handleUsers}
            />
          </Col> 
        </Row>
        <Row end="xs" className={css.modile_style}>
          <Col md={4} xs={6} className={css.datepickerWrap}>
            <Col className={css.datepickerLabel}>{localize[lang].FROM}</Col>
            <DatepickerDropdown
              name="dateFrom"
              format={dateFormat}
              value={this.state.selectedFrom}
              onDayChange={this.handleDayFromChange}
              onKeyUp={e => this.inputValidFrom(e.target.value.substr(0, 10).trim())}
              placeholder={localize[lang].DATE}
              style={{ borderColor: this.getBorderColor(this.state.fromOutlined) }}
              disabledDataRanges={[
                {
                  after: (this.state.selectedTo && moment(this.state.selectedTo, dateFormat).toDate()) || new Date()
                }
              ]}
            />
          </Col>
          <Col md={4} xs={4} className={css.datepickerWrap}>
            <Col className={css.datepickerLabel}>{localize[lang].TO}</Col>
            <DatepickerDropdown
              name="dateTo"
              format={dateFormat}
              value={this.state.selectedTo}
              onDayChange={this.handleDayToChange}
              placeholder={localize[lang].DATE}
              disabledDataRanges={[
                {
                  before: this.state.selectedFrom && moment(this.state.selectedFrom, dateFormat).toDate(),
                  after: new Date()
                }
              ]}
              style={{ borderColor: this.getBorderColor(this.state.toOutlined) }}
              onKeyUp={e => this.inputValidTo(e.target.value.substr(0, 10).trim())}
            />
          </Col>
          <Col>
            <a
              className={this.allDatesValid() ? css.downLoad : css.disabled}
              href={`${API_URL}/company-timesheets/reports/period?${this.getQueryParams()}`}
            >
              {localize[lang].REPORT_UNLOAD}
            </a>
          </Col>
        </Row>
      </div>
    );
  }
}
