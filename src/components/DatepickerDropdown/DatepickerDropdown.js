import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import 'react-day-picker/lib/style.css';
import * as css from './DatepickerDropdown.scss';

export default class DatepickerDropdown extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { ...other } = this.props;

    return (
      <DayPickerInput
        {...other}
        clickUnselectsDay
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
