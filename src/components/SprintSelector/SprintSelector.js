import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import sortBy from 'lodash/sortBy';
import classnames from 'classnames';

import * as css from './SprintSelector.scss';
import SelectDropdown from '../SelectDropdown';
import localize from './SprintSelector.json';
import layoutAgnosticFilter from '../../utils/layoutAgnosticFilter';

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

  getSprints = arr => {
    let sprints = sortBy(arr, sprint => {
      return new moment(sprint.factFinishDate);
    });
    const { multi } = this.props;

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
        [css.FINISHED]: sprint.statusId === 1,
        [css.picked]: this.isOptionPicked(this.props.useId ? sprint.id : sprint)
      }),
      disabled: !multi && this.isOptionPicked(this.props.useId ? sprint.id : sprint)
    }));

    sprints.push({
      value: 0,
      label: 'Backlog',
      className: classnames({
        [css.INPROGRESS]: false,
        [css.sprintMarker]: true,
        [css.picked]: this.isOptionPicked(0)
      }),
      disabled: !multi && this.isOptionPicked(0)
    });
    return sprints;
  };

  getOptions = arr => {
    const { multi } = this.props;
    const options = arr.map(option => ({
      ...option,
      className: classnames({
        [css.INPROGRESS]: option.statusId === 2,
        [css.sprintMarker]: true,
        [css.FINISHED]: option.statusId === 1,
        [css.picked]: this.isOptionPicked(option.value)
      }),
      disabled: !multi && this.isOptionPicked(option.value)
    }));
    return options;
  };

  isOptionPicked = id => {
    const { value } = this.props;
    if (value) {
      if (value.length && value.length) {
        return value.includes(id);
      }
      if (value.value.id) return value.value.id === id.id;
    }
    return false;
  };

  render() {
    const { value, lang, onChange, options, sprints, multi, searchable, clearable, ...otherProps } = this.props;
    return (
      <div className="sprint-dropdown">
        <SelectDropdown
          name="sprint"
          removeSelected={false}
          multi={multi}
          thisClassName="sprintSelector"
          placeholder={localize[lang].CHOOSE_SPRINT}
          noResultsText={localize[lang].NO_MATCHING_SPRINTS}
          clearAllText={localize[lang].CLEAR_ALL}
          value={value}
          options={sprints ? this.getSprints(sprints) : this.getOptions(options)}
          backspaceToRemoveMessage=""
          searchable={searchable}
          clearable={clearable}
          onFocus={this.onSelectFocus}
          onBlur={this.onSelectBlur}
          onChange={option => onChange(option)}
          {...otherProps}
          inputProps={{
            className: this.state.inputFocused ? css.sprintInputFocused : css.sprintInputBlured,
            ...otherProps.inputProps
          }}
          filterOption={layoutAgnosticFilter}
        />
      </div>
    );
  }
}
