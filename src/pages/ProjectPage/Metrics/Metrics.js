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
import { getMetrics, calculateMetrics } from './../../../actions/Metrics';
import moment from 'moment';
import getRandomColor from '../../../utils/getRandomColor';
import { ADMIN } from '../../../constants/Roles';
import Tabs from '../../../components/Tabs';
import Button from '../../../components/Button';

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
    const { getMetrics, params, createdAt } = this.props;
    if (createdAt) {
      const metricsParams = {
        projectId: parseInt(params.projectId),
        startDate: moment(this.props.createdAt).format('YYYY-MM-DD HH:mm'),
        endDate: moment().format('YYYY-MM-DD HH:mm')
      };
      getMetrics(metricsParams);
    }
  }

  componentWillReceiveProps (nextProps) {
    const { getMetrics, params, createdAt } = this.props;
    if (nextProps.createdAt !== createdAt) {
      const metricsParams = {
        projectId: parseInt(params.projectId),
        startDate: moment(nextProps.createdAt).format('YYYY-MM-DD HH:mm'),
        endDate: moment().format('YYYY-MM-DD HH:mm')
      };
      getMetrics(metricsParams);
    }
  }

  calculate = () => {
    calculateMetrics(this.props.projectId);
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
    let getBasicLineSettings_count = 0;
    let prevColor;
    let randomnedColor;
    return () => {
      if (getBasicLineSettings_count === 0) {
        randomnedColor = getRandomColor();
        prevColor = randomnedColor;
        getBasicLineSettings_count++;
      } else {
        getBasicLineSettings_count = 0;
        randomnedColor = getRandomColor();

        /*const prev_r = parseInt(prevColor.substr(1, 3), 16);
        const prev_g = parseInt(prevColor.substr(3, 3), 16);
        const prev_b = parseInt(prevColor.substr(4, 3), 16);

        const cur_r = parseInt(randomnedColor.substr(1, 3), 16);
        const cur_g = parseInt(randomnedColor.substr(3, 3), 16);
        const cur_b = parseInt(randomnedColor.substr(5, 3), 16);

        const difference_r = Math.abs(prev_r - cur_r);
        const difference_g = Math.abs(prev_g - cur_g);
        const difference_b = Math.abs(prev_b - cur_b);

        if (
          difference_r < 0x40
          || difference_g < 0x40
          || difference_b < 0x40
          || (Math.abs(difference_r - difference_g) < 0x40
            || Math.abs(difference_g - difference_b) < 0x40
            || Math.abs(difference_b - difference_r) < 0x40)
          || (Math.sqrt(difference_r ^ (2 + difference_g) ^ 2)
            + Math.sqrt(difference_g ^ (2 + difference_b) ^ 2)
            + Math.sqrt(difference_b ^ (2 + difference_r) ^ 2))
            / 3
            < 80
        ) {
          randomnedColor = getRandomColor();
        }*/

        const parseColor = (color) => parseInt(color, 16) / 255;
        const parseColorToHSL = (color) => {
          let [result, r, g, b] = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(color);
          r = parseColor(r);
          g = parseColor(g);
          b = parseColor(b);
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h;
          let s;
          const l = (max + min) / 2;
          if (max == min) {
            h = s = 0; // achromatic
          } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
            }
            h /= 6;
          }
          const HSL = { h, s, l };
          return HSL;
        };
        if (
          parseColorToHSL(randomnedColor) > 0.5
          && parseColorToHSL(randomnedColor) < 0.75
          && Math.sqrt(parseColorToHSL(randomnedColor).h - parseColorToHSL(prevColor).h) < 0.25
        ) {
          randomnedColor = getRandomColor();
        }
      }

      return {
        backgroundColor: randomnedColor,
        borderColor: randomnedColor,
        fill: false,
        lineTension: 0,
        borderWidth: 1,
        pointRadius: 1
      };
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

    const { metrics } = this.props;

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
                onClick={this.calculate}
                type="bordered"
                icon="IconRefresh"
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
                        getBasicLineSettings={this.getBasicLineSettings()}
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
                        getBasicLineSettings={this.getBasicLineSettings()}
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
                    getBasicLineSettings={this.getBasicLineSettings()}
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
                        getBasicLineSettings={this.getBasicLineSettings()}
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
                        getBasicLineSettings={this.getBasicLineSettings()}
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
  metrics: state.Project.project.metrics,
  user: state.Auth.user
});

const mapDispatchToProps = {
  getMetrics
};

export default connect(mapStateToProps, mapDispatchToProps)(Metrics);
