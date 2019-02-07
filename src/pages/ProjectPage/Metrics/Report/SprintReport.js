import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import SprintSelector from '../../../../components/SprintSelector';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment/moment';
import DatepickerDropdown from '../../../../components/DatepickerDropdown/DatepickerDropdown';
import { API_URL } from '../../../../constants/Settings';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './SprintReport.scss';
import localize from './SprintReport.json';
import { showNotification } from '../../../../actions/Notifications';

const dateFormat2 = 'YYYY-MM-DD';
const dateFormat = 'DD.MM.YYYY';

class SprintReport extends Component {
  static propTypes = {
    endDate: PropTypes.string,
    lang: PropTypes.string,
    project: PropTypes.object,
    showNotification: PropTypes.func,
    sprints: PropTypes.array,
    startDate: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  state = {
    reportPeriod: null,
    selectedName: '',
    selectedFrom: '',
    selectedTo: '',
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

  selectReportPeriod = option => {
    this.removeDateOutlines();
    const sprintStart = option && option.value ? this.formatDate(option.value.factStartDate) : null;
    if (!isEmpty(option) && option.value.id) {
      this.setState({
        selectedName: option.label,
        reportPeriod: option,
        reportPeriodStart: sprintStart,
        selectedFrom: sprintStart,
        selectedTo: this.formatDate(option.value.factFinishDate)
      });
    } else if (!isEmpty(option)) {
      //check backlog
      if (option.value === 0) {
        const startDate = this.formatDate(this.props.startDate);
        this.setState({
          selectedName: option.label,
          reportPeriod: option,
          reportPeriodStart: startDate,
          selectedFrom: startDate,
          selectedTo: this.formatDate(this.props.endDate)
        });
      } else {
        this.setState({
          selectedName: option.label,
          reportPeriod: option,
          selectedFrom: sprintStart,
          selectedTo: this.formatDate(option.value.factFinishDate)
        });
      }
    } else {
      this.setState({
        selectedName: '',
        reportPeriod: null,
        selectedFrom: this.formatDate(this.props.startDate),
        selectedTo: moment().format(dateFormat)
      });
    }
  };

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

  getSelectOptions = () => {
    return [
      this.fullTimeOption(),
      this.wholeProjectTimeOption(),
      this.lastWeekOption(),
      this.lastMonthOption(),
      ...this.props.sprints.map(value => ({
        value,
        label: `${value.name} (${moment(value.factStartDate).format('DD.MM.YYYY')} ${
          value.factFinishDate ? `- ${moment(value.factFinishDate).format('DD.MM.YYYY')}` : '- ...'
        })`,
        statusId: value.statusId,
        className: classnames({
          [css.INPROGRESS]: value.statusId === 2,
          [css.sprintMarker]: true,
          [css.FINISHED]: value.statusId === 1
        })
      })),
      {
        value: '0',
        label: 'Backlog',
        className: classnames({
          [css.INPROGRESS]: false,
          [css.sprintMarker]: true
        })
      }
    ];
  };

  sprintOption = value => {
    return {
      label: value.name,
      value: {
        sprintId: value.id,
        // выборка делается по всем ТШ спринта, поэтому отправляется дата начала проекта и текущая
        factStartDate: this.formatDate(this.props.startDate),
        factFinishDate: moment().format(dateFormat),
        sprintStartDate: value.factStartDate,
        sprintFinishDate: value.factFinishDate
      }
    };
  };

  lastWeekOption = () => {
    const lastWeek = moment().subtract(1, 'weeks');
    return {
      label: localize[this.props.lang].WEEK,
      value: {
        id: 'WEEK',
        factStartDate: lastWeek.startOf('isoWeek').toDate(),
        factFinishDate: lastWeek.endOf('isoWeek').toDate()
      }
    };
  };

  lastMonthOption = () => {
    const lastMonth = moment().subtract(1, 'month');
    return {
      label: localize[this.props.lang].MONTH,
      value: {
        id: 'MONTH',
        factStartDate: lastMonth.startOf('month').toDate(),
        factFinishDate: lastMonth.endOf('month').toDate()
      }
    };
  };

  fullTimeOption = () => {
    return {
      label: localize[this.props.lang].ALL_TIME,
      value: {
        id: 'FULL',
        factStartDate: this.props.startDate,
        factFinishDate: moment()
      }
    };
  };

  wholeProjectTimeOption = () => {
    return {
      label: localize[this.props.lang].ALL_PROJECT,
      value: {
        id: 'FULL_PROJECT',
        factStartDate: this.props.startDate,
        factFinishDate: this.props.endDate
      }
    };
  };

  getQueryParams = () => {
    const { reportPeriod, selectedFrom, selectedName, selectedTo } = this.state;
    const { startDate, endDate, lang } = this.props;
    const from = moment(selectedFrom, dateFormat, true).format(dateFormat2);
    const to = moment(selectedTo, dateFormat, true).format(dateFormat2);
    const checkSprint = reportPeriod && reportPeriod.value && typeof reportPeriod.value.id === 'number';
    const backlogCondition = reportPeriod && reportPeriod.value === '0';
    const checkDate = from && to;
    const selectedDate = `?lang=${lang}&startDate=${from}&endDate=${to}`;
    if (checkDate && checkSprint) {
      // запрос отчета по спринту
      const { id, factStartDate, factFinishDate } = reportPeriod.value;
      const sprintDate = `&sprintStartDate=${factStartDate}&sprintFinishDate=${factFinishDate}`;
      return `${selectedDate}&sprintId=${id}&label=${selectedName}${sprintDate}`;
    } else if (checkDate && backlogCondition) {
      // запрос для бэклога
      const sprintDate = `&sprintStartDate=${startDate}&sprintFinishDate=${endDate}`;
      return `${selectedDate}&sprintId=${0}&label=${selectedName}${sprintDate}`;
    } else if (checkDate && reportPeriod) {
      // запрос отчета определенного типа
      return `${selectedDate}&label=${selectedName}`;
    } else {
      // запрос отчета по дате, без выбора типа
      return selectedDate;
    }
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
        <Row center="xs">
          <Col xs={12}>
            <h2>{localize[lang].REPORT_UNLOAD}</h2>
          </Col>
        </Row>
        <Row className={css.modile_style}>
          <Col>{localize[lang].SPRINT}</Col>
          <Col md={4} xs={12}>
            <SprintSelector
              thisClassName="sprintReportSelector"
              multi={false}
              searchable
              clearable
              value={this.state.reportPeriod}
              onChange={option => this.selectReportPeriod(option)}
              options={this.getSelectOptions()}
            />
          </Col>
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
                  before: this.state.reportPeriod && moment(this.state.reportPeriodStart, dateFormat).toDate(),
                  after: this.state.selectedTo && moment(this.state.selectedTo, dateFormat).toDate()
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
              href={`${API_URL}/project/${this.props.project.id}/reports/period${this.getQueryParams()}`}
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
  project: state.Project.project,
  sprints: state.Project.project.sprints,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SprintReport);
