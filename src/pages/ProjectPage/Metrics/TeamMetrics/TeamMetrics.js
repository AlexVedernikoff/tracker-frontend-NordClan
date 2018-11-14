import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TeamMetrics.scss';
import localize from './TeamMetrics.json';
import { connect } from 'react-redux';
import SprintSelector from '../../../../components/SprintSelector';
import moment from 'moment';
import classnames from 'classnames';
import * as MetricTypes from '../../../../constants/Metrics';
const dateFormat = 'DD.MM.YYYY';
import findLastIndex from 'lodash/findLastIndex';

const filterMetrics = (id, metrics) => {
  return metrics ? metrics.filter(metric => metric.typeId === id) : [];
};

class TeamMetrics extends Component {
  static propTypes = {
    lang: PropTypes.string,
    metrics: PropTypes.array,
    sprints: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      sprintSelected: null
    };
  }

  componentWillMount() {
    const { sprints } = this.props;
    if (sprints && sprints.length > 0) {
      const options = this.getCurrentSprint(sprints);
      this.setState({ sprintSelected: options });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { sprints } = this.props;
    if (nextProps.sprints && nextProps.sprints.length !== sprints.length) {
      const options = this.getCurrentSprint(nextProps.sprints);
      this.setState({ sprintSelected: options });
    }
  }

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
    } else if (sprints.length) {
      return getOption(sprints[sprints.length - 1]);
    }
  };

  changeSprint = option => {
    if (option) {
      this.setState({ sprintSelected: option });
    }
  };

  render() {
    const { lang, metrics, sprints } = this.props;
    const teamMetrics = filterMetrics(MetricTypes.COMMAND_METRICS, metrics);

    // Ищу последний элемент т.к. в нем самые свежие данные
    const lastMetricIndex =
      this.state.sprintSelected &&
      findLastIndex(teamMetrics, item => item.sprintId === this.state.sprintSelected.value.id);
    const teamMetric = lastMetricIndex >= 0 ? teamMetrics[lastMetricIndex] : null;

    return (
      <div>
        <div className={css.sprintSelectWrapper}>
          <div className={css.text}>{localize[lang].SPRINT}</div>
          <SprintSelector
            multi={false}
            value={this.state.sprintSelected}
            sprints={sprints}
            onChange={option => this.changeSprint(option)}
            className={css.sprintSelector}
          />
        </div>
        <table className={css.teamTable}>
          <thead>
            <tr>
              <td>
                <span>{localize[lang].PARTICIPANT}</span>
              </td>
              <td>{localize[lang].FEATURES_DONE_COUNT}</td>
              <td>{localize[lang].FEATURES_RETURN_COUNT}</td>
              <td>{localize[lang].BUGS_DONE_COUNT}</td>
              <td>{localize[lang].BUGS_RETURN_COUNT}</td>
              <td>{localize[lang].LINKED_BUGS_COUNT}</td>
            </tr>
          </thead>
          <tbody>
            {teamMetric && Array.isArray(teamMetric.value) && teamMetric.value.length > 0 ? (
              teamMetric.value.map(item => {
                return (
                  <tr key={teamMetric.sprintId + '_' + item.user.id}>
                    <td>
                      <span>{item.user.fullNameRu}</span>
                    </td>
                    <td>{item.taskDoneCount}</td>
                    <td>{item.taskReturnCount}</td>
                    <td>{item.bugDoneCount}</td>
                    <td>{item.bugReturnCount}</td>
                    <td>{item.linkedBugsCount}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">
                  <span>{localize[lang].NO_DATA}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  sprints: state.Project.project.sprints,
  metrics: state.Project.project.metrics
});

export default connect(mapStateToProps)(TeamMetrics);
