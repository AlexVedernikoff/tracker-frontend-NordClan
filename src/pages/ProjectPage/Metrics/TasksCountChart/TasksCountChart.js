import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TasksCountChart.scss';
import { Line } from 'react-chartjs-2';
import sortChartLineByDates from '../../../../utils/sortChartLineByDates';
import getColor from '../../../../utils/Colors';
import roundNum from '../../../../utils/roundNum';

class TasksCountChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    getBasicLineSettings: PropTypes.func,
    openedBugsMetrics: PropTypes.array,
    openedCustomerBugsMetrics: PropTypes.array,
    openedFeaturesMetric: PropTypes.array,
    openedFeaturesWithoutEvaluationMetric: PropTypes.array,
    openedOutOfPlanFeaturesMetric: PropTypes.array
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
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Количество задач'
            }
          }
        ]
      }
    };
  }

  makeChartData () {
    const {
      openedFeaturesMetric,
      openedFeaturesWithoutEvaluationMetric,
      openedOutOfPlanFeaturesMetric,
      openedBugsMetrics,
      openedCustomerBugsMetrics
    } = this.props;

    getColor.reset();

    return {
      datasets: [
        this.makeTaskCountMetricsLine(openedFeaturesMetric, 'Количество открытых задач без оценки'),
        this.makeTaskCountMetricsLine(openedFeaturesWithoutEvaluationMetric, 'Количество открытых задач без оценки'),
        this.makeTaskCountMetricsLine(openedOutOfPlanFeaturesMetric, 'Количество открытых задач вне плана'),
        this.makeTaskCountMetricsLine(openedBugsMetrics, 'Количество открытых багов'),
        this.makeTaskCountMetricsLine(openedCustomerBugsMetrics, 'Количество открытых багов от заказчика')
      ]
    };
  }

  makeTaskCountMetricsLine = (metrics, label) => {
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
      <div className={css.TasksCountChart}>
        <h3>Количество задач</h3>
        <Line data={this.makeChartData()} options={this.chartOptions} redraw />
      </div>
    );
  }
}

export default TasksCountChart;
