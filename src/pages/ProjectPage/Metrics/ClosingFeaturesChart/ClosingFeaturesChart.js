import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import * as css from './BugsChart.scss';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import getRandomColor from '../../../../utils/getRandomColor';

function getBasicLineSettings(color) {
  return {
    backgroundColor: color,
    borderColor: color,
    fill: false,
    lineTension: 0,
    borderWidth: 1,
    pointRadius: 1
  };
}

class ClosingFeaturesChart extends Component {
  static propTypes = {
    sprintClosingFeaturesMetrics: PropTypes.array
  };

  constructor (props) {
    super(props);
    this.chartOptions = {
      responsive: true,
      hover: { mode: 'nearest' },
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
  }

  makeChartData () {
    const {
      sprintClosingFeaturesMetrics
    } = this.props;
    return {
      datasets: [
        this.makeBugsLine(sprintClosingFeaturesMetrics, 'Динамика закрытия фич (с учетом трудозатрат)'),
      ]
    };
  }

  makeBugsLine (metrics, label) {
    const randomnedColor = getRandomColor();
    const line = metrics.map(metric => {
      return {
        x: metric.createdAt,
        y: +metric.value
      };
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
        <h3>Динамика закрытия фич</h3>
        <Line
          data={this.makeChartData()}
          options={this.chartOptions}
          redraw
        />
      </div>
    );
  }
}

export default ClosingFeaturesChart;
