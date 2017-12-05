import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './StartEndDates.scss'
import Input from '../../../../components/Input';
import moment from 'moment';

class StartEndDates extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div className = {css.startEndDatesWrp}> 
        <div className = {css.startEndDates}>
          Дата начала проекта: 
          <Input readOnly value = {this.props.startDate ? moment(this.props.startDate).format('DD.MM.YYYY') : 'Загрузка...'}/>
        </div>
        <div className = {css.startEndDates}>
          Дата завершения проекта
          <Input readOnly value = {this.props.endDate ? moment(this.props.endDate).format('DD.MM.YYYY') : 'Загрузка...'}/>
        </div>
      </div>
      
    )
  }
}
StartEndDates.propTypes = {
  createdAt: PropTypes.string,
  completedAt: PropTypes.string
};
export default StartEndDates;