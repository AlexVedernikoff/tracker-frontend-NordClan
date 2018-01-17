import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './Metrics.scss';
import StartEndDates from './StartEndDates/StartEndDates';
import BudgetChart from './BudgetChart/BudgetChart';
import BugsChart from './BugsChart/BugsChart';
import CostByRoleChart from './CostByRoleChart/CostByRoleChart';
import ClosingFeaturesChart from './ClosingFeaturesChart';
import SprintReport from './Report';
import { getMetrics } from './../../../actions/Metrics';
import moment from 'moment';

class Metrics extends Component {
  static propTypes = {
    budget: PropTypes.number,
    completedAt: PropTypes.string,
    createdAt: PropTypes.string,
    metrics: PropTypes.array,
    riskBudget: PropTypes.number,
    sprints: PropTypes.array,
    getMetrics: PropTypes.func,
    params: PropTypes.object
  }

  constructor (props) {
    super(props);
  }

  componentWillMount () {
    const { getMetrics, params, createdAt } = this.props;
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

  render () {
    /*
      значение Id типов метрик
      http://gitlab.simbirsoft/frontend/sim-track-back/blob/develop/server/services/agent/calculate/metrics.txt
    */
    const { metrics } = this.props;

    const projectBudgetMetrics = this.filterById(5, metrics);
    const sprintsBudgetMetrics = this.filterById(30, metrics);
    const projectBudgetRisksMetrics = this.filterById(6, metrics);
    const sprintsBudgetRisksMetrics = this.filterById(31, metrics);
    const openedBugsMetrics = this.filterById(7, metrics);
    const openedCustomerBugsMetrics = this.filterById(8, metrics);
    const openedRegressBugsMetrics = this.filterById(9, metrics);
    const sprintClosingFeaturesMetrics = this.filterById(32, metrics);
    const getCostByRoleMetrics = (role1, role2, role3, role4, role5, role6, role7, role8, role9, role10) => [
      {
        metrics: role1,
        name: 'Account'
      },
      {
        metrics: role2,
        name: 'PM'
      },
      {
        metrics: role3,
        name: 'UX'
      },
      {
        metrics: role4,
        name: 'Аналитик'
      },
      {
        metrics: role5,
        name: 'Back'
      },
      {
        metrics: role6,
        name: 'Front'
      },
      {
        metrics: role7,
        name: 'Mobile'
      },
      {
        metrics: role8,
        name: 'TeamLead(Code review)'
      },
      {
        metrics: role9,
        name: 'QA'
      },
      {
        metrics: role10,
        name: 'Unbillable'
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

    return (
      <div>
        <section className={css.Metrics}>
          <SprintReport startDate={this.startDate()} endDate={this.endDate()}/>
          <h2>Метрики по проекту</h2>
          <StartEndDates startDate={this.startDate()} endDate={this.endDate()}/>
          <Row>
            <Col xs={12} md={10} mdOffset={1} lg={6} lgOffset={0}>
              <BudgetChart
                startDate={this.startDate()}
                endDate={this.endDate()}
                projectBudgetMetrics={projectBudgetMetrics}
                sprintsBudgetMetrics={sprintsBudgetMetrics}
                isRisks={false}
              />
            </Col>
            <Col xs={12} md={10} mdOffset={1} lg={6} lgOffset={0}>
              <BudgetChart
                startDate={this.startDate()}
                endDate={this.endDate()}
                projectBudgetMetrics={projectBudgetRisksMetrics}
                sprintsBudgetMetrics={sprintsBudgetRisksMetrics}
                isRisks={true}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={10} mdOffset={1} lg={6} lgOffset={3} >
              <BugsChart
                openedBugsMetrics={openedBugsMetrics}
                openedCustomerBugsMetrics={openedCustomerBugsMetrics}
                openedRegressBugsMetrics={openedRegressBugsMetrics}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={10} mdOffset={1} lg={6} lgOffset={3} >
              <CostByRoleChart
                costByRoleMetrics={costByRoleMetrics}
                costByRolePercentMetrics={costByRolePercentMetrics}
              />
            </Col>
          </Row>
          <h2>Метрики по спринту</h2>
          <Row>
            <ClosingFeaturesChart
              startDate={this.startDate()}
              endDate={this.endDate()}
              sprintClosingFeaturesMetrics={sprintClosingFeaturesMetrics}
            />
          </Row>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  createdAt: state.Project.project.createdAt,
  completedAt: state.Project.project.completedAt,
  budget: state.Project.project.budget,
  riskBudget: state.Project.project.riskBudget,
  sprints: state.Project.project.sprints,
  metrics: state.Project.project.metrics
});

const mapDispatchToProps = {
  getMetrics
};

export default connect(mapStateToProps, mapDispatchToProps)(Metrics);
