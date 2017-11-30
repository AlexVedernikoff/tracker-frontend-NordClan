import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './StartEndDates.scss'
import { connect } from 'react-redux';

class StartEndDates extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div className = {css.startEndDates}> 
        <div className = {css.startEndDates}>
          Дата начала проекта:
          {this.props.createdAt ? this.props.createdAt.substr(0,10) : 'Нет данных'}
        </div>
        <div className = {css.startEndDates}>
          Дата завершения проекта
          {this.props.completedAt ? this.props.createdAt.substr(0,10) : 'Нет данных'}
        </div>
      </div>
      
    )
  }
}
export default StartEndDates;