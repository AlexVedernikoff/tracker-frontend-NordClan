import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectDropdown from '../../../../components/SelectDropdown';
import _ from 'lodash';
import moment, { locale } from 'moment/moment';
import DatepickerDropdown from '../../../../components/DatepickerDropdown/DatepickerDropdown';
import { API_URL } from '../../../../constants/Settings';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './SprintReport.scss';

const dateFormat = 'DD.MM.YYYY';

class SprintReport extends Component {
  constructor (props) {
    super(props);
  }

  static propTypes = {
    project: PropTypes.object,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    sprints: PropTypes.array
  };

  state = {
    sprintSelected: null,
    selectedFrom: '',
    selectedTo: '',
    dateFrom: '',
    dateTo: '',
    borderColorFrom: '',
    borderColorTo: ''
  };

  sprintSelected = (option) => {
    if (!_.isEmpty(option)) {
      this.setState({
        sprintSelected: option,
        selectedFrom: this.formatDate(option.value.factStartDate),
        selectedTo: this.formatDate(option.value.factFinishDate)
      });
    } else {
      this.setState({
        sprintSelected: null,
        selectedFrom: this.formatDate(this.props.startDate),
        selectedTo: moment().format(dateFormat)
      });
    }
  };

  componentWillReceiveProps (newProps) {
    if (newProps.startDate) {
      this.updatePickers({
        selectedFrom: this.formatDate(newProps.startDate),
        selectedTo: moment().format(dateFormat)
      });
    }
  }

  formatDate = (date) => date && moment(date).format(dateFormat);

  updatePickers = (value) => {
    const { selectedFrom, selectedTo } = value;
    this.setState({ selectedFrom, selectedTo });
  };

  handleDayFromChange = (date) => {
    this.setState({ selectedFrom: this.formatDate(date), dateFrom: this.formatDate(date), borderColorFrom: ''});
  };
  handleDayToChange = (date) => {
    this.setState({ selectedTo: this.formatDate(date), dateTo: this.formatDate(date), borderColorTo: '' });
  };

  isRangeValid = () => {
    return (
      (!this.state.selectedFrom && !this.state.selectedTo)
      || (moment(this.state.selectedFrom, 'DD.MM.YYYY', true).isValid()
        && moment(this.state.selectedTo, 'DD.MM.YYYY', true).isValid()
        && moment(this.state.selectedTo).isAfter(this.state.selectedFrom))
    );
  };

  getSelectOptions = () => {
    return [
      this.fullTimeOption(),
      this.lastWeekOption(),
      this.lastMonthOption(),
      ...this.props.sprints.map((value) => ({ value, label: value.name }))
    ];
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
    const lastMonth = moment().subtract(1, 'month');
    return {
      label: 'За весь проект',
      value: {
        factStartDate: undefined,
        factFinishDate: undefined
      }
    };
  };

  getQueryParams = () => {
    if (!this.state.selectedFrom && !this.state.selectedTo) {
      return '';
    }
    return `?startDate=${this.state.selectedFrom}&endDate=${this.state.selectedTo}`;
  };

  validDateFromInput = (val) => {
    if(val.length === 2 || val.length === 5) {
      val+='.';
    }
    let d_arr = val.split('.');
    let d = new Date(d_arr[2]+'/'+d_arr[1]+'/'+d_arr[0]+'');

    if(d_arr[2]!=d.getFullYear() || d_arr[1]!=(d.getMonth() + 1) || d_arr[0]!=d.getDate()) {
      this.state.borderColorFrom = 'red';
    } else {
      this.state.borderColorFrom = '#ebebeb';
    }
    this.setState({ dateFrom: val});
  };

  validDateToInput = (val) => {
    if(val.length === 2 || val.length === 5) {
      val+='.';
    }
    let d_arr = val.split('.');
    let d = new Date(d_arr[2]+'/'+d_arr[1]+'/'+d_arr[0]+'');

    if(d_arr[2]!=d.getFullYear() || d_arr[1]!=(d.getMonth() + 1) || d_arr[0]!=d.getDate()) {
      this.state.borderColorTo = 'red';
    } else {
      this.state.borderColorTo = '#ebebeb';
    }
    this.setState({ dateTo: val});
  };
  
  render () {
    
    const dateFrom = this.state.selectedFrom ? moment(this.state.selectedFrom).format('DD.MM.YYYY') : '';
    const dateTo = this.state.selectedTo ? moment(this.state.selectedTo).format('DD.MM.YYYY') : '';
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
            <SelectDropdown
              name="sprint"
              placeholder="Выбирите спринт..."
              multi={false}
              value={this.state.sprintSelected}
              onKeyUp={(option) => this.sprintSelected(option)}
              noResultsText="Нет результатов"
              options={this.getSelectOptions()}
            />
          </Col>
          <Col>С: </Col>
          <Col md={2} xs={6}>
            <DatepickerDropdown
              name="dateFrom"
              format={dateFormat}
              value={this.state.dateFrom}
              onInput={(e) => this.validDateFromInput(e.target.value.replace(/[^0-9.]/g, '').substr(0, 9).trim())}
              onDayChange={this.handleDayFromChange}
              style = {{borderColor: this.state.borderColorFrom}}
              placeholder="дд.мм.гггг"
              disabledDataRanges={[{ after: new Date(this.state.selectedTo) }]}
            />
          </Col>
          <Col>По: </Col>
          <Col md={2} xs={4}>
            <DatepickerDropdown
              name="dateTo"
              format={dateFormat}
              value={this.state.dateTo}
              onInput={(e) => this.validDateToInput(e.target.value.replace(/[^0-9.]/g, '').substr(0, 9).trim())}
              onDayChange={this.handleDayToChange}
              style = {{borderColor: this.state.borderColorTo}}
              placeholder="дд.мм.гггг"
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
