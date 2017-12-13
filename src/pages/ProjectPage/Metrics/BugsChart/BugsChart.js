import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './BugsChart.scss'
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';

class BugsChart extends Component {
  constructor(props) {
    super(props)
  }
  render () {
    return (
      <div className={css.BugsChart}>
        <h3>Баги на проекте</h3>
      </div>
    )
  }
}

export default BugsChart;