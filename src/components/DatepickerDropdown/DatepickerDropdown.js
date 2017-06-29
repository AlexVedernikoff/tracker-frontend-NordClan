import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import 'react-day-picker/lib/style.css';
import * as css from './DatepickerDropdown.scss';

export default class DatepickerDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: null
    };
  }

  render() {
    const { ...other } = this.props;

    const datePickerProps = {
      locale: moment.locale('ru')
    };

    return (
      <DayPickerInput
        {...other}
        clickUnselectsDay
        dayPickerProps={datePickerProps}
        className={css.dropdown}
        format="DD.MM.YYYY"
      />
    );
  }
}

DatepickerDropdown.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array
};
