import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import './style.css';
import * as css from './DatepickerDropdown.scss';
import 'moment/locale/ru';
import LocaleUtils from 'react-day-picker/moment';
import { connect } from 'react-redux';

class DatepickerDropdown extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { disabledDataRanges, lang, dispatch, ...other } = this.props;

    return (
      <DayPickerInput
        {...other}
        clickUnselectsDay
        className={css.dropdown}
        format="DD.MM.YYYY"
        dayPickerProps={{
          locale: lang,
          localeUtils: { ...LocaleUtils },
          disabledDays: disabledDataRanges
        }}
      />
    );
  }
}

DatepickerDropdown.propTypes = {
  disabledDataRanges: PropTypes.array,
  dispatch: PropTypes.func,
  name: PropTypes.string,
  options: PropTypes.array
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(DatepickerDropdown);
