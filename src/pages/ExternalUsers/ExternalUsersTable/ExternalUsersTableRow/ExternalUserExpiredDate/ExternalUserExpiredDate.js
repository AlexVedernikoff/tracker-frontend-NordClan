import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatepickerDropdown from '../../../../../components/DatepickerDropdown';
import moment from 'moment';
import localize from './ExternalUserExpiredDate.json';

class ExternalUserExpiredDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  handleDayToChange = date => {
    const updatedDate = date ? moment(date).format() : this.props.value;
    this.setState(
      {
        value: updatedDate
      },
      () => this.props.onValueChange(moment(updatedDate).format('YYYY-MM-DD'))
    );
  };

  render() {
    const { lang } = this.props;
    const formattedDay = moment(this.props.value).format('DD.MM.YYYY');
    const formattedStateDay = moment(this.state.value).format('DD.MM.YYYY');
    return (
      <div>
        {this.props.isEditing ? (
          <DatepickerDropdown
            name="date"
            value={formattedStateDay}
            onDayChange={this.handleDayToChange}
            disabledDataRanges={[{ before: new Date() }]}
            placeholder={localize[lang].ENTER_DATE}
          />
        ) : (
          <div>{formattedDay}</div>
        )}
      </div>
    );
  }
}
ExternalUserExpiredDate.propTypes = {
  isEditing: PropTypes.bool,
  lang: PropTypes.string,
  onValueChange: PropTypes.func,
  value: PropTypes.string
};
export default ExternalUserExpiredDate;
