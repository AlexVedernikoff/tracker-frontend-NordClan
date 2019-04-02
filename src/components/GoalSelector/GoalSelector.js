import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as css from './GoalSelector.scss';
import SelectDropdown from '../SelectDropdown';
import localize from './GoalSelector.json';
import layoutAgnosticFilter from '../../utils/layoutAgnosticFilter';
import { IconSearch } from '../../components/Icons/index.js';

const boardIconSearchStyle = { position: 'absolute', width: 22, height: 22, bottom: 4, left: 23 };
const taskListIconSearchStyle = { position: 'absolute', width: 22, height: 22, bottom: 4, left: 15 };

export default class GoalSelector extends Component {
  static propTypes = {
    goals: PropTypes.array,
    lang: PropTypes.string,
    onChange: PropTypes.func,
    sprintId: PropTypes.string,
    useId: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array])
  };

  constructor(props) {
    super(props);
    this.state = {
      inputFocused: false
    };
  }

  onSelectFocus = () => {
    this.setState({ inputFocused: true });
  };
  onSelectBlur = () => {
    this.setState({ inputFocused: false });
  };

  getOptions = goals => {
    const { multi, sprintId } = this.props;
    let options = goals.map(goal => ({
      ...goal,
      label: goal.name,
      value: goal.id,
      className: classnames({
        [css.INPROGRESS]: goal.status === 'not_completed',
        [css.goalMarker]: true,
        [css.FINISHED]: goal.statusId === 'completed',
        [css.picked]: this.isOptionPicked(goal.value)
      }),
      disabled: !multi && this.isOptionPicked(goal.value)
    }));

    if (sprintId !== undefined) {
      options = options.filter(option => option.activeSprintId === sprintId);
    }

    return options;
  };

  isOptionPicked = id => {
    const { value } = this.props;
    if (value) {
      if (value.length && value.length) {
        return value.includes(id);
      }
      if (value.value) return value.value.id === id.id;
    }
    return false;
  };

  render() {
    const { value, lang, onChange, options, multi, searchable, taskListClass, clearable, ...otherProps } = this.props;

    const toShowMagnifier = !!(multi && this.state.inputFocused && this.props.value && this.props.value.length);
    const thisClassName = classnames({
      goalSelector: true,
      taskListClass: (this.props.taskListClass && !value) || !toShowMagnifier
    });

    return (
      <div
        className={classnames({
          [css['goal-dropdown']]: true
        })}
      >
        {toShowMagnifier && <IconSearch style={taskListClass ? taskListIconSearchStyle : boardIconSearchStyle} />}
        <SelectDropdown
          name="goal"
          thisClassName={thisClassName}
          placeholder={localize[lang].CHOOSE_GOAL}
          noResultsText={localize[lang].NO_MATCHING_GOALSS}
          clearAllText={localize[lang].CLEAR_ALL}
          filterOption={layoutAgnosticFilter}
          removeSelected={false}
          backspaceToRemoveMessage=""
          onFocus={this.onSelectFocus}
          onBlur={this.onSelectBlur}
          multi={multi}
          value={value}
          searchable={searchable}
          clearable={clearable}
          options={this.getOptions(options)}
          onChange={option => onChange(option)}
          {...otherProps}
          inputProps={{
            className: this.state.inputFocused ? css.goalInputFocused : css.goalInputBlured,
            ...otherProps.inputProps
          }}
        />
      </div>
    );
  }
}
