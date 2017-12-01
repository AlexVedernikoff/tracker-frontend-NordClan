import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './StartEndDates.scss'
import { connect } from 'react-redux';
import Input from '../../../../components/Input';

class StartEndDates extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div className = {css.startEndDatesWrp}> 
        <div className = {css.startEndDates}>
          Дата начала проекта: 
          <Input readOnly value = {this.props.createdAt ? this.props.createdAt.substr(0,10) : 'Нет данных'}/>
        </div>
        <div className = {css.startEndDates}>
          Дата завершения проекта
          <Input readOnly value = {this.props.completedAt ? this.props.createdAt.substr(0,10) : 'Нет данных'}/>
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