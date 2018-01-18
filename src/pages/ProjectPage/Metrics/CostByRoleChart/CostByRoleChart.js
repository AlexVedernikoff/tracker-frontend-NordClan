import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './CostByRoleChart.scss';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import moment from 'moment';
import getRandomColor from '../../../../utils/getRandomColor';
import Button from '../../../../components/Button';

class CostByRoleChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    costByRoleMetrics: PropTypes.array,
    costByRolePercentMetrics: PropTypes.array,
    getBasicLineSettings: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {
      displayPercent: true
    };
  }

  makeChartData () {
    const {
      costByRoleMetrics,
      costByRolePercentMetrics
    } = this.props;
    const { displayPercent } = this.state;
    return {
      datasets: [
        ...this.makeRoleMetricsLine(displayPercent ? costByRolePercentMetrics : costByRoleMetrics)
      ]
    };
  }

  getChartOptions = () => {
    return {
      ...this.props.chartDefaultOptions,
      scales: {
        ...this.props.chartDefaultOptions.scales,
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: this.state.displayPercent ? '% часов' : 'часы'
          }
        }]
      }
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
  switcherClickHandler = (buttonType) => {
    return () => {
      if (buttonType === 'percent' && !this.state.displayPercent) {
        this.setState({displayPercent: true});
      } else if (buttonType === 'hours' && this.state.displayPercent) {
        this.setState({displayPercent: false});
      }
    };
  }
  render () {
    return (
      <div className={css.CostByRoleChart}>
        <h3>Затраты по ролям</h3>
        <div className={css.CostByRoleSwitcher}>
          <Button
            type={this.state.displayPercent ? 'primary' : 'bordered'}
            text='Отобразить в %'
            onClick={this.switcherClickHandler('percent')}
          />
          <Button
            type={this.state.displayPercent ? 'bordered' : 'primary'}
            text='Отобразить в часах'
            onClick={this.switcherClickHandler('hours')}
          />
        </div>
        <Line
          data={this.makeChartData()}
          options={this.getChartOptions()}
          redraw
        />
      </div>
    );
  }
}

export default CostByRoleChart;
