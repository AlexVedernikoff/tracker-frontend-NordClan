import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import './style.css';
import * as css from './DatepickerDropdown.scss';
import 'moment/locale/ru';
import LocaleUtils from 'react-day-picker/moment';

export default class DatepickerDropdown extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { ...other } = this.props;

    return (
      <DayPickerInput
        {...other}
        clickUnselectsDay
        className={css.dropdown}
        format="DD.MM.YYYY"
        dayPickerProps={{
          locale: 'ru',
          localeUtils: { ...LocaleUtils }
        }}
      />
    );
  }
}

DatepickerDropdown.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array
};
