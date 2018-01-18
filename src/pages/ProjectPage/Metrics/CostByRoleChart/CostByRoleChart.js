import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './CostByRoleChart.scss';
import { Line } from 'react-chartjs-2';

class CostByRoleChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    costByRoleMetrics: PropTypes.array,
    costByRolePercentMetrics: PropTypes.array,
    getBasicLineSettings: PropTypes.func
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
            labelString: 'Количество багов'
          }
        }]
      }
    };
  }

  makeChartData () {
    const {
      costByRoleMetrics,
      costByRolePercentMetrics
    } = this.props;
    return {
      datasets: [
        ...this.makeRoleMetricsLine(costByRolePercentMetrics)
      ]
    };
  }

  makeRoleMetricsLine (roleMetrics) {
    return roleMetrics.map(role => {
      const line = role.metrics.map(metric => {
        return {
          x: metric.createdAt,
          y: +metric.value
        };
      });
      return {
        data: line,
        label: `${role.name}`,
        ...this.props.getBasicLineSettings()
      };
    });
  }

  render () {
    return (
      <div className={css.CostByRoleChart}>
        <h3>Затраты по ролям</h3>
        <Line
          data={this.makeChartData()}
          options={this.chartOptions}
          redraw
        />
      </div>
    );
  }
}

export default CostByRoleChart;
