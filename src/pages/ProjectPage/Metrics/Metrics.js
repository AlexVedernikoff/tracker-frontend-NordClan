import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './Metrics.scss';
import StartEndDates from './StartEndDates';
import { Chart } from 'react-chartjs-2';
import BudgetChart from './BudgetChart';
import BugsChart from './BugsChart';
import CostByRoleChart from './CostByRoleChart';
import SprintReport from './Report';
import SprintMetrics from './SprintMetrics';
import { getMetrics } from './../../../actions/Metrics';
import moment from 'moment';
import getColor from '../../../utils/Colors';
import { chartDefaultOptions, modifyZoomPlugin } from '../../../utils/Charts';
import { ADMIN } from '../../../constants/Roles';
import { checkIsViewer } from '../../../helpers/RoleValidator';
import * as MetricTypes from '../../../constants/Metrics';
import Tabs from '../../../components/Tabs';
import Pane from '../../../components/Pane';
import Button from '../../../components/Button';
import localize from './Metrics.json';
import TeamMetrics from './TeamMetrics';

const filterMetrics = (id, metrics) => {
  return metrics ? metrics.filter(metric => metric.typeId === id) : [];
};

const getBasicLineSettings = () => {
  const lineColor = getColor();

  return {
    lineTension: 0.4,
    borderWidth: 2,
    pointRadius: 2,
    borderColor: lineColor,
    backgroundColor: lineColor,
    fill: false,
    steppedLine: true
  };
};

class Metrics extends Component {
  static propTypes = {
    budget: PropTypes.number,
    completedAt: PropTypes.string,
    createdAt: PropTypes.string,
    getMetrics: PropTypes.func,
    lang: PropTypes.string,
    loading: PropTypes.number,
    location: PropTypes.object,
    metrics: PropTypes.array,
    params: PropTypes.object,
    projectId: PropTypes.number,
    riskBudget: PropTypes.number,
    sprints: PropTypes.array,
    user: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { params, createdAt } = this.props;

    if (createdAt) {
      const metricsParams = this.getMetricsParams(createdAt, params.projectId);
      this.props.getMetrics(metricsParams);
    }
  }

  componentDidMount() {
    Chart.pluginService.register(modifyZoomPlugin);
  }

  componentWillReceiveProps(nextProps) {
    const { params, createdAt } = this.props;

    if (nextProps.createdAt !== createdAt) {
      const metricsParams = this.getMetricsParams(nextProps.createdAt, params.projectId);
      this.props.getMetrics(metricsParams);
    }
  }

  getMetricsParams = (createdAt, projectId, endDate) => ({
    projectId: parseInt(projectId),
    startDate: moment(createdAt).format('YYYY-MM-DD HH:mm'),
    endDate: endDate ? endDate : null
  });

  recalculateMetrics = () => {
    if (!this.props.loading) {
      const { params, createdAt } = this.props;
      const metricsParams = this.getMetricsParams(createdAt, params.projectId);

      this.props.getMetrics({
        ...metricsParams,
        recalculate: true
      });
    }
  };

  startDate() {
    if (this.props.createdAt) {
      return this.props.createdAt;
    } else if (this.props.sprints.length > 0) {
      return this.props.sprints[0].factStartDate;
    }
    return '';
  }

  endDate() {
    if (this.props.completedAt) {
      return this.props.completedAt;
    } else if (this.props.sprints.length > 0) {
      return this.props.sprints[this.props.sprints.length - 1].factFinishDate;
    }
    return '';
  }

  checkIsAdminInProject = () => {
    return (
      (this.props.user.projectsRoles && this.props.user.projectsRoles.admin.indexOf(this.props.projectId) !== -1) ||
      this.props.user.globalRole === ADMIN
    );
  };

  render() {
    /*
      значение Id типов метрик
      http://gitlab.simbirsoft/frontend/sim-track-back/blob/develop/server/services/agent/calculate/metrics.txt
    */

    const { metrics, loading, lang } = this.props;

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
        'Unbillable',
        'Android',
        'IOS',
        'DevOps'
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
      MetricTypes.UNBILLABLE_COST_PERCENTAGE,
      MetricTypes.ANDROID_COST_PERCENTAGE,
      MetricTypes.IOS_COST_PERCENTAGE,
      MetricTypes.DEVOPS_COST_PERCENTAGE
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
      MetricTypes.UNBILLABLE_COST,
      MetricTypes.ANDROID_COST,
      MetricTypes.IOS_COST,
      MetricTypes.DEVOPS_COST
    );

    return (
      <div>
        <section className={css.Metrics}>
          {isProjectAdmin || checkIsViewer(this.props.user.globalRole) ? (
            <div>
              <Button
                addedClassNames={{ [css.recalculateBtn]: true }}
                onClick={this.recalculateMetrics}
                type="bordered"
                loading={!!loading}
                icon={'IconRefresh'}
                data-tip={localize[lang].RECALCULATE}
              />
              <Tabs
                addedClassNames={{ [css.tabs]: true }}
                selected={this.props.params.metricType}
                currentPath={`/projects/${this.props.params.projectId}/analytics`}
                state={this.props.location.state}
                routable
              >
                <Pane label={localize[lang].UNLOAD} path="/download">
                  <SprintReport startDate={this.startDate()} endDate={this.endDate()} />
                </Pane>
                <Pane label={localize[lang].METRICS_BY_PROJECT} path="/project">
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
                <Pane label={localize[lang].METRICS_BY_SPRINT} path="/sprint">
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
                <Pane label={localize[lang].BUGS_ON_PROJECT} path="/bugs">
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
                <Pane label={localize[lang].COST_BY_ROLE} path="/expenses">
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
                <Pane label={localize[lang].METRICS_BY_TEAM} path="/team">
                  <Row>
                    <Col xs={12}>
                      <TeamMetrics />
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

const mapStateToProps = state => ({
  projectId: state.Project.project.id,
  createdAt: state.Project.project.createdAt,
  completedAt: state.Project.project.completedAt,
  budget: state.Project.project.budget,
  riskBudget: state.Project.project.riskBudget,
  sprints: state.Project.project.sprints,
  lang: state.Localize.lang,
  loading: state.Loading.loading,
  metrics: state.Project.project.metrics,
  user: state.Auth.user
});

const mapDispatchToProps = {
  getMetrics
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Metrics);
