import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './StartEndDates.scss';
import Input from '../../../../components/Input';
import moment from 'moment';
const dateFormat = 'DD.MM.YYYY';
class StartEndDates extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={css.startEndDatesWrp}>
        <div className={css.startEndDates}>
          Дата начала:
          <Input readOnly value={this.props.startDate ? moment(this.props.startDate).format(dateFormat) : ''} />
        </div>
        <div className={css.startEndDates}>
          Дата завершения:
          <Input readOnly value={this.props.endDate ? moment(this.props.endDate).format(dateFormat) : ''} />
        </div>
      </div>
    );
  }
}
StartEndDates.propTypes = {
  endDate: PropTypes.string,
  startDate: PropTypes.string
};
export default StartEndDates;
