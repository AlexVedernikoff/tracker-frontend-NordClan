import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';

import DatepickerDropdown from '../../../../components/DatepickerDropdown';
import SelectDropdown from '../../../../components/SelectDropdown';
import InputNumber from '../../../../components/InputNumber';
import RoundButton from '../../../../components/RoundButton';
import { IconCheck } from '../../../../components/Icons';
import getStatusOptions from '../../../../utils/getDraftStatusOptions';
import * as css from '../TaskTimeReports.scss';

class NewLine extends Component {
  static propTypes = {
    currentStatus: PropTypes.number,
    currentUser: PropTypes.object,
    onSubmit: PropTypes.func,
    preloading: PropTypes.bool,
    taskStatuses: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      status: this.props.currentStatus,
      time: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentStatus !== this.props.currentStatus) {
      this.changeStatus(nextProps.currentStatus);
    }
  }

  changeDate = date => {
    this.setState({ date });
  };

  changeStatus = status => {
    this.setState({ status: status.value });
  };

  changeTime = time => {
    this.setState({ time });
  };

  onSubmit = () => {
    this.props.onSubmit({
      taskStatusId: this.state.status,
      onDate: this.state.date.format('YYYY-MM-DD'),
      spentTime: this.state.time
    });
    this.setState({
      date: moment(),
      status: this.props.currentStatus,
      time: 0
    });
  };

  render() {
    const { currentUser, taskStatuses, preloading } = this.props;
    const { date, status, time } = this.state;
    const statusOptions = getStatusOptions(taskStatuses);
    const isDisabled = !status || !time || !statusOptions.filter(option => option.value === status).length;

    return (
      <tr className={classnames(css.historyItem, css.ghostItem)}>
        <td className={css.day}>
          <DatepickerDropdown
            style={{ width: '7rem' }}
            value={date.format('DD.MM.YYYY')}
            onDayChange={this.changeDate}
            disabled={preloading}
          />
        </td>
        <td className={css.status}>
          <SelectDropdown
            value={status}
            onChange={this.changeStatus}
            style={{ width: '8rem' }}
            placeholder="Статус"
            multi={false}
            noResultsText="Нет результатов"
            options={statusOptions}
            disabled={preloading}
          />
        </td>
        <td className={css.time} colSpan={2}>
          <InputNumber
            style={{ width: '4rem' }}
            postfix="ч."
            value={time}
            onChange={this.changeTime}
            disabled={preloading}
          />
        </td>
        <td className={css.user}>
          {currentUser.fullNameRu}
          <RoundButton
            className={css.confirmNewTimesheet}
            data-tip="Добавить запись"
            onClick={this.onSubmit}
            disabled={isDisabled || preloading}
            loading={preloading}
          >
            <IconCheck />
          </RoundButton>
        </td>
      </tr>
    );
  }
}

export default NewLine;
