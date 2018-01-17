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
    const { getMetrics, params } = this.props;
    const metricsParams = {
      projectId: parseInt(params.projectId),
      // typeId: 6,
      // sprintId: 1,
      // userId: 1,
      startDate: '2017-11-20',
      endDate: '2018-01-12'
    };
    getMetrics(metricsParams);
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
    return metrics.filter(metric => metric.typeId === id);
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
    const costByRoleMetrics = [
      {
        metrics: this.filterById(10, metrics),
        name: 'Account'
      },
      {
        metrics: this.filterById(11, metrics),
        name: 'PM'
      },
      {
        metrics: this.filterById(12, metrics),
        name: 'UX'
      },
      {
        metrics: this.filterById(13, metrics),
        name: 'Аналитик'
      },
      {
        metrics: this.filterById(14, metrics),
        name: 'Back'
      },
      {
        metrics: this.filterById(15, metrics),
        name: 'Front'
      },
      {
        metrics: this.filterById(16, metrics),
        name: 'Mobile'
      },
      {
        metrics: this.filterById(17, metrics),
        name: 'TeamLead(Code review)'
      },
      {
        metrics: this.filterById(18, metrics),
        name: 'QA'
      },
      {
        metrics: this.filterById(19, metrics),
        name: 'Unbillable'
      }
    ];
    const costByRolePercentMetrics = [
      {
        metrics: this.filterById(20, metrics),
        name: 'Account'
      },
      {
        metrics: this.filterById(21, metrics),
        name: 'PM'
      },
      {
        metrics: this.filterById(22, metrics),
        name: 'UX'
      },
      {
        metrics: this.filterById(23, metrics),
        name: 'Аналитик'
      },
      {
        metrics: this.filterById(24, metrics),
        name: 'Back'
      },
      {
        metrics: this.filterById(25, metrics),
        name: 'Front'
      },
      {
        metrics: this.filterById(26, metrics),
        name: 'Mobile'
      },
      {
        metrics: this.filterById(27, metrics),
        name: 'TeamLead(Code review)'
      },
      {
        metrics: this.filterById(28, metrics),
        name: 'QA'
      },
      {
        metrics: this.filterById(29, metrics),
        name: 'Unbillable'
      }
    ];
    // const costBySprintMetrics = [
    //   {
    //     metrics: this.filterById(30, metrics),
    //     name: 'Burndown по спринтам без РР'
    //   },
    //   {
    //     metrics: this.filterById(31, metrics),
    //     name: 'Burndown по спринтам с РР'
    //   },
    //   {
    //     metrics: this.filterById(32, metrics),
    //     name: 'Динамика закрытия фич (с учетом трудозатрат)'
    //   },
    //   {
    //     metrics: this.filterById(33, metrics),
    //     name: 'Трудозатраты на фичи без оценки'
    //   },
    //   {
    //     metrics: this.filterById(34, metrics),
    //     name: 'Динамика списания времени на фичи'
    //   },
    //   {
    //     metrics: this.filterById(35, metrics),
    //     name: 'Фича'
    //   },
    //   {
    //     metrics: this.filterById(36, metrics),
    //     name: 'Доп. Фича'
    //   },
    //   {
    //     metrics: this.filterById(37, metrics),
    //     name: 'Баг'
    //   },
    //   {
    //     metrics: this.filterById(38, metrics),
    //     name: 'Регрес. Баг'
    //   },
    //   {
    //     metrics: this.filterById(39, metrics),
    //     name: 'Баг от клиента'
    //   },
    //   {
    //     metrics: this.filterById(40, metrics),
    //     name: 'Количество фич без оценки'
    //   },
    //   {
    //     metrics: this.filterById(41, metrics),
    //     name: 'Количество открытых фич вне плана'
    //   }
    // ];

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
