import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './BudgetChart.scss'
import Input from '../../../../components/Input';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import moment from 'moment';

import budgetMetricsMock from '../../../../mocks/budgetMetricsMock'

function getRandomColor() {
  return `#${((0xFFFFFF * Math.random() ) | 0).toString(16).padStart(6, '1')}`
}

function getBasicLineSettings (color) {
  return {
    backgroundColor: color,
    borderColor: color,
    fill: false,
    lineTension: 0,
    borderWidth: 1,
    pointRadius: 1
  }
}
class BudgetChart extends Component {
  constructor(props) {
    super(props)
    this.chartOptions =  {
      responsive: true,
      hover: {mode: "nearest"},
      title: {
        display: false
      },
      tooltips: {
        callbacks: {
          title: function(tooltipItem, data) {
            return moment(tooltipItem[0].xLabel).format('YYYY.MM.DD');
          },
          label: function(tooltipItem, data) {
              return `${tooltipItem.yLabel} ч.`;
          }
        }
      },
      legend: {
        position: 'bottom'
      },
      scales: {
        xAxes: [{
          type: "time",
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
    }    
    this.state = {
      chartData: this.makeCharData(budgetMetricsMock)
    } 
  }
  
  makeCharData (metrics) {
    return {
      datasets: [
        this.makeIdealProjectBurndown(metrics), 
        this.makeProjectBurndown(metrics), 
        ...this.makeSprintsBurndowns(metrics), 
        ...this.makeSprintsIdealBurndowns(metrics)
      ]
    }
  }

  makeIdealProjectBurndown (metrics) {
    let randomnedColor = getRandomColor();
    return {
      data: [
        {
          x: moment(metrics.startDate).toDate(),
          y: metrics.budget
        },
        {
          x: moment(metrics.endDate).toDate(),
          y: 0
        }
      ],
      label: 'Идеальная всего проекта',
      ...getBasicLineSettings(randomnedColor)
    }
  }

  makeProjectBurndown (metrics) {
    let burndown = []
    let randomnedColor = getRandomColor();
    metrics.points.forEach(point => {
        burndown.push({
          x: moment(point.date).toDate(),
          y: point.budget
        } 
      ) 
    })
    return {
      data: [...burndown],
      label: 'Весь проект',
      ...getBasicLineSettings(randomnedColor)
    }
  }

  makeSprintsIdealBurndowns (metrics) {
    let burndownsArr = []
    metrics.sprints.forEach(sprint => {
      let randomnedColor = getRandomColor();      
      burndownsArr.push({
        data: [
          {
            x: moment(sprint.factStartDate).toDate(),
            y: sprint.allottedTime
          },
          {
            x: moment(sprint.factFinishDate).toDate(),
            y: 0
          }
        ],
        label: `Идеальная ${sprint.name}`,
        ...getBasicLineSettings(randomnedColor)
      } 
    )  
    });
    return burndownsArr
    
  }

  makeSprintsBurndowns (metrics) {
    let burndownsArr = []
    metrics.sprints.forEach(sprint => {
      let burndownData = []
      let randomnedColor = getRandomColor();      
      sprint.points.forEach(point => {
        burndownData.push({
          x: moment(point.date).toDate(),
          y: point.budget
        })
      })
      burndownsArr.push({
        data: burndownData,
        label: `${sprint.name}`,
        ...getBasicLineSettings(randomnedColor)
      })
    })
    return burndownsArr
  } 

  render() {
    return (
      <div className={css.BudgetChart}>
        <h3>Без рискового бюджета</h3>
        <div className={css.BudgetChartInfo}>
          Бюджет:
          <Input readOnly value={this.props.budget ? `${this.props.budget} ч.` : ''} />
        </div>
        <Line data={this.state.chartData} options={this.chartOptions} redraw/>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  createdAt: state.Project.project.createdAt,
  completedAt: state.Project.project.completedAt,
  budget: state.Project.project.budget,
  riskBudget: state.Project.project.riskBudget,
  sprints: state.Project.project.sprints
});
export default connect(mapStateToProps)(BudgetChart)