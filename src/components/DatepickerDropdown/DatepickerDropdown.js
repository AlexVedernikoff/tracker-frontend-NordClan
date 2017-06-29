import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import * as css from './DatepickerDropdown.scss';

export default class DatepickerDropdown extends Component {
  static propTypes = {
    name: PropTypes.string,
    options: PropTypes.array
  };

  render() {
    const { ...other } = this.props;

    return <DayPickerInput {...other} className={css.dropdown} />;
  }
}
