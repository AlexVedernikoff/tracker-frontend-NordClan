import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import * as css from './ClosingFeaturesChart.scss';

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

  makeChartData = () => {
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
  };

  makeBugsLine = (metrics, label) => {
    const line = metrics.map(metric => {
      return {
        x: metric.createdAt,
        y: +metric.value
      };
    });
    return {
      data: [...line],
      label: label,
      ...this.props.getBasicLineSettings()
    };
  };

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
