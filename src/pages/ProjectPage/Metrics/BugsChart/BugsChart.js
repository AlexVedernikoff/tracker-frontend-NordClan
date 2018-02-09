import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './BugsChart.scss';
import { Line } from 'react-chartjs-2';
import sortChartLineByDates from '../../../../utils/sortChartLineByDates';
import roundNum from '../../../../utils/roundNum';

class BugsChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    getBasicLineSettings: PropTypes.func,
    openedBugsMetrics: PropTypes.array,
    openedCustomerBugsMetrics: PropTypes.array,
    openedRegressBugsMetrics: PropTypes.array
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
              labelString: 'Количество багов'
            }
          }
        ]
      }
    };
  }

  makeChartData = () => {
    const { openedBugsMetrics, openedCustomerBugsMetrics, openedRegressBugsMetrics } = this.props;
    return {
      datasets: [
        this.makeBugsLine(openedBugsMetrics, 'Количество открытых багов'),
        this.makeBugsLine(openedCustomerBugsMetrics, 'Количество открытых багов от Заказчика'),
        this.makeBugsLine(openedRegressBugsMetrics, 'Количество открытых регрессионных багов')
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
      <div className={css.BugsChart}>
        <Line data={this.makeChartData()} options={this.chartOptions} redraw />
      </div>
    );
  }
}

export default BugsChart;
