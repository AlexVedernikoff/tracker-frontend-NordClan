import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TasksCountChart.scss';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import moment from 'moment';
import getRandomColor from '../../../../utils/getRandomColor';

class TasksCountChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      displayPercent: true
    };
    this.chartOptions = {
      ...props.chartDefaultOptions,
      scales: {
        ...props.chartDefaultOptions.scales,
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Часы'
          }
        }]
      }
    };
  }

  makeChartData () {
  }

  render () {
    return (
      <div className={css.TasksCountChart}>
        <h3>Количество задач</h3>
        <Line
          data={this.makeChartData()}
          options={this.chartOptions}
          redraw
        />
      </div>
    );
  }
}

export default TasksCountChart;
