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
import Tabs from '../../../components/Tabs';
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

  filterById = (id, metrics) => {
    return metrics ? metrics.filter((metric) => metric.typeId === id) : [];
  };

  getBasicLineSettings = () => {
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
    const projectBudgetMetrics = this.filterById(5, metrics);
    const sprintsBudgetMetrics = this.filterById(30, metrics);

    /*Бюджет с рисковым резервом*/
    const projectBudgetRisksMetrics = this.filterById(6, metrics);
    const sprintsBudgetRisksMetrics = this.filterById(31, metrics);

    /*Баги на проекте*/
    const openedBugsMetrics = this.filterById(7, metrics);
    const openedCustomerBugsMetrics = this.filterById(8, metrics);
    const openedRegressBugsMetrics = this.filterById(9, metrics);

    /*Затраты по ролям*/
    const getCostByRoleMetrics = (...costsByRoles) => {
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

      return costsByRoles.map((costByRole, index) => {
        return {
          metrics: costByRole,
          name: roles[index]
        };
      });
    };

    const costByRolePercentMetrics = getCostByRoleMetrics(
      this.filterById(10, metrics),
      this.filterById(11, metrics),
      this.filterById(12, metrics),
      this.filterById(13, metrics),
      this.filterById(14, metrics),
      this.filterById(15, metrics),
      this.filterById(16, metrics),
      this.filterById(17, metrics),
      this.filterById(18, metrics),
      this.filterById(19, metrics)
    );
    const costByRoleMetrics = getCostByRoleMetrics(
      this.filterById(20, metrics),
      this.filterById(21, metrics),
      this.filterById(22, metrics),
      this.filterById(23, metrics),
      this.filterById(24, metrics),
      this.filterById(25, metrics),
      this.filterById(26, metrics),
      this.filterById(27, metrics),
      this.filterById(28, metrics),
      this.filterById(29, metrics)
    );

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
    const Pane = (props) => {
      return <div>{props.children}</div>;
    };
    Pane.propTypes = {
      label: PropTypes.string.isRequired
    };
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
                        getBasicLineSettings={this.getBasicLineSettings}
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
                        getBasicLineSettings={this.getBasicLineSettings}
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
                    getBasicLineSettings={this.getBasicLineSettings}
                    startDate={this.startDate()}
                    endDate={this.endDate()}
                    openedBugsMetrics={openedBugsMetrics}
                    openedCustomerBugsMetrics={openedCustomerBugsMetrics}
                    filterById={this.filterById}
                  />
                </Pane>
                <Pane label="Баги на проекте" path="/bugs">
                  <Row>
                    <Col xs={12}>
                      <BugsChart
                        chartDefaultOptions={chartDefaultOptions}
                        getBasicLineSettings={this.getBasicLineSettings}
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
                        getBasicLineSettings={this.getBasicLineSettings}
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
