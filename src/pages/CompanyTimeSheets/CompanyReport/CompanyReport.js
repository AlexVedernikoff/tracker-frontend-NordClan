import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment/moment';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import * as css from './CompanyReport.scss';
import localize from './CompanyReport.json';
import { API_URL } from '../../../constants/Settings';
import DatepickerDropdown from '../../../components/DatepickerDropdown/DatepickerDropdown';
import { showNotification } from '../../../actions/Notifications';

const dateFormat2 = 'YYYY-MM-DD';
const dateFormat = 'DD.MM.YYYY';

class CompanyReport extends Component {
  static propTypes = {
    endDate: PropTypes.string,
    lang: PropTypes.string,
    showNotification: PropTypes.func,
    startDate: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

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
    const { lang } = this.props;
    return (
      <div className={css.SprintReport}>
        <Row end="xs" className={css.modile_style}>
          <Col>{localize[lang].FROM} </Col>
          <Col md={2} xs={6}>
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
          <Col>{localize[lang].TO} </Col>
          <Col md={2} xs={4}>
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

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyReport);
