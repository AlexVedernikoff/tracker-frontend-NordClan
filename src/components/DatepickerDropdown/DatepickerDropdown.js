import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
// import moment from 'moment';
import './style.css';
import * as css from './DatepickerDropdown.scss';
import 'moment/locale/ru';
import LocaleUtils from 'react-day-picker/moment';
import { connect } from 'react-redux';
import InputWithDateMask from './InputWithDateMask';

class DatepickerDropdown extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { disabledDataRanges, ...other } = this.props.ownProps;

    return (
      <DayPickerInput
        {...other}
        component={InputWithDateMask}
        clickUnselectsDay
        className={css.dropdown}
        format="DD.MM.YYYY"
        dayPickerProps={{
          locale: this.props.lang,
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

const mapStateToProps = (state, ownProps) => ({
  lang: state.Localize.lang,
  ownProps
});

export default connect(mapStateToProps)(DatepickerDropdown);
