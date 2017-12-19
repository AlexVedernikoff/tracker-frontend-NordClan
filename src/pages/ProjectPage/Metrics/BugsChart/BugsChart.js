import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './BugsChart.scss';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import moment from 'moment';
import { bugsMetricsMock } from '../../../../mocks/MetricsMock';
import getRandomColor from '../../../../utils/getRandomColor';

function getBasicLineSettings (color) {
  return {
    backgroundColor: color,
    borderColor: color,
    fill: false,
    lineTension: 0,
    borderWidth: 1,
    pointRadius: 1
  };
}

class BugsChart extends Component {
  constructor (props) {
    super(props);
    this.chartOptions = {
      responsive: true,
      hover: {mode: 'nearest'},
      title: {
        display: false
      },
      tooltips: {
        callbacks: {
          title: function (tooltipItem, data) {
            return moment(tooltipItem[0].xLabel).format('YYYY.MM.DD');
          },
          label: function (tooltipItem, data) {
            return tooltipItem.yLabel;
          }
        }
      },
      legend: {
        position: 'bottom'
      },
      scales: {
        xAxes: [{
          type: 'time',
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Дата'
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Количество багов'
          }
        }]
      }
    };
    this.state = {
      chartData: this.makeChartData(bugsMetricsMock)
    };
  }

  makeChartData (metrics) {
    return {
      datasets: [
        this.makeBugsLine(metrics.openedBugs, 'Количество открытых багов'),
        this.makeBugsLine(metrics.openedCustomerBugs, 'Количество открытых багов от Заказчика'),
        this.makeBugsLine(metrics.openedRegressBugs, 'Количество открытых регрессионных багов')
      ]
    };
  }

  makeBugsLine (metrics, label) {
    const line = [];
    const randomnedColor = getRandomColor();

    metrics.forEach(point => {
      line.push({
        x: point.date,
        y: point.bugs
      });
    });
    return {
      data: [...line],
      label: label,
      ...getBasicLineSettings(randomnedColor)
    };
  }

  render () {
    return (
      <div className={css.BugsChart}>
        <h3>Баги на проекте</h3>
        <Line
          data={this.state.chartData}
          options={this.chartOptions}
          redraw
        />
      </div>
    );
  }
}

export default BugsChart;
