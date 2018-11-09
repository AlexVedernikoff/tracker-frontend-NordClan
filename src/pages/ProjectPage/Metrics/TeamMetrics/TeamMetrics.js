import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TeamMetrics.scss';
import localize from './TeamMetrics.json';
import { connect } from 'react-redux';
import SprintSelector from '../../../../components/SprintSelector';
import moment from 'moment';
import classnames from 'classnames';
import Loader from '../../../InnerContainer/AppHead/Loader';
const dateFormat = 'DD.MM.YYYY';

class TeamMetrics extends Component {
  static propTypes = {
    lang: PropTypes.string,
    sprints: PropTypes.array,
    teamMetrics: PropTypes.array
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
      console.log('options componentWillMount', options);
      this.setState({ sprintSelected: options });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { sprints } = this.props;
    if (nextProps.sprints && nextProps.sprints.length !== sprints.length) {
      const options = this.getCurrentSprint(nextProps.sprints);
      console.log('options componentWillReceiveProps', options);
      this.setState({ sprintSelected: options });
    }
  }

  render() {
    const { lang, teamMetrics, sprints } = this.props;

    // console.log('teamMetrics ', teamMetrics);
    console.log('sprintSelected ', this.state.sprintSelected);

    if (!teamMetrics) {
      return <Loader />;
    }

    const filteredMetrics = this.state.sprintSelected
      ? teamMetrics.filter(data => data.sprint.id === this.state.sprintSelected.value.id)
      : [];

    return (
      <div>
        <div className={css.sprintSelectWrapper}>
          <div>{localize[lang].SPRINT}</div>
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
            {Array.isArray(filteredMetrics) && filteredMetrics.length > 0 ? (
              filteredMetrics.map(item => {
                return item.data.map(userData => {
                  return (
                    <tr>
                      <td>
                        <span>{userData.user.fullNameRu}</span>
                      </td>
                      <td>{userData.taskDoneCount}</td>
                      <td>{userData.taskReturnCount}</td>
                      <td>{userData.bugDoneCount}</td>
                      <td>{userData.bugReturnCount}</td>
                      <td>{userData.linkedBugsCount}</td>
                    </tr>
                  );
                });
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

  changeSprint = option => {
    if (option) {
      this.setState({ sprintSelected: option });
    }
  };

  getCurrentSprint = sprints => {
    console.log('sprints ', sprints);
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
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(TeamMetrics);
