import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './BudgetChart.scss';
import Input from '../../../../components/Input';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import moment from 'moment';
import getRandomColor from '../../../../utils/getRandomColor';
import { budgetMetricsMock } from '../../../../mocks/MetricsMock';

function getBasicLineSettings(color) {
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
    budget: PropTypes.number,
    sprints: PropTypes.array,
    projectBudgetMetrics: PropTypes.array,
    sprintsBudgetMetrics: PropTypes.array,
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }

  constructor (props) {
    super(props);
    this.chartOptions = {
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

    // this.state = {
    //   chartData: this.makeChartData(budgetMetricsMock)
    // };
    
  }

  makeChartData (metrics) {
    const {projectBudgetMetrics, sprintsBudgetMetrics, budget, startDate, endDate, sprints} = this.props;
    const sprintsId = sprints.map(sprint => sprint.id);
    console.log(this.makeSprintsIdealBurndowns(sprints));
    return {
      datasets: [
        this.makeIdealProjectBurndown(startDate, endDate, budget),
        this.makeProjectBurndown(projectBudgetMetrics),
        ...this.makeSprintsBurndowns(sprintsBudgetMetrics, sprints),
        ...this.makeSprintsIdealBurndowns(sprints)
      ]
    };
  }

  makeIdealProjectBurndown (startDate, endDate, budget) {
    const randomnedColor = getRandomColor();
    return {
      data: [
        {
          x: startDate,
          y: budget
        },
        {
          x: endDate,
          y: 0
        }
      ],
      label: 'Идеальная всего проекта',
      ...getBasicLineSettings(randomnedColor)
    };
  }

  makeProjectBurndown (metrics) {
    const randomnedColor = getRandomColor();
    const burndown = metrics.map(metric => {
      return {
        x: metric.createdAt,
        y: +metric.value
      };
    });
    return {
      data: [...burndown],
      label: 'Весь проект',
      ...getBasicLineSettings(randomnedColor)
    };
  }

  makeSprintsIdealBurndowns (sprints) {
    return sprints.map(sprint => {
      const randomnedColor = getRandomColor();
      const idealBurndown = [
        {
          x: sprint.factStartDate,
          y: sprint.budget || 0
        },
        {
          x: sprint.factFinishDate,
          y: 0
        }
      ];
      return {
        data: [...idealBurndown],
        label: `Идеальная ${sprint.name}`,
        ...getBasicLineSettings(randomnedColor)
      };
    });
  }

  makeSprintsBurndowns (metrics, sprints) {
    return sprints.map(sprint => {
      const randomnedColor = getRandomColor();
      const sprintMetrics = metrics.filter(metric => metric.sprintId === sprint.id);
      const burndown = sprintMetrics.map(metric => {
        return {
          x: metric.createdAt,
          y: +metric.value
        };
      });
      return {
        data: burndown,
        label: `${sprint.name}`,
        ...getBasicLineSettings(randomnedColor)
      };
    });
    // metrics.sprints.forEach(sprint => {
    //   const burndownData = [];
    //   const randomnedColor = getRandomColor();
    //   sprint.points.forEach(point => {
    //     burndownData.push({
    //       x: point.date,
    //       y: point.budget
    //     });
    //   });
    //   burndownsArr.push({
    //     data: burndownData,
    //     label: `${sprint.name}`,
    //     ...getBasicLineSettings(randomnedColor)
    //   });
    // });
    // return burndownsArr;
  }

  render () {
    return (
      <div className={css.BudgetChart}>
        <h3>Без рискового бюджета</h3>
        <div className={css.BudgetChartInfo}>
          Бюджет:
          <Input readOnly value={this.props.budget ? `${this.props.budget} ч.` : ''} />
        </div>
        <Line data={this.makeChartData(budgetMetricsMock)} options={this.chartOptions} redraw />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  budget: state.Project.project.budget,
  sprints: state.Project.project.sprints
});

export default connect(mapStateToProps)(BudgetChart);
