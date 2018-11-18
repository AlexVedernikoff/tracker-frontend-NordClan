import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ClosingFeaturesChart from '../ClosingFeaturesChart';
import TasksCountChart from '../TasksCountChart';
import SprintSelector from '../../../../components/SprintSelector';
import { connect } from 'react-redux';
import * as css from './SprintMetrics.scss';
import StartEndDates from '../StartEndDates';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import moment from 'moment';
const dateFormat = 'DD.MM.YYYY';

class SprintMetrics extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    endDate: PropTypes.string,
    filterById: PropTypes.func,
    getBasicLineSettings: PropTypes.func,
    metrics: PropTypes.array,
    openedBugsMetrics: PropTypes.array,
    openedCustomerBugsMetrics: PropTypes.array,
    sprints: PropTypes.array,
    startDate: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      sprintSelected: null,
      startDate: null,
      endDate: null
    };
  }

  componentWillMount() {
    const { sprints } = this.props;
    if (sprints.length > 0) {
      this.setState({ sprintSelected: this.getCurrentSprint(sprints) });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { sprints } = this.props;
    if (nextProps.sprints.length !== sprints.length) {
      this.setState({ sprintSelected: this.getCurrentSprint(nextProps.sprints) });
    }
  }

  formatDate = date => date && moment(date).format(dateFormat);

  getSelectOptions = () => {
    return [
      ...this.props.sprints.map(value => {
        return {
          value,
          label: `${value.name} (${moment(value.factStartDate).format(dateFormat)} ${
            value.factFinishDate ? `- ${moment(value.factFinishDate).format(dateFormat)}` : '- ...'
          })`
        };
      })
    ];
  };

  changeSprint = option => {
    if (option) {
      this.setState({ sprintSelected: option });
    }
  };

  getCurrentSprint = sprints => {
    const processedSprints = sprints.filter(sprint => {
      return sprint.statusId === 2;
    });
    const currentSprints = processedSprints.filter(sprint => {
      return moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]');
    });
    const getOption = sprint => {
      return {
        value: sprint,
        label: `${sprint.name} (${moment(sprint.factStartDate).format(dateFormat)} ${
          sprint.factFinishDate ? `- ${moment(sprint.factFinishDate).format(dateFormat)}` : '- ...'
        })`,
        statusId: sprint.statusId,
        className: classnames({
          [css.INPROGRESS]: sprint.statusId === 2,
          [css.sprintMarker]: true,
          [css.FINISHED]: sprint.statusId === 1
        })
      };
    };
    if (currentSprints.length) {
      return getOption(currentSprints[0]);
    } else if (processedSprints.length) {
      return getOption(processedSprints[0]);
    } else {
      return getOption(sprints[sprints.length - 1]);
    }
  };

  sprintStartDate() {
    const { sprintSelected } = this.state;
    const { startDate } = this.props;

    if (sprintSelected) {
      return sprintSelected.value !== 0 ? sprintSelected.value.factStartDate : startDate;
    }

    return '';
  }

  sprintEndDate() {
    const { sprintSelected } = this.state;
    const { endDate } = this.props;

    if (sprintSelected) {
      return sprintSelected.value !== 0 ? sprintSelected.value.factFinishDate : endDate;
    }

    return '';
  }

  filterBySprint = (sprintId, metrics) => metrics.filter(metric => metric.sprintId === sprintId);

  render() {
    const {
      chartDefaultOptions,
      getBasicLineSettings,
      metrics,
      filterById
      // openedBugsMetrics, // TODO: пересчитываются ниже, почему приходит не то?
      // openedCustomerBugsMetrics // пересчитываются ниже, почему приходит не то?
    } = this.props;
    const currentSprintId = this.state.sprintSelected ? this.state.sprintSelected.value.id : null;
    /*Динамика закрытия фич*/
    const sprintClosingFeaturesMetrics = filterById(32, metrics);
    const sprintWriteOffTimeMetrics = filterById(34, metrics);
    const sprintWorkWithoutEvaluationMetrics = filterById(33, metrics);

    /*Количество задач*/
    const openedFeaturesWithoutEvaluationMetric = filterById(40, metrics);
    const openedFeaturesMetric = filterById(35, metrics);
    const openedOutOfPlanFeaturesMetric = filterById(41, metrics);

    const openedFeaturesFromClient = filterById(58, metrics);
    const openedBugsFromClient = filterById(39, metrics);
    const openedBugsMetric = filterById(37, metrics);

    return (
      <div>
        <div className={css.sprintSelectWrapper}>
          <SprintSelector
            multi={false}
            searchable={false}
            clearable
            value={this.state.sprintSelected}
            sprints={this.props.sprints}
            onChange={option => this.changeSprint(option)}
            className={css.sprintSelector}
          />

          <StartEndDates startDate={this.sprintStartDate()} endDate={this.sprintEndDate()} />
        </div>
        <Row>
          <Col xs={12}>
            <ClosingFeaturesChart
              startDate={this.sprintStartDate()}
              endDate={this.sprintEndDate()}
              chartDefaultOptions={chartDefaultOptions}
              getBasicLineSettings={getBasicLineSettings}
              sprintClosingFeaturesMetrics={this.filterBySprint(currentSprintId, sprintClosingFeaturesMetrics)}
              sprintWriteOffTimeMetrics={this.filterBySprint(currentSprintId, sprintWriteOffTimeMetrics)}
              sprintWorkWithoutEvaluationMetrics={this.filterBySprint(
                currentSprintId,
                sprintWorkWithoutEvaluationMetrics
              )}
            />
          </Col>
          <Col xs={12}>
            <TasksCountChart
              chartDefaultOptions={chartDefaultOptions}
              getBasicLineSettings={getBasicLineSettings}
              openedFeaturesWithoutEvaluationMetric={this.filterBySprint(
                currentSprintId,
                openedFeaturesWithoutEvaluationMetric
              )}
              openedFeaturesMetric={this.filterBySprint(currentSprintId, openedFeaturesMetric)}
              openedOutOfPlanFeaturesMetric={this.filterBySprint(currentSprintId, openedOutOfPlanFeaturesMetric)}
              openedBugsMetrics={this.filterBySprint(currentSprintId, openedBugsMetric)}
              openedCustomerBugsMetrics={this.filterBySprint(currentSprintId, openedBugsFromClient)}
              openedFeaturesFromClient={this.filterBySprint(currentSprintId, openedFeaturesFromClient)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sprints: state.Project.project.sprints,
  metrics: state.Project.project.metrics
});

export default connect(mapStateToProps)(SprintMetrics);
