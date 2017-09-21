import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import DayPicker from 'react-day-picker';
import onClickOutside from 'react-onclickoutside';
import LocaleUtils from 'react-day-picker/moment';
import * as css from '../Timesheets.scss';

class Calendar extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.state = {
      isModalOpen: true
    };
  }

  handleClickOutside = () => {
    this.props.onCancel();
  }

  render () {
    const { ...other } = this.props;

    return (
      <div
        className={cn(css.dateDropdown, 'st-week-select')}
      >
        <DayPicker
          locale='ru'
          enableOutsideDays
          localeUtils={{ ...LocaleUtils }}
          {...other}
        />
      </div>
    );
  }
}

export default Calendar = onClickOutside(Calendar);
