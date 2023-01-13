import React, { Component } from 'react';
import { string, func, arrayOf, array, oneOfType, shape, number } from 'prop-types';
import moment from 'moment/moment';
import Select from '~/components/Select';
import { Col, Row } from 'react-flexbox-grid/lib/index';

import css from './UserReport.scss';
import localize from './UserReport.json';

import { API_URL } from '~/constants/Settings';

import DatepickerDropdown from '~/components/DatepickerDropdown/DatepickerDropdown';

const dateFormat2 = 'YYYY-MM-DD';
const dateFormat = 'DD.MM.YYYY';

type CompanyReportProp = {
  lang: string,
  startDate?: string,
  endDate?: string,
  showNotification: (...args: any) => any,
  list: any[],
  userId: number
}

type CompanyReportState = {
  selectedFrom: string,
  selectedTo: string,
  fromOutlined: boolean,
  toOutlined: boolean,
}

export default class UserReport extends Component<CompanyReportProp, CompanyReportState> {
  static propTypes = {
    startDate: string,
    endDate: string,
    lang: string.isRequired,
    userId: number,
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
    const { lang, userId } = this.props;
    const from = moment(selectedFrom, dateFormat, true).format(dateFormat2);
    const to = moment(selectedTo, dateFormat, true).format(dateFormat2);
    return `?lang=${lang}&startDate=${from}&endDate=${to}&userId=${userId}`;
  };

  inputValidFrom = val => 
    this.setState({ selectedFrom: val, fromOutlined: !this.isDateValid(val) }, this.handleOutline);

  inputValidTo = val => {
    this.setState({ selectedTo: val, toOutlined: !this.isDateValid(val) }, this.handleOutline);
  };

  render() {
    const {
      lang,
    } = this.props;

    return (
      <div className={css.SprintReport}>
        <Row end="xs" className={css.modile_style} style={{marginRight: '0rem' }}>
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
              href={`${API_URL}/user-timesheets/reports/period${this.getQueryParams()}`}
            >
              {localize[lang].REPORT_UNLOAD}
            </a>
          </Col>
        </Row>
      </div>
    );
  }
}
