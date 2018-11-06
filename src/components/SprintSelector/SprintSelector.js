import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import sortBy from 'lodash/sortBy';
import classnames from 'classnames';

import * as css from './SprintSelector.scss';
import SelectDropdown from '../SelectDropdown';
import localize from './SprintSelector.json';

const dateFormat = 'DD.MM.YYYY';

export default class SprintSelector extends Component {
  static propTypes = {
    lang: PropTypes.string,
    onChange: PropTypes.func,
    sprints: PropTypes.array,
    useId: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array])
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  onSelectFocus = () => {
    this.setState({ inputFocused: true });
  };
  onSelectBlur = () => {
    this.setState({ inputFocused: false });
  };

  getSprints = () => {
    let sprints = sortBy(this.props.sprints, sprint => {
      return new moment(sprint.factFinishDate);
    });

    sprints = sprints.map(sprint => ({
      value: this.props.useId ? sprint.id : sprint,
      label: `${sprint.name} (${moment(sprint.factStartDate).format(dateFormat)} ${
        sprint.factFinishDate ? `- ${moment(sprint.factFinishDate).format(dateFormat)}` : '- ...'
      })`,
      factStartDate: sprint.factStartDate,
      factFinishDate: sprint.factFinishDate,
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

  render() {
    const { value, onChange, lang, ...otherProps } = this.props;
    return (
      <div className="sprint-dropdown">
        <SelectDropdown
          name="sprint"
          searchable={false}
          thisClassName="sprintSelector"
          placeholder={localize[lang].CHOOSE_SPRINT}
          noResultsText={localize[lang].NO_MATCHING_SPRINTS}
          backspaceToRemoveMessage={''}
          clearAllText={localize[lang].CLEAR_ALL}
          value={value}
          options={this.getSprints()}
          clearable={false}
          onFocus={this.onSelectFocus}
          onBlur={this.onSelectBlur}
          onChange={option => onChange(option)}
          {...otherProps}
          inputProps={{
            className: this.state.inputFocused ? null : css.sprintInputBlured,
            ...otherProps.inputProps
          }}
        />
      </div>
    );
  }
}
