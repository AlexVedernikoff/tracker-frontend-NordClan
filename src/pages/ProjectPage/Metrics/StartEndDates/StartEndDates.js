import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './StartEndDates.scss'
import Input from '../../../../components/Input';
import moment from 'moment';

class StartEndDates extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    return (
      <div className = {css.startEndDatesWrp}>
        <div className = {css.startEndDates}>
          Дата начала:
          <Input
            readOnly
            value={this.props.startDate ? moment(this.props.startDate).format('YYYY-MM-DD') : ''}/>
        </div>
        <div className = {css.startEndDates}>
          Дата завершения:
          <Input
            readOnly
            value={this.props.endDate ? moment(this.props.endDate).format('YYYY-MM-DD') : ''}/>
        </div>
      </div>
    );
  }
}
StartEndDates.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string
};
export default StartEndDates;