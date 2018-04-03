import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './CostByRoleChart.scss';
import { Line } from 'react-chartjs-2';
import ChartWrapper from '../ChartWrapper';
import Button from '../../../../components/Button';
import sortChartLineByDates from '../../../../utils/sortChartLineByDates';
import roundNum from '../../../../utils/roundNum';
import getColor from '../../../../utils/Colors';

class CostByRoleChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    costByRoleMetrics: PropTypes.array,
    costByRolePercentMetrics: PropTypes.array,
    getBasicLineSettings: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      displayPercent: true,
      chartRef: null
    };
  }

  componentDidMount() {
    this.setState({ chartRef: this.refs.chart });
  }

  makeChartData() {
    const { costByRoleMetrics, costByRolePercentMetrics } = this.props;
    const { displayPercent } = this.state;

    getColor.reset();

    return {
      datasets: [...this.makeRoleMetricsLine(displayPercent ? costByRolePercentMetrics : costByRoleMetrics)]
    };
  }

  getChartOptions = () => {
    return {
      ...this.props.chartDefaultOptions,
      scales: {
        ...this.props.chartDefaultOptions.scales,
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: this.state.displayPercent ? '% часов' : 'часы'
            }
          }
        ]
      }
    };
  };

  makeRoleMetricsLine(roleMetrics) {
    return roleMetrics.map(role => {
      const line = role.metrics
        .map(metric => {
          return {
            x: metric.createdAt,
            y: roundNum(+metric.value, 2)
          };
        })
        .sort(sortChartLineByDates);
      return {
        data: line,
        label: role.name,
        ...this.props.getBasicLineSettings()
      };
    });
  }
  switcherClickHandler = buttonType => {
    return () => {
      if (buttonType === 'percent' && !this.state.displayPercent) {
        this.setState({ displayPercent: true });
      } else if (buttonType === 'hours' && this.state.displayPercent) {
        this.setState({ displayPercent: false });
      }
    };
  };
  render() {
    return (
      <ChartWrapper chartRef={this.state.chartRef} className={css.CostByRoleChart}>
        <div className={css.CostByRoleSwitcher}>
          <Button
            type={this.state.displayPercent ? 'primary' : 'bordered'}
            text="Отобразить в %"
            onClick={this.switcherClickHandler('percent')}
          />
          <Button
            type={this.state.displayPercent ? 'bordered' : 'primary'}
            text="Отобразить в часах"
            onClick={this.switcherClickHandler('hours')}
          />
        </div>
        <Line ref="chart" data={this.makeChartData()} options={this.getChartOptions()} redraw />
      </ChartWrapper>
    );
  }
}

export default CostByRoleChart;
