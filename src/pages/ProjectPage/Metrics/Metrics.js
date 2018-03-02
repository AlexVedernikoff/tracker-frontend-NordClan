import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './Metrics.scss';
import StartEndDates from './StartEndDates';
import { defaults } from 'react-chartjs-2';
import BudgetChart from './BudgetChart';
import BugsChart from './BugsChart';
import CostByRoleChart from './CostByRoleChart';
import SprintReport from './Report';
import SprintMetrics from './SprintMetrics';
import { getMetrics, calculateMetrics } from './../../../actions/Metrics';
import moment from 'moment';
import getColor from '../../../utils/Colors';
import { ADMIN } from '../../../constants/Roles';
import * as MetricTypes from '../../../constants/Metrics';
import Tabs from '../../../components/Tabs';
import Pane from '../../../components/Pane';
import Button from '../../../components/Button';

class Metrics extends Component {
  static propTypes = {
    budget: PropTypes.number,
    completedAt: PropTypes.string,
    createdAt: PropTypes.string,
    getMetrics: PropTypes.func,
    loading: PropTypes.number,
    metrics: PropTypes.array,
    params: PropTypes.object,
    projectId: PropTypes.number,
    riskBudget: PropTypes.number,
    sprints: PropTypes.array,
    user: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
  }

  componentWillMount () {
    const { getMetrics, params, createdAt } = this.props;

    if (createdAt) {
      const metricsParams = this.getMetricsParams(createdAt, params.projectId);
      getMetrics(metricsParams);
    }
  }

  componentWillReceiveProps (nextProps) {
    const { getMetrics, params, createdAt } = this.props;

    if (nextProps.createdAt !== createdAt) {
      const metricsParams = this.getMetricsParams(nextProps.createdAt, params.projectId);
      getMetrics(metricsParams);
    }
  }

  getMetricsParams = (createdAt, projectId) => ({
    projectId: parseInt(projectId),
    startDate: moment(createdAt).format('YYYY-MM-DD HH:mm'),
    endDate: moment().format('YYYY-MM-DD HH:mm')
  });


  recalculateMetrics = () => {
    if (!this.props.loading) {
      const { getMetrics, params, createdAt } = this.props;
      const metricsParams = this.getMetricsParams(createdAt, params.projectId);

      getMetrics({
        ...metricsParams,
        recalculate: true
      });
    }
  }

  startDate () {
    if (this.props.createdAt) {
      return this.props.createdAt;
    } else if (this.props.sprints.length > 0) {
      return this.props.sprints[0].factStartDate;
    }
    return '';
  }

  endDate () {
    if (this.props.completedAt) {
      return this.props.completedAt;
    } else if (this.props.sprints.length > 0) {
      return this.props.sprints[this.props.sprints.length - 1].factFinishDate;
    }
    return '';
  }

  checkIsAdminInProject = () => {
    return (
      (this.props.user.projectsRoles && this.props.user.projectsRoles.admin.indexOf(this.props.projectId) !== -1)
      || this.props.user.globalRole === ADMIN
    );
  };

  render () {
    /*
      значение Id типов метрик
      http://gitlab.simbirsoft/frontend/sim-track-back/blob/develop/server/services/agent/calculate/metrics.txt
    */

    const { metrics, loading } = this.props;

    const isProjectAdmin = this.checkIsAdminInProject();

    /*Бюджет без рискового резерва*/
    const projectBudgetMetrics = filterMetrics(MetricTypes.PROJECT_BUDGET_NO_RISK, metrics);
    const sprintsBudgetMetrics = filterMetrics(MetricTypes.SPRINT_BUDGET_NO_RISK, metrics);

    /*Бюджет с рисковым резервом*/
    const projectBudgetRisksMetrics = filterMetrics(MetricTypes.PROJECT_BUDGET_RISK, metrics);
    const sprintsBudgetRisksMetrics = filterMetrics(MetricTypes.SPRINT_BUDGET_RISK, metrics);

    /*Баги на проекте*/
    const openedBugsMetrics = filterMetrics(MetricTypes.OPENED_BUGS, metrics);
    const openedCustomerBugsMetrics = filterMetrics(MetricTypes.OPENED_CUSTOMER_BUGS, metrics);
    const openedRegressBugsMetrics = filterMetrics(MetricTypes.OPENED_REGRESSION_BUGS, metrics);

    /*Затраты по ролям*/
    const getCostByRoleMetrics = (...typeIds) => {
      const roles = [
        'Account',
        'PM',
        'UX',
        'Аналитик',
        'Back',
        'Front',
        'Mobile',
        'TeamLead(Code review)',
        'QA',
        'Unbillable'
      ];

      return typeIds.map((typeId, index) => {
        return {
          metrics: filterMetrics(typeId, metrics),
          name: roles[index]
        };
      });
    };

    const costByRolePercentMetrics = getCostByRoleMetrics(
      MetricTypes.ACCOUNT_COST_PERCENTAGE,
      MetricTypes.PM_COST_PERCENTAGE,
      MetricTypes.UX_COST_PERCENTAGE,
      MetricTypes.ANALYTIC_COST_PERCENTAGE,
      MetricTypes.BACK_COST_PERCENTAGE,
      MetricTypes.FRONT_COST_PERCENTAGE,
      MetricTypes.MOBILE_COST_PERCENTAGE,
      MetricTypes.TEAMLEAD_COST_PERCENTAGE,
      MetricTypes.QA_COST_PERCENTAGE,
      MetricTypes.UNBILLABLE_COST_PERCENTAGE
    );

    const costByRoleMetrics = getCostByRoleMetrics(
      MetricTypes.ACCOUNT_COST,
      MetricTypes.PM_COST,
      MetricTypes.UX_COST,
      MetricTypes.ANALYTIC_COST,
      MetricTypes.BACK_COST,
      MetricTypes.FRONT_COST,
      MetricTypes.MOBILE_COST,
      MetricTypes.TEAMLEAD_COST,
      MetricTypes.QA_COST,
      MetricTypes.UNBILLABLE_COST
    );

    return (
      <div>
        <section className={css.Metrics}>
          {isProjectAdmin ? (
            <div>
              <Button
                addedClassNames={{[css.recalculateBtn]: true}}
                onClick={this.recalculateMetrics}
                type="bordered"
                icon={loading ? 'IconPreloader' : 'IconRefresh'}
                data-tip="Пересчитать метрику"
              />
              <Tabs addedClassNames={{[css.tabs]: true}} selected={this.props.params.metricType} currentPath={`/projects/${this.props.params.projectId}/analytics`} routable>
                <Pane label="Выгрузка" path="/download">
                  <SprintReport startDate={this.startDate()} endDate={this.endDate()} />
                </Pane>
                <Pane label="Метрики по проекту" path="/project">
                  <StartEndDates startDate={this.startDate()} endDate={this.endDate()} />
                  <Row>
                    <Col xs={12} md={10} lg={6} lgOffset={0}>
                      <BudgetChart
                        startDate={this.startDate()}
                        endDate={this.endDate()}
                        chartDefaultOptions={chartDefaultOptions}
                        getBasicLineSettings={getBasicLineSettings}
                        projectBudgetMetrics={projectBudgetMetrics}
                        sprintsBudgetMetrics={sprintsBudgetMetrics}
                        isRisks={false}
                      />
                    </Col>
                    <Col xs={12} md={10} lg={6} lgOffset={0}>
                      <BudgetChart
                        startDate={this.startDate()}
                        endDate={this.endDate()}
                        chartDefaultOptions={chartDefaultOptions}
                        getBasicLineSettings={getBasicLineSettings}
                        projectBudgetMetrics={projectBudgetRisksMetrics}
                        sprintsBudgetMetrics={sprintsBudgetRisksMetrics}
                        isRisks
                      />
                    </Col>
                  </Row>
                </Pane>
                <Pane label="Метрики по спринту" path="/sprint">
                  <SprintMetrics
                    chartDefaultOptions={chartDefaultOptions}
                    getBasicLineSettings={getBasicLineSettings}
                    startDate={this.startDate()}
                    endDate={this.endDate()}
                    openedBugsMetrics={openedBugsMetrics}
                    openedCustomerBugsMetrics={openedCustomerBugsMetrics}
                    filterById={filterMetrics}
                  />
                </Pane>
                <Pane label="Баги на проекте" path="/bugs">
                  <Row>
                    <Col xs={12}>
                      <BugsChart
                        chartDefaultOptions={chartDefaultOptions}
                        getBasicLineSettings={getBasicLineSettings}
                        openedBugsMetrics={openedBugsMetrics}
                        openedCustomerBugsMetrics={openedCustomerBugsMetrics}
                        openedRegressBugsMetrics={openedRegressBugsMetrics}
                      />
                    </Col>
                  </Row>
                </Pane>
                <Pane label="Затраты по ролям" path="/expenses">
                  <Row>
                    <Col xs={12}>
                      <CostByRoleChart
                        chartDefaultOptions={chartDefaultOptions}
                        getBasicLineSettings={getBasicLineSettings}
                        costByRoleMetrics={costByRoleMetrics}
                        costByRolePercentMetrics={costByRolePercentMetrics}
                      />
                    </Col>
                  </Row>
                </Pane>
              </Tabs>
            </div>
          ) : null}
        </section>
      </div>
    );
  }
}

const chartDefaultOptions = {
  responsive: true,
  hover: { mode: 'nearest' },
  animation: {
    duration: 0
  },
  title: {
    display: false
  },
  legend: {
    position: 'bottom',
    labels: {
      usePointStyle: true
    },
    onClick: function (e, legendItem) {
      const chartItem = this.chart;
      const datasetIndex = legendItem.datasetIndex;
      const defaultLegendClickHandler = defaults.global.legend.onClick.bind(this);
      const dblClickDelay = 400;

      const legendDoubleClickHandler = () => {
        chartItem.data.datasets.forEach((el, index) => {
          const meta = chartItem.getDatasetMeta(index);

          if (index === datasetIndex) {
            meta.hidden = null;
          } else {
            meta.hidden = true;
          }
        });

        chartItem.update();
      };

      if (chartItem.clicked === datasetIndex) {
        legendDoubleClickHandler();
        clearTimeout(chartItem.clickTimeout);
        chartItem.clicked = false;
      } else {
        chartItem.clicked = datasetIndex;

        chartItem.clickTimeout = setTimeout(() => {
          chartItem.clicked = false;
          defaultLegendClickHandler(e, legendItem);
        }, dblClickDelay);
      }
    }
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          displayFormats: {
            day: 'D MMM'
          },
          tooltipFormat: 'DD.MM.YYYY'
        },
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Дата'
        }
      }
    ]
  }
};

const filterMetrics = (id, metrics) => {
  return metrics ? metrics.filter((metric) => metric.typeId === id) : [];
};

const getBasicLineSettings = () => {
  const lineColor = getColor();

  return {
    lineTension: 0,
    borderWidth: 2,
    pointRadius: 2,
    borderColor: lineColor,
    backgroundColor: lineColor,
    fill: false
  };
};

const mapStateToProps = (state) => ({
  projectId: state.Project.project.id,
  createdAt: state.Project.project.createdAt,
  completedAt: state.Project.project.completedAt,
  budget: state.Project.project.budget,
  riskBudget: state.Project.project.riskBudget,
  sprints: state.Project.project.sprints,
  loading: state.Loading.loading,
  metrics: state.Project.project.metrics,
  user: state.Auth.user
});

const mapDispatchToProps = {
  getMetrics
};

export default connect(mapStateToProps, mapDispatchToProps)(Metrics);
