import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import DatepickerDropdown from '../../../../components/DatepickerDropdown';
import SelectDropdown from '../../../../components/SelectDropdown';
import InputNumber from '../../../../components/InputNumber';
import RoundButton from '../../../../components/RoundButton';
import { IconCheck } from '../../../../components/Icons';
import getStatusOptions from '../../../../utils/getDraftStatusOptions';
import * as css from '../TaskTimeReports.scss';

class NewLine extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    taskStatuses: PropTypes.array
  };

  render() {
    const { currentUser, taskStatuses } = this.props;

    return (
      <tr className={classnames(css.historyItem, css.ghostItem)}>
        <td className={css.day}>
          <DatepickerDropdown style={{ width: '7rem' }} />
        </td>
        <td className={css.status}>
          <SelectDropdown
            style={{ width: '8rem' }}
            placeholder="Статус"
            multi={false}
            noResultsText="Нет результатов"
            options={getStatusOptions(taskStatuses)}
          />
        </td>
        <td className={css.time} colSpan={2}>
          <InputNumber style={{ width: '4rem' }} postfix="ч." />
        </td>
        <td className={css.user}>
          {currentUser.fullNameRu}
          <RoundButton className={css.confirmNewTimesheet}>
            <IconCheck />
          </RoundButton>
        </td>
      </tr>
    );
  }
}

export default NewLine;
