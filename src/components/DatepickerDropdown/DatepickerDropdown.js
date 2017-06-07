import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';

import * as css from './DatepickerDropdown.scss';
import './DatepickerDropdown.css';

export default class DatepickerDropdown extends Component {
  static propTypes = {
    name: PropTypes.string,
    options: PropTypes.array
  };

  render () {
    const {
      ...other
    } = this.props;

    return (
      <DatePicker {...other} className={css.dropdown}/>
    );
  }
}
