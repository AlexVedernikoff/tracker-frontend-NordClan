import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectDropdown from '../../../../components/SelectDropdown';
import _ from 'lodash';
import moment from 'moment/moment';
import DatepickerDropdown from '../../../../components/DatepickerDropdown/DatepickerDropdown';
import { API_URL } from '../../../../constants/Settings';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './SprintReport.scss';

const dateFormat = 'YYYY-MM-DD';

class SprintReport extends Component {

  static propTypes = {
    endDate: PropTypes.string,
    project: PropTypes.object,
    sprints: PropTypes.array,
    startDate: PropTypes.string
  };

  constructor (props) {
    super(props);
  }

  state = {
    reportPeriod: null,
    selectedFrom: '',
    selectedTo: ''
  };

  componentWillReceiveProps (newProps) {
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
        reportPeriod: option,
        selectedFrom: this.formatDate(option.factStartDate),
        selectedTo: this.formatDate(option.factFinishDate)
      });
    } else if (!_.isEmpty(option)) {
      this.setState({
        reportPeriod: option,
        selectedFrom: this.formatDate(option.value.factStartDate),
        selectedTo: this.formatDate(option.value.factFinishDate)
      });
    } else {
      this.setState({
        reportPeriod: null,
        selectedFrom: this.formatDate(this.props.startDate),
        selectedTo: moment().format(dateFormat)
      });
    }
  };

  formatDate = date => date && moment(date).format(dateFormat);

  updatePickers = value => {
    const {selectedFrom, selectedTo} = value;
    this.setState({selectedFrom, selectedTo});
  };

  handleDayFromChange = date => {
    this.setState({ selectedFrom: this.formatDate(date)});
  };
  handleDayToChange = date => {
    this.setState({ selectedTo: this.formatDate(date)});
  };

  isRangeValid = () => {
    return (!this.state.selectedFrom && !this.state.selectedTo)
      || moment(this.state.selectedFrom, 'YYYY-MM-DD', true).isValid()
      && moment(this.state.selectedTo, 'YYYY-MM-DD', true).isValid()
      && moment(this.state.selectedTo).isAfter(this.state.selectedFrom);
  };

  getSelectOptions = () => {
    return [
      this.fullTimeOption(),
      this.wholeProjectTimeOption(),
      this.lastWeekOption(),
      this.lastMonthOption(),
      ...this.props.sprints.map(value => this.sprintOption(value))
    ];
  }

  sprintOption = (value) => ({
    value,
    label: value.name,
    // выборка делается по всем ТШ спринта, поэтому отправляется дата начала проекта и текущая
    factStartDate: this.formatDate(this.props.startDate),
    factFinishDate: moment().format(dateFormat)
  })

  lastWeekOption = () => {
    const lastWeek = moment().subtract(1, 'weeks');
    return {
      label: 'За прошлую неделю',
      value: {
        factStartDate: lastWeek.startOf('isoWeek').toDate(),
        factFinishDate: lastWeek.endOf('isoWeek').toDate()
      }
    };
  }

  lastMonthOption = () => {
    const lastMonth = moment().subtract(1, 'month');
    return {
      label: 'За прошлый месяц',
      value: {
        factStartDate: lastMonth.startOf('month').toDate(),
        factFinishDate: lastMonth.endOf('month').toDate()
      }
    };
  }

  fullTimeOption = () => {
    return {
      label: 'За все время',
      value: {
        factStartDate: this.formatDate(this.props.startDate),
        factFinishDate: moment().format(dateFormat)
      }
    };
  }

  wholeProjectTimeOption = () => {
    return {
      label: 'За весь проект',
      value: {
        factStartDate: this.formatDate(this.props.startDate),
        factFinishDate: this.formatDate(this.props.endDate)
      }
    };
  }

  getQueryParams = () => {
    const { selectedFrom, selectedTo, reportPeriod } = this.state;
    const sprintId = reportPeriod && reportPeriod.value && reportPeriod.value.id ? reportPeriod.value.id : null;
    if (selectedFrom && selectedTo && sprintId) {
      return `?startDate=${selectedFrom}&endDate=${selectedTo}&sprintId=${sprintId}`;
    } else {
      return `?startDate=${selectedFrom}&endDate=${selectedTo}`;
    }
  }

  render () {
    const dateFrom = this.state.selectedFrom ? moment(this.state.selectedFrom).format('DD.MM.YYYY') : '';
    const dateTo = this.state.selectedTo ? moment(this.state.selectedTo).format('DD.MM.YYYY') : '';
    return (
        <div className={css.SprintReport}>
            <Row center="xs">
                <Col md={3} xs={12}><h2>Выгрузка отчёта</h2></Col>
            </Row>
            <Row className = {css.modile_style}>
                <Col>Спринт: </Col>
                <Col md={4} xs={12}>
                    <SelectDropdown
                        name="sprint"
                        placeholder="Выбирите спринт..."
                        multi={false}
                        value={this.state.reportPeriod}
                        onChange={(option) => this.selectReportPeriod(option)}
                        noResultsText="Нет результатов"
                        options={this.getSelectOptions()}
                    />
                </Col>
                <Col>С: </Col>
                <Col md={2} xs={6}>
                    <DatepickerDropdown
                        name="dateFrom"
                        format={dateFormat}
                        value={dateFrom}
                        onDayChange={this.handleDayFromChange}
                        placeholder="с"
                        disabledDataRanges={[{after: new Date(this.state.selectedTo)}]}
                    />
                </Col>
                <Col>По: </Col>
                <Col md={2} xs={4}>
                    <DatepickerDropdown
                        name="dateTo"
                        format={dateFormat}
                        value={dateTo}
                        onDayChange={this.handleDayToChange}
                        placeholder="по"
                        disabledDataRanges={[{before: new Date(this.state.selectedFrom)}]}
                    />
                </Col>
                <Col md={2}>
                    <a className={this.isRangeValid() ? css.downLoad : css.disabled}
                       href={`${API_URL}/project/${this.props.project.id}/reports/period${this.getQueryParams()}`}>
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
