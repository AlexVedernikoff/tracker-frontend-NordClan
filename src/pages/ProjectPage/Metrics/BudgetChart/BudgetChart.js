import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './BudgetChart.scss';
import Input from '../../../../components/Input';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import sortChartLineByDates from '../../../../utils/sortChartLineByDates';
import roundNum from '../../../../utils/roundNum';
import getColor from '../../../../utils/Colors';

class BudgetChart extends Component {
  static propTypes = {
    basicLineSettings: PropTypes.object,
    budget: PropTypes.number,
    chartDefaultOptions: PropTypes.object,
    endDate: PropTypes.string,
    isRisks: PropTypes.bool,
    projectBudgetMetrics: PropTypes.array,
    riskBudget: PropTypes.number,
    sprints: PropTypes.array,
    sprintsBudgetMetrics: PropTypes.array,
    startDate: PropTypes.string
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
              labelString: 'Бюджет'
            }
          }
        ]
      }
    };
  }

  makeChartData = () => {
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

    getColor.reset();

    return {
      datasets: [
        this.makeIdealProjectBurndown(startDate, endDate, budget, riskBudget, isRisks),
        this.makeProjectBurndown(projectBudgetMetrics, startDate, budget, riskBudget, isRisks),
        ...this.makeSprintsBurndowns(sprintsBudgetMetrics, sprints),
        ...this.makeSprintsIdealBurndowns(sprints, isRisks)
      ]
    };
  };

  makeIdealProjectBurndown = (startDate, endDate, budget, riskBudget, isRisks) => {
    const lineColor = getColor();

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
      borderColor: lineColor,
      backgroundColor: lineColor,
      ...this.props.basicLineSettings
    };
  };

  makeProjectBurndown = (metrics, startDate, budget, riskBudget, isRisks) => {
    const lineColor = getColor();
    const burndown = metrics
      .map((metric) => {
        return {
          x: metric.createdAt,
          y: roundNum(+metric.value, 2)
        };
      })
      .concat({
        x: startDate,
        y: isRisks ? riskBudget : budget
      })
      .sort(sortChartLineByDates);
    return {
      data: [...burndown],
      label: 'Весь проект',
      borderColor: lineColor,
      backgroundColor: lineColor,
      ...this.props.basicLineSettings
    };
  };

  makeSprintsIdealBurndowns = (sprints, isRisks) => {
    return sprints.map((sprint) => {
      const lineColor = getColor();
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
        borderColor: lineColor,
        backgroundColor: lineColor,
        ...this.props.basicLineSettings
      };
    });
  };

  makeSprintsBurndowns = (metrics, sprints) => {
    return sprints.map((sprint) => {
      const lineColor = getColor();
      const sprintMetrics = metrics.filter((metric) => metric.sprintId === sprint.id);
      const burndown = sprintMetrics
        .map((metric) => {
          return {
            x: metric.createdAt,
            y: roundNum(+metric.value, 2)
          };
        })
        .sort(sortChartLineByDates);
      return {
        data: burndown,
        label: `${sprint.name}`,
        borderColor: lineColor,
        backgroundColor: lineColor,
        ...this.props.basicLineSettings
      };
    });
  };

  render () {
    const { isRisks, budget, riskBudget } = this.props;
    return (
      <div className={css.BudgetChart}>
        <h3>{isRisks ? 'С рисковым резервом' : 'Без рискового резерва'}</h3>
        <div className={css.BudgetChartInfo}>
          Бюджет:
          <Input readOnly value={isRisks ? `${riskBudget || 0} ч.` : `${budget || 0} ч`} />
        </div>
        <Line height={250} data={this.makeChartData()} options={this.chartOptions} redraw />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  budget: state.Project.project.budget,
  riskBudget: state.Project.project.riskBudget,
  sprints: state.Project.project.sprints
});

export default connect(mapStateToProps)(BudgetChart);
