import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import * as css from './ClosingFeaturesChart.scss';
import sortChartLineByDates from '../../../../utils/sortChartLineByDates';
import roundNum from '../../../../utils/roundNum';
import getColor from '../../../../utils/Colors';

class ClosingFeaturesChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    getBasicLineSettings: PropTypes.func,
    sprintClosingFeaturesMetrics: PropTypes.array,
    sprintWorkWithoutEvaluationMetrics: PropTypes.array,
    sprintWriteOffTimeMetrics: PropTypes.array
  };

  constructor (props) {
    super(props);
    this.chartOptions = {
      ...props.chartDefaultOptions,
      scales: {
        ...props.chartDefaultOptions.scales,
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Часы'
            }
          }
        ]
      }
    };
  }

  makeChartData = () => {
    const { sprintClosingFeaturesMetrics, sprintWriteOffTimeMetrics, sprintWorkWithoutEvaluationMetrics } = this.props;

    getColor.reset();

    return {
      datasets: [
        this.makeBugsLine(sprintClosingFeaturesMetrics, 'Динамика закрытия задач (с учетом трудозатрат)'),
        this.makeBugsLine(sprintWriteOffTimeMetrics, 'Динамика списания времени на задачи'),
        this.makeBugsLine(sprintWorkWithoutEvaluationMetrics, 'Динамика трудозатрат на задачи без оценки')
      ]
    };
  };

  makeBugsLine = (metrics, label) => {
    const line = metrics
      .map((metric) => {
        return {
          x: metric.createdAt,
          y: roundNum(+metric.value, 2)
        };
      })
      .sort(sortChartLineByDates);
    return {
      data: [...line],
      label: label,
      ...this.props.getBasicLineSettings()
    };
  };

  render () {
    return (
      <div className={css.ClosingFeaturesChart}>
        <h3 className={css.h3Top}>Динамика закрытия задач</h3>
        <Line data={this.makeChartData()} options={this.chartOptions} redraw />
      </div>
    );
  }
}

export default ClosingFeaturesChart;
