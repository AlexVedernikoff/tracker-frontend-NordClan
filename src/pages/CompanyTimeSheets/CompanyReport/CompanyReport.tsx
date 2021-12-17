import React, { Component } from 'react';
import { string, func, arrayOf, array, oneOfType, shape, number } from 'prop-types';
import moment from 'moment/moment';
import Select from '~/components/Select';
import { Col, Row } from 'react-flexbox-grid/lib/index';

import * as css from './CompanyReport.scss';
import localize from './CompanyReport.json';

import { API_URL } from '~/constants/Settings';

import DatepickerDropdown from '~/components/DatepickerDropdown/DatepickerDropdown';
import { CompanyDepartment } from '~/pages/types';

const dateFormat2 = 'YYYY-MM-DD';
const dateFormat = 'DD.MM.YYYY';

type CompanyReportProp = {
  lang: string,
  departments: CompanyDepartment[],
  departmentsFilter: {label: string, value: number },
  approvedStatusFilter: {label: string, id: number },
  startDate?: string
  endDate?: string,
  setDepartmentsFilter: (...args: any) => any,
  setUsersFilter: (...args: any) => any,
  setApprovedStatus: (...args: any) => any,
  showNotification: (...args: any) => any,
  selectApprovedStatus: {name: string, id: number }[],
  usersFilter: {label: string, value: number },
  list: any[]
}

type CompanyReportState = {
  selectedFrom: string,
  selectedTo: string,
  fromOutlined: boolean,
  toOutlined: boolean,
}

export default class CompanyReport extends Component<CompanyReportProp, CompanyReportState> {
  static propTypes = {
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
    usersFilter: arrayOf(
      shape({
        label: string.isRequired,
        value: number.isRequired
      })
    ),
    selectApprovedStatus: arrayOf(
      shape({
        label: string.isRequired,
        id: number.isRequired
      })
    ),
    approvedStatusFilter: arrayOf(
      shape({
        label: string.isRequired,
        id: number.isRequired
      })
    ),
    endDate: string,
    lang: string.isRequired,
    setDepartmentsFilter: func.isRequired,
    setUsersFilter: func.isRequired,
    showNotification: func.isRequired,
    startDate: string,
    list: oneOfType([
      arrayOf(
        shape({
          id: number.isRequired,
          fullNameRu: string.isRequired,
          fullNameEn: string.isRequired
        })
      ).isRequired,
      array
    ]) ,
  };

  state = {
    selectedFrom: moment()
      .startOf('month')
      .format(dateFormat),
    selectedTo: moment()
      .endOf('day')
      .format(dateFormat),
    fromOutlined: false,
    toOutlined: false
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
    this.setState({ selectedFrom: this.formatDate(date) });
  };

  handleDayToChange = date => {
    this.setState({ selectedTo: this.formatDate(date) });
  };

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
    const { selectedFrom, selectedTo } = this.state;
    const { lang } = this.props;
    const from = moment(selectedFrom, dateFormat, true).format(dateFormat2);
    const to = moment(selectedTo, dateFormat, true).format(dateFormat2);
    return `?lang=${lang}&startDate=${from}&endDate=${to}`;
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
      setDepartmentsFilter,
      departmentsFilter,
      list,
      usersFilter,
      setUsersFilter,
      setApprovedStatus,
      selectApprovedStatus,
      approvedStatusFilter,
    } = this.props;

    return (
      <div className={css.SprintReport}>
        <Row end="xs" className={css.modile_style}>
          <Col md={2} xs={6}>
            <Select
              name="globalRole"
              multi
              backspaceRemoves={false}
              placeholder={localize[lang].APPROVED_STATUS_TIMESHEETS}
              className={css.selectType}
              options={selectApprovedStatus.map(el => ({ label: el.name, value: el.id }))}
              value={approvedStatusFilter}
              onChange={setApprovedStatus}
            />
          </Col>
          <Col md={2} xs={6}>
            <Select
                name="globalRole"
                multi
                backspaceRemoves={false}
                placeholder={localize[lang].SELECT_USERS}
                className={css.selectType}
                options={list.map(el => ({ label: el[`fullName${lang.charAt(0).toUpperCase() + lang.slice(1)}`], value: el.id }))}
                value={usersFilter}
                onChange={setUsersFilter}
            />
          </Col>
          <Col md={2} xs={6}>
            <Select
              name="globalRole"
              multi
              backspaceRemoves={false}
              className={css.selectType}
              options={departments.map(el => ({ label: el.name, value: el.id }))}
              value={departmentsFilter}
              onChange={setDepartmentsFilter}
            />
          </Col>
          <Col md={2} xs={6} className={css.datepickerWrap}>
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
          <Col md={2} xs={4} className={css.datepickerWrap}>
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
          <Col md={2}>
            <a
              className={this.allDatesValid() ? css.downLoad : css.disabled}
              href={`${API_URL}/company-timesheets/reports/period${this.getQueryParams()}`}
            >
              {localize[lang].REPORT_UNLOAD}
            </a>
          </Col>
        </Row>
      </div>
    );
  }
}
