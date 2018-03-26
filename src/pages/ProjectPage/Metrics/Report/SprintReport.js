import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import SelectDropdown from '../../../../components/SelectDropdown';
import SprintSelector from '../../../../components/SprintSelector';
import _ from 'lodash';
import moment from 'moment/moment';
import DatepickerDropdown from '../../../../components/DatepickerDropdown/DatepickerDropdown';
import { API_URL } from '../../../../constants/Settings';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './SprintReport.scss';

const dateFormat2 = 'YYYY-MM-DD';
const dateFormat = 'DD.MM.YYYY';

class SprintReport extends Component {
  static propTypes = {
    endDate: PropTypes.string,
    project: PropTypes.object,
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
    borderColorFrom: '',
    borderColorTo: ''
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
    if (!_.isEmpty(option) && option.value.id) {
      this.setState({
        selectedName: option.label,
        reportPeriod: option,
        selectedFrom: this.formatDate(option.value.factStartDate),
        selectedTo: this.formatDate(option.value.factFinishDate)
      });
    } else if (!_.isEmpty(option)) {
      this.setState({
        selectedName: option.label,
        reportPeriod: option,
        selectedFrom: this.formatDate(option.value.factStartDate),
        selectedTo: this.formatDate(option.value.factFinishDate)
      });
    } else {
      this.setState({
        selectedName: option.label,
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

  isRangeValid = () => {
    const back_selectedFrom = moment(this.state.selectedFrom, dateFormat, true).format(dateFormat2);
    const back_selectedTo = moment(this.state.selectedTo, dateFormat, true).format(dateFormat2);
    return (
      moment(back_selectedFrom, dateFormat2, true).isValid() &&
      moment(back_selectedTo, dateFormat2, true).isValid() &&
      moment(back_selectedTo).isSameOrAfter(back_selectedFrom)
    );
  };

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
      }))
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
      label: 'За прошлую неделю',
      value: {
        factStartDate: lastWeek.startOf('isoWeek').toDate(),
        factFinishDate: lastWeek.endOf('isoWeek').toDate()
      }
    };
  };

  lastMonthOption = () => {
    const lastMonth = moment().subtract(1, 'month');
    return {
      label: 'За прошлый месяц',
      value: {
        factStartDate: lastMonth.startOf('month').toDate(),
        factFinishDate: lastMonth.endOf('month').toDate()
      }
    };
  };

  fullTimeOption = () => {
    return {
      label: 'За все время',
      value: {
        factStartDate: this.props.startDate,
        factFinishDate: moment()
      }
    };
  };

  wholeProjectTimeOption = () => {
    return {
      label: 'За весь проект',
      value: {
        factStartDate: this.props.startDate,
        factFinishDate: this.props.endDate
      }
    };
  };

  getQueryParams = () => {
    const reportPeriod = this.state;
    const labelName = this.state.selectedName;
    const selectedFrom = moment(this.state.selectedFrom, dateFormat, true).format(dateFormat2);
    const selectedTo = moment(this.state.selectedTo, dateFormat, true).format(dateFormat2);

    const checkSprint = reportPeriod && reportPeriod.value && reportPeriod.value.sprintId;
    const checkDate = selectedFrom && selectedTo;
    const selectedDate = `?startDate=${selectedFrom}&endDate=${selectedTo}`;
    if (checkDate && checkSprint) {
      // запрос отчета по спринту
      const { sprintId, sprintStartDate, sprintFinishDate } = reportPeriod.value;
      const sprintDate = `&sprintStartDate=${sprintStartDate}&sprintFinishDate=${sprintFinishDate}`;
      return `${selectedDate}&sprintId=${sprintId}&label=${labelName}${sprintDate}`;
    } else if (checkDate && reportPeriod) {
      // запрос отчета определенного типа
      return `${selectedDate}&label=${labelName}`;
    } else {
      // запрос отчета по дате, без выбора типа
      return selectedDate;
    }
  };

  keyDownValidFrom = (val, e) => {
    if (e.keyCode === 8) {
      this.setState({ selectedFrom: val });
      return false;
    }
    if (!(e.keyCode > 47 && e.keyCode < 58)) {
      e.preventDefault();
    }
  };
  keyDownValidTo = (val, e) => {
    if (e.keyCode === 8) {
      this.setState({ selectedTo: val });
      return false;
    }
    if (!(e.keyCode > 47 && e.keyCode < 58)) {
      e.preventDefault();
    }
  };
  inputValidFrom = val => {
    /*if (val.length === 2) {
      if (val > 31) {
        val = '';
      } else {
        val += '.';
      }
    }
    if (val.length === 5) {
      if (val.substr(3, 4) > 12) {
        val = val.substring(0, val.length - 2);
      } else {
        val += '.';
      }
    }*/
    if (val.match(/^\d{2}$/) !== null) {
      val = val + '.';
    } else if (val.match(/^\d{2}\.\d{2}$/) !== null) {
      val = val + '.';
    }
    if (moment(val, 'DD.MM.YYYY', true).isValid() === false) {
      this.state.borderColorFrom = 'red';
    } else {
      this.state.borderColorFrom = '#ebebeb';
    }
    /*
    console.log('isValid', val, moment(val, 'DD.MM.YYYY').isValid());
    if (moment(val, 'DD.MM.YYYY').isValid() === false) {
      this.state.borderColorFrom = 'red';
    } else {
      this.state.borderColorFrom = '#ebebeb';
    }*/
    this.setState({ selectedFrom: val });
  };
  inputValidTo = val => {
    if (val.match(/^\d{2}$/) !== null) {
      val = val + '.';
    } else if (val.match(/^\d{2}\.\d{2}$/) !== null) {
      val = val + '.';
    }
    if (moment(val, 'DD.MM.YYYY', true).isValid() === false) {
      this.state.borderColorTo = 'red';
    } else {
      this.state.borderColorTo = '#ebebeb';
    }
    this.setState({ selectedTo: val });
  };

  render() {
    return (
      <div className={css.SprintReport}>
        <Row center="xs">
          <Col xs={12}>
            <h2>Выгрузка отчёта</h2>
          </Col>
        </Row>
        <Row className={css.modile_style}>
          <Col>Спринт: </Col>
          <Col md={4} xs={12}>
            <SprintSelector
              name="sprint"
              placeholder="Выбирите спринт..."
              multi={false}
              value={this.state.reportPeriod}
              onChange={option => this.selectReportPeriod(option)}
              noResultsText="Нет результатов"
              options={this.getSelectOptions()}
            />
          </Col>
          <Col>С: </Col>
          <Col md={2} xs={6}>
            <DatepickerDropdown
              name="dateFrom"
              format={dateFormat}
              value={this.state.selectedFrom}
              onDayChange={this.handleDayFromChange}
              onKeyDown={e => this.keyDownValidFrom(e.target.value, e)}
              onKeyUp={e => this.inputValidFrom(e.target.value.substr(0, 10).trim())}
              placeholder="дд.мм.гггг"
              style={{ borderColor: this.state.borderColorFrom }}
              disabledDataRanges={[{ after: new Date(this.state.selectedTo) }]}
            />
          </Col>
          <Col>По: </Col>
          <Col md={2} xs={4}>
            <DatepickerDropdown
              name="dateTo"
              format={dateFormat}
              value={this.state.selectedTo}
              onDayChange={this.handleDayToChange}
              placeholder="дд.мм.гггг"
              disabledDataRanges={[{ before: new Date(this.state.selectedFrom) }]}
              onKeyDown={e => this.keyDownValidTo(e.target.value, e)}
              style={{ borderColor: this.state.borderColorTo }}
              onKeyUp={e => this.inputValidTo(e.target.value.substr(0, 10).trim())}
            />
          </Col>
          <Col md={2}>
            <a
              className={this.isRangeValid() ? css.downLoad : css.disabled}
              href={`${API_URL}/project/${this.props.project.id}/reports/period${this.getQueryParams()}`}
            >
              Выгрузить отчёт
            </a>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.Project.project,
  sprints: state.Project.project.sprints
});

export default connect(mapStateToProps)(SprintReport);
