import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import SelectDropdown from '../../../../components/SelectDropdown';
import SprintSelector from '../../../../components/SprintSelector';
import * as Icons from '../../../../components/Icons';
import _ from 'lodash';
import moment from 'moment/moment';
import DatepickerDropdown from '../../../../components/DatepickerDropdown/DatepickerDropdown';
import { API_URL } from '../../../../constants/Settings';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './SprintReport.scss';

const dateFormat = 'DD.MM.YYYY';

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
    selectedTo: '',
    optionStatus: ''
  };

  componentWillReceiveProps (newProps) {
    if (newProps.startDate) {
      this.updatePickers({
        selectedFrom: this.formatDate(newProps.startDate),
        selectedTo: moment().format(dateFormat)
      });
    }
  }

  selectReportPeriod = (option) => {
    if (!_.isEmpty(option) && option.value.id) {
      this.setState({
        reportPeriod: option,
        selectedFrom: this.formatDate(option.value.factStartDate),
        selectedTo: this.formatDate(option.value.factFinishDate)
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

  formatDate = (date) => date && moment(date).format(dateFormat);

  updatePickers = (value) => {
    const { selectedFrom, selectedTo } = value;
    this.setState({ selectedFrom, selectedTo });
  };

  handleDayFromChange = (date) => {
    this.setState({ selectedFrom: this.formatDate(date) });
  };
  handleDayToChange = (date) => {
    this.setState({ selectedTo: this.formatDate(date) });
  };

  isRangeValid = () => {
    return (
      (!this.state.selectedFrom && !this.state.selectedTo)
      || (moment(this.state.selectedFrom, dateFormat, true).isValid()
        && moment(this.state.selectedTo, dateFormat, true).isValid()
        && moment(this.state.selectedTo, dateFormat).isAfter(moment(this.state.selectedFrom, dateFormat)))
    );
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
        factStartDate: this.formatDate(this.props.startDate),
        factFinishDate: moment().format(dateFormat)
      }
    };
  };

  wholeProjectTimeOption = () => {
    return {
      label: 'За весь проект',
      value: {
        factStartDate: this.formatDate(this.props.startDate),
        factFinishDate: this.formatDate(this.props.endDate)
      }
    };
  };

  getQueryParams = () => {
    const { selectedFrom, selectedTo, reportPeriod } = this.state;
    const checkSprint = reportPeriod && reportPeriod.value && reportPeriod.value.sprintId;
    const checkDate = selectedFrom && selectedTo;
    const selectedDate = `?startDate=${selectedFrom}&endDate=${selectedTo}`;
    if (checkDate && checkSprint) {
      // запрос отчета по спринту
      const { sprintId, sprintStartDate, sprintFinishDate } = reportPeriod.value;
      const sprintDate = `&sprintStartDate=${sprintStartDate}&sprintFinishDate=${sprintFinishDate}`;
      return `${selectedDate}&sprintId=${sprintId}&label=${reportPeriod.label}${sprintDate}`;
    } else if (checkDate && reportPeriod) {
      // запрос отчета определенного типа
      return `${selectedDate}&label=${reportPeriod.label}`;
    } else {
      // запрос отчета по дате, без выбора типа
      return selectedDate;
    }
    return `?startDate=${this.state.selectedFrom}&endDate=${this.state.selectedTo}`;
  };
  changeSprint = (option) => {
    if (option) {
      this.setState({
        sprintSelected: option,
        selectedFrom: this.formatDate(option.value.factStartDate),
        selectedTo: this.formatDate(option.value.factFinishDate)
      });
    }
  };

  sprintsList = () => {
    const list = [];
    list.unshift(this.lastWeekOption());
    list.unshift(this.lastMonthOption());
    list.unshift(this.fullTimeOption());
    const sprints = this.props.sprints.map((sprint, i) => ({
      value: sprint,
      label: `${sprint.name} (${moment(sprint.factStartDate).format(dateFormat)} ${
        sprint.factFinishDate ? `- ${moment(sprint.factFinishDate).format(dateFormat)}` : '- ...'
      })`,
      statusId: sprint.statusId,
      className: classnames({
        [css.INPROGRESS]: sprint.statusId === 2,
        [css.sprintMarker]: true,
        [css.FINISHED]: sprint.statusId === 1
      })
    }));
    const newList = list.concat(sprints);
    return newList;
  };

  render () {
    const dateFrom = this.state.selectedFrom ? moment(this.state.selectedFrom, dateFormat).format(dateFormat) : '';
    const dateTo = this.state.selectedTo ? moment(this.state.selectedTo, dateFormat).format(dateFormat) : '';
    return (
      <div className={css.SprintReport}>
        <Row center="xs">
          <Col xs={12}>
            <h2>Выгрузка отчёта</h2>
          </Col>
        </Row>
        <Row className={css.modile_style}>
          <Col>Период: </Col>
          <Col md={4} xs={12}>
            <SprintSelector
              multi={false}
              value={this.state.sprintSelected}
              sprints={this.props.sprints}
              options={this.sprintsList()}
              onChange={(option) => this.changeSprint(option)}
              noResultsText="Нет результатов"
              className={css.sprintSelector}
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
              disabledDataRanges={[{ after: new Date(this.state.selectedTo) }]}
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
              disabledDataRanges={[{ before: new Date(this.state.selectedFrom) }]}
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

const mapStateToProps = (state) => ({
  project: state.Project.project,
  sprints: state.Project.project.sprints
});

export default connect(mapStateToProps)(SprintReport);
