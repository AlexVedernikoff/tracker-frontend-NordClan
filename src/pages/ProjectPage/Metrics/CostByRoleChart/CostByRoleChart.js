import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './CostByRoleChart.scss';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import moment from 'moment';
import getRandomColor from '../../../../utils/getRandomColor';
import Button from '../../../../components/Button';

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

class CostByRoleChart extends Component {

  static propTypes = {
    costByRoleMetrics: PropTypes.array,
    costByRolePercentMetrics: PropTypes.array
  }

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
            labelString: this.state.displayPercent ? '% часов' : 'часы'
          }
        }]
      }
    };
  }

  makeRoleMetricsLine (roleMetrics) {
    return roleMetrics.map(role => {
      const randomnedColor = getRandomColor();
      const line = role.metrics.map(metric => {
        return {
          x: metric.createdAt,
          y: +metric.value
        };
      });
      return {
        data: line,
        label: `${role.name}`,
        ...getBasicLineSettings(randomnedColor)
      };
    });
  }

  render () {
    return (
      <div className={css.CostByRoleChart}>
        <h3>Затраты по ролям</h3>
        <div className={css.CostByRoleSwitcher}>
          <Button
            type={this.state.displayPercent ? 'primary' : 'bordered'}
            text='Отобразить в %'
            onClick={() => this.setState({displayPercent: true})}
          />
          <Button
            type={this.state.displayPercent ? 'bordered' : 'primary'}
            text='Отобразить в часах'
            onClick={() => this.setState({displayPercent: false})}
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
