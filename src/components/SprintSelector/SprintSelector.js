import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import classnames from 'classnames';
import * as css from './SprintSelector.scss';
import SelectDropdown from '../SelectDropdown';

export default class SprintSelector extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    sprints: PropTypes.array,
    value: PropTypes.number
  }

  constructor (props) {
    super(props);
    this.state = {};
  }

  getSprints = () => {
    let sprints = _.sortBy(this.props.sprints, sprint => {
      return new moment(sprint.factFinishDate);
    });

    sprints = sprints.map((sprint, i) => ({
      value: sprint.id,
      label: `${sprint.name} (${moment(sprint.factStartDate).format(
        'DD.MM.YYYY'
      )} ${sprint.factFinishDate
        ? `- ${moment(sprint.factFinishDate).format('DD.MM.YYYY')}`
        : '- ...'})`,
      statusId: sprint.statusId,
      className: classnames({
        [css.INPROGRESS]: sprint.statusId === 2,
        [css.sprintMarker]: true,
        [css.FINISHED]: sprint.statusId === 1
      })
    }));

    sprints.push({
      value: 0,
      label: 'Backlog',
      className: classnames({
        [css.INPROGRESS]: false,
        [css.sprintMarker]: true
      })
    });
    return sprints;
  };

  render () {
    const { value, sprints, onChange, ...otherProps } = this.props;
    return (
      <SelectDropdown
        name="sprint"
        placeholder="Спринт"
        noResultsText="Нет подходящих спринтов"
        backspaceToRemoveMessage={''}
        clearAllText="Очистить все"
        value={value}
        options={this.getSprints()}
        onChange={(option) => onChange(option)}
        {...otherProps}
      />
    );
  }
}
