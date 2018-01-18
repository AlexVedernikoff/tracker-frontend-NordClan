import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import getRandomColor from '../../../../utils/getRandomColor';
import * as css from './ClosingFeaturesChart.scss';
import 'moment/locale/ru';

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
    sprintClosingFeaturesMetrics: PropTypes.array,
    sprintWorkWithoutEvaluationMetrics: PropTypes.array,
    sprintWriteOffTimeMetrics: PropTypes.array
  };

  constructor (props) {
    super(props);
    this.chartOptions = {
      responsive: true,
      hover: { mode: 'nearest' },
      title: {
        display: false
      },
      legend: {
        position: 'bottom'
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: {
              day: 'D MMM'
            },
            tooltipFormat: 'DD.MM.YYYY'
          },
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
            labelString: 'Часы'
          }
        }]
      }
    };
  }

  makeChartData () {
    const {
      sprintClosingFeaturesMetrics,
      sprintWriteOffTimeMetrics,
      sprintWorkWithoutEvaluationMetrics
    } = this.props;
    return {
      datasets: [
        this.makeBugsLine(sprintClosingFeaturesMetrics, 'Динамика закрытия фич (с учетом трудозатрат)'),
        this.makeBugsLine(sprintWriteOffTimeMetrics, 'Динамика списания времени на фичи'),
        this.makeBugsLine(sprintWorkWithoutEvaluationMetrics, 'Динамика трудозатрат на фичи без оценки')
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
      <div className={css.ClosingFeaturesChart}>
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
