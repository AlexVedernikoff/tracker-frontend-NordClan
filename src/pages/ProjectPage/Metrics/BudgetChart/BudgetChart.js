import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './BudgetChart.scss';
import ChartWrapper from '../ChartWrapper';
import Input from '../../../../components/Input';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import sortChartLineByDates from '../../../../utils/sortChartLineByDates';
import roundNum from '../../../../utils/roundNum';
import getColor from '../../../../utils/Colors';
import localize from './BudgetChart.json';

class BudgetChart extends Component {
  static propTypes = {
    budget: PropTypes.number,
    chartDefaultOptions: PropTypes.object,
    endDate: PropTypes.string,
    getBasicLineSettings: PropTypes.func,
    isRisks: PropTypes.bool,
    projectBudgetMetrics: PropTypes.array,
    riskBudget: PropTypes.number,
    sprints: PropTypes.array,
    sprintsBudgetMetrics: PropTypes.array,
    startDate: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      chartRef: null
    };
  }

  componentDidMount() {
    this.setState({ chartRef: this.refs.chart });
  }

  getGraphicOptions() {
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
              labelString: localize[this.props.lang].BUDGET
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
      isRisks,
      lang
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
      label: localize[this.props.lang].IDEALLY_FOR_ALL,
      ...this.props.getBasicLineSettings()
    };
  };

  makeProjectBurndown = (metrics, startDate, budget, riskBudget, isRisks) => {
    const burndown = metrics
      .map(metric => {
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
      label: localize[this.props.lang].ALL_PROJECT,
      ...this.props.getBasicLineSettings()
    };
  };

  makeSprintsIdealBurndowns = (sprints, isRisks) => {
    return sprints.map(sprint => {
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
        label: `${localize[this.props.lang].IDEALLY} ${sprint.name}`,
        ...this.props.getBasicLineSettings()
      };
    });
  };

  makeSprintsBurndowns = (metrics, sprints, isRisks) => {
    return sprints.map(sprint => {
      const sprintMetrics = metrics.filter(metric => metric.sprintId === sprint.id);
      const burndown = sprintMetrics
        .map(metric => {
          return {
            x: metric.createdAt,
            y: roundNum(+metric.value, 2)
          };
        })
        .sort(sortChartLineByDates);
      const fullBurndown = [
        {
          x: sprint.factStartDate,
          y: isRisks ? sprint.riskBudget || 0 : sprint.budget || 0
        },
        ...burndown
      ];
      return {
        data: fullBurndown,
        label: `${sprint.name}`,
        ...this.props.getBasicLineSettings()
      };
    });
  };

  render() {
    const { isRisks, budget, riskBudget } = this.props;
    return (
      <div className={css.BudgetChart}>
        <h3>{isRisks ? `${localize[this.props.lang].WITH_RISK}` : `${localize[this.props.lang].WITHOUT_RISK}`}</h3>
        <div className={css.BudgetChartInfo}>
          {localize[this.props.lang].BUDGET}
          <Input
            readOnly
            value={
              isRisks
                ? `${riskBudget || 0} ${localize[this.props.lang].H}`
                : `${budget || 0} ${localize[this.props.lang].H}`
            }
          />
        </div>
        <ChartWrapper chartRef={this.state.chartRef}>
          <Line ref="chart" height={250} data={this.makeChartData()} options={this.getGraphicOptions()} redraw />
        </ChartWrapper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  budget: state.Project.project.budget,
  riskBudget: state.Project.project.riskBudget,
  sprints: state.Project.project.sprints,
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(BudgetChart);
