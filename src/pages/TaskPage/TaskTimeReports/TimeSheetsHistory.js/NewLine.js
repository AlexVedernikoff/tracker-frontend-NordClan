import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';

import DatepickerDropdown from '../../../../components/DatepickerDropdown';
import SelectDropdown from '../../../../components/SelectDropdown';
import InputNumber from '../../../../components/InputNumber';
import RoundButton from '../../../../components/RoundButton';
import { IconCheck, IconError } from '../../../../components/Icons';
import getStatusOptions from '../../../../utils/getDraftStatusOptions';
import createHash from '../../../../utils/createHash';
import * as css from '../TaskTimeReports.scss';

class NewLine extends Component {
  static propTypes = {
    currentStatus: PropTypes.number,
    currentUser: PropTypes.object,
    hashCodes: PropTypes.array,
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
    const { currentUser, taskStatuses, preloading, hashCodes, localizeText, localizeH } = this.props;
    const { date, status, time } = this.state;
    const statusOptions = getStatusOptions(taskStatuses);
    const isFieldValues = !status || !time || !statusOptions.filter(option => option.value === status).length;
    const hash = createHash(date.format('YYYY-MM-DD'), status, currentUser.id);
    const isAlreadyCreated = hashCodes.includes(hash);

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
            placeholder={localizeText.STATUS}
            multi={false}
            noResultsText={localizeText.selectDropdownNoResults}
            options={statusOptions}
            disabled={preloading}
          />
        </td>
        <td className={css.time} colSpan={2}>
          <InputNumber
            style={{ width: '4rem' }}
            postfix={localizeH}
            value={time}
            onChange={this.changeTime}
            disabled={preloading}
          />
        </td>
        <td className={css.user}>
          {currentUser.fullNameRu}
          {!isFieldValues && !isAlreadyCreated ? (
            <RoundButton
              className={css.confirmNewTimesheet}
              onClick={this.onSubmit}
              disabled={isFieldValues || isAlreadyCreated || preloading}
              loading={preloading}
            >
              <IconCheck />
            </RoundButton>
          ) : (
            <i
              data-tip={isAlreadyCreated ? localizeText.isAlreadyCreatedTrue : localizeText.isAlreadyCreatedFalse}
              className={classnames([css.info, { [css.infoWarning]: isAlreadyCreated }])}
            >
              <IconError />
            </i>
          )}
        </td>
      </tr>
    );
  }
}

export default NewLine;
