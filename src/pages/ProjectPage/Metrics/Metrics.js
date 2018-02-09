import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './Metrics.scss';
import StartEndDates from './StartEndDates';
import BudgetChart from './BudgetChart';
import BugsChart from './BugsChart';
import CostByRoleChart from './CostByRoleChart';
import SprintReport from './Report';
import SprintMetrics from './SprintMetrics';
import { getMetrics } from './../../../actions/Metrics';
import moment from 'moment';
import getRandomColor from '../../../utils/getRandomColor';
import { ADMIN } from '../../../constants/Roles';
import Tabs from '../../../components/Tabs';

class Metrics extends Component {
  static propTypes = {
    projectId: PropTypes.number,
    budget: PropTypes.number,
    completedAt: PropTypes.string,
    createdAt: PropTypes.string,
    getMetrics: PropTypes.func,
    metrics: PropTypes.array,
    params: PropTypes.object,
    riskBudget: PropTypes.number,
    sprints: PropTypes.array,
    user: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
  }

  componentWillMount () {
    const { getMetrics, params, createdAt} = this.props;
    if (createdAt) {
      const metricsParams = {
        projectId: parseInt(params.projectId),
        startDate: moment(this.props.createdAt).format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
      };
      getMetrics(metricsParams);
    }
  }

  componentWillReceiveProps (nextProps) {
    const { getMetrics, params, createdAt } = this.props;
    if (nextProps.createdAt !== createdAt) {
      const metricsParams = {
        projectId: parseInt(params.projectId),
        startDate: moment(nextProps.createdAt).format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
      };
      getMetrics(metricsParams);
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
    return metrics ? metrics.filter(metric => metric.typeId === id) : [];
  }

  getBasicLineSettings = () => {
    const randomnedColor = getRandomColor();
    return {
      backgroundColor: randomnedColor,
      borderColor: randomnedColor,
      fill: false,
      lineTension: 0,
      borderWidth: 1,
      pointRadius: 1
    };
  };

  checkIsAdminInProject = () => {
    return this.props.user.projectsRoles && this.props.user.projectsRoles.admin.indexOf(this.props.projectId) !== -1
      || this.props.user.globalRole === ADMIN;
  };

  render () {
    /*
      значение Id типов метрик
      http://gitlab.simbirsoft/frontend/sim-track-back/blob/develop/server/services/agent/calculate/metrics.txt
    */
    const { metrics } = this.props;

    const isProjectAdmin = this.checkIsAdminInProject();

    /*Бюджет без рискового резерва*/
    const projectBudgetMetrics = this.filterById(6, metrics);
    const sprintsBudgetMetrics = this.filterById(30, metrics);

    /*Бюджет с рисковым резервом*/
    const projectBudgetRisksMetrics = this.filterById(5, metrics);
    const sprintsBudgetRisksMetrics = this.filterById(31, metrics);

    /*Баги на проекте*/
    const openedBugsMetrics = this.filterById(7, metrics);
    const openedCustomerBugsMetrics = this.filterById(8, metrics);
    const openedRegressBugsMetrics = this.filterById(9, metrics);

    
    /*Затраты по ролям*/
    const getCostByRoleMetrics = (role1, role2, role3, role4, role5, role6, role7, role8, role9, role10) => [
      {
        metrics: role1,
        name: 'Account',
        color: '#dcecc9'
      },
      {
        metrics: role2,
        name: 'PM',
        color: '#aadacc'
      },
      {
        metrics: role3,
        name: 'UX',
        color: '#78c6d0'
      },
      {
        metrics: role4,
        name: 'Аналитик',
        color: '#48b3d3'
      },
      {
        metrics: role5,
        name: 'Back',
        color: '#3e94c0'
      },
      {
        metrics: role6,
        name: 'Front',
        color: '#3474ac'
      },
      {
        metrics: role7,
        name: 'Mobile',
        color: '#2a5599'
      },
      {
        metrics: role8,
        name: 'TeamLead(Code review)',
        color: '#203686'
      },
      {
        metrics: role9,
        name: 'QA',
        color: '#18216b'
      },
      {
        metrics: role10,
        name: 'Unbillable',
        color: '#11174b'
      }
    ];
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
        }
      },
      scales: {
        xAxes: [{
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
        }]
      }
    };

    return (
      <div>
        <section className={css.Metrics}>
          <SprintReport startDate={this.startDate()} endDate={this.endDate()}/>
          {isProjectAdmin ? <div>
            <h2>Метрики по проекту</h2>
            <StartEndDates startDate={this.startDate()} endDate={this.endDate()}/>
            <Row className = {css.rowBorder}>
              <Col xs={12} md={10} mdOffset={1} lg={6} lgOffset={0}>
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
              <Col xs={12} md={10} mdOffset={1} lg={6} lgOffset={0}>
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
            <Row className = {css.rowBorder}>
              <Col xs={12} md={10} mdOffset={1} lg={8} lgOffset={2} >
                <BugsChart
                  chartDefaultOptions={chartDefaultOptions}
                  getBasicLineSettings={this.getBasicLineSettings}
                  openedBugsMetrics={openedBugsMetrics}
                  openedCustomerBugsMetrics={openedCustomerBugsMetrics}
                  openedRegressBugsMetrics={openedRegressBugsMetrics}
                />
              </Col>
            </Row>
            <Row className = {css.rowBorder}>
              <Col xs={12} md={10} mdOffset={1} lg={8} lgOffset={2} >
                <CostByRoleChart
                  chartDefaultOptions={chartDefaultOptions}
                  getBasicLineSettings={this.getBasicLineSettings}
                  costByRoleMetrics={costByRoleMetrics}
                  costByRolePercentMetrics={costByRolePercentMetrics}
                />
              </Col>
            </Row>
            <SprintMetrics
              chartDefaultOptions={chartDefaultOptions}
              getBasicLineSettings={this.getBasicLineSettings}
              startDate={this.startDate()}
              endDate={this.endDate()}
              openedBugsMetrics={openedBugsMetrics}
              openedCustomerBugsMetrics={openedCustomerBugsMetrics}
              filterById={this.filterById}
            />
          </div> : null}
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
  metrics: state.Project.project.metrics,
  user: state.Auth.user
});

const mapDispatchToProps = {
  getMetrics
};

export default connect(mapStateToProps, mapDispatchToProps)(Metrics);
