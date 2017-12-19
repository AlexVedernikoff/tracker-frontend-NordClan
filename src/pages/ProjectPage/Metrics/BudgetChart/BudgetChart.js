import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './BudgetChart.scss';
import Input from '../../../../components/Input';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import moment from 'moment';
import getRandomColor from '../../../../utils/getRandomColor';
import { budgetMetricsMock } from '../../../../mocks/MetricsMock';

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

class BudgetChart extends Component {

  static propTypes = {
    budget: PropTypes.number
  }

  constructor (props) {
    super(props);
    this.chartOptions = {
      responsive: true,
      hover: {mode: 'nearest'},
      title: {
        display: false
      },
      tooltips: {
        callbacks: {
          title: function (tooltipItem, data) {
            return moment(tooltipItem[0].xLabel).format('YYYY.MM.DD');
          },
          label: function (tooltipItem, data) {
            return `${tooltipItem.yLabel} ч.`;
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
            labelString: 'Бюджет'
          }
        }]
      }
    };

    this.state = {
      chartData: this.makeChartData(budgetMetricsMock)
    };
  }

  makeChartData (metrics) {
    return {
      datasets: [
        this.makeIdealProjectBurndown(metrics),
        this.makeProjectBurndown(metrics),
        ...this.makeSprintsBurndowns(metrics),
        ...this.makeSprintsIdealBurndowns(metrics)
      ]
    };
  }

  makeIdealProjectBurndown (metrics) {
    const randomnedColor = getRandomColor();
    return {
      data: [
        {
          x: metrics.startDate,
          y: metrics.budget
        },
        {
          x: metrics.endDate,
          y: 0
        }
      ],
      label: 'Идеальная всего проекта',
      ...getBasicLineSettings(randomnedColor)
    };
  }

  makeProjectBurndown (metrics) {
    const burndown = [];
    const randomnedColor = getRandomColor();

    metrics.points.forEach(point => {
      burndown.push({
        x: point.date,
        y: point.budget
      });
    });

    return {
      data: [...burndown],
      label: 'Весь проект',
      ...getBasicLineSettings(randomnedColor)
    };
  }

  makeSprintsIdealBurndowns (metrics) {
    const burndownsArr = [];

    metrics.sprints.forEach(sprint => {
      const randomnedColor = getRandomColor();
      burndownsArr.push({
        data: [
          {
            x: sprint.factStartDate,
            y: sprint.allottedTime
          },
          {
            x: sprint.factFinishDate,
            y: 0
          }
        ],
        label: `Идеальная ${sprint.name}`,
        ...getBasicLineSettings(randomnedColor)
      });
    });
    return burndownsArr;
  }

  makeSprintsBurndowns (metrics) {
    const burndownsArr = [];
    metrics.sprints.forEach(sprint => {
      const burndownData = [];
      const randomnedColor = getRandomColor();
      sprint.points.forEach(point => {
        burndownData.push({
          x: point.date,
          y: point.budget
        });
      });
      burndownsArr.push({
        data: burndownData,
        label: `${sprint.name}`,
        ...getBasicLineSettings(randomnedColor)
      });
    });
    return burndownsArr;
  }

  render () {
    return (
      <div className={css.BudgetChart}>
        <h3>Без рискового бюджета</h3>
        <div className={css.BudgetChartInfo}>
          Бюджет:
          <Input readOnly value={this.props.budget ? `${this.props.budget} ч.` : ''} />
        </div>
        <Line data={this.state.chartData} options={this.chartOptions} redraw/>
      </div>
    );
  }
}
const mapStateToProps = state => ({});

export default connect(mapStateToProps)(BudgetChart);
