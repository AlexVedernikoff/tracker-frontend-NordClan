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
    budget: PropTypes.number,
    riskBudget: PropTypes.number,
    sprints: PropTypes.array,
    projectBudgetMetrics: PropTypes.array,
    sprintsBudgetMetrics: PropTypes.array,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    isRisks: PropTypes.bool
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
  }

  makeChartData (metrics) {
    const {
      projectBudgetMetrics,
      sprintsBudgetMetrics,
      budget,
      riskBudget,
      startDate,
      endDate,
      sprints,
      isRisks
    } = this.props;
    const sprintsId = sprints.map(sprint => sprint.id);
    return {
      datasets: [
        this.makeIdealProjectBurndown(startDate, endDate, budget, riskBudget, isRisks),
        this.makeProjectBurndown(projectBudgetMetrics),
        ...this.makeSprintsBurndowns(sprintsBudgetMetrics, sprints),
        ...this.makeSprintsIdealBurndowns(sprints, isRisks)
      ]
    };
  }

  makeIdealProjectBurndown (startDate, endDate, budget, riskBudget, isRisks) {
    const randomnedColor = getRandomColor();
    return {
      data: [
        {
          x: startDate,
          y: isRisks ? riskBudget : budget
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

  makeSprintsIdealBurndowns (sprints, isRisks) {
    return sprints.map(sprint => {
      const randomnedColor = getRandomColor();
      const idealBurndown = [
        {
          x: sprint.factStartDate,
          y: isRisks ? sprint.riskBudget || 0 : sprint.budget || 0
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
  }

  render () {
    const {isRisks, budget, riskBudget} = this.props;
    return (
      <div className={css.BudgetChart}>
        <h3>{isRisks ? 'С рисковым резервом' : 'Без рискового резерва'}</h3>
        <div className={css.BudgetChartInfo}>
          Бюджет:
          <Input readOnly value={isRisks ? `${riskBudget || 0} ч.` : `${budget || 0} ч`} />
        </div>
        <Line height={250} data={this.makeChartData(budgetMetricsMock)} options={this.chartOptions} redraw />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  budget: state.Project.project.budget,
  riskBudget: state.Project.project.riskBudget,
  sprints: state.Project.project.sprints
});

export default connect(mapStateToProps)(BudgetChart);
