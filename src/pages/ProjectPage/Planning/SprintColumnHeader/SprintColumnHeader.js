import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';
import SelectDropdown from '../../../../components/SelectDropdown/';
import classnames from 'classnames';
import * as css from './SprintColumnHeader.scss';

class SprintColumnHeader extends Component {
  static propTypes = {
    estimates: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onCreateTaskClick: PropTypes.func.isRequired,
    onSprintChange: PropTypes.func.isRequired,
    selectedSprintValue: PropTypes.number.isRequired,
    sprints: PropTypes.array.isRequired
  };

  render() {
    return (
      <div className={css.headerColumnWrapper}>
        <div className={css.headerColumn}>
          <div className={css.selectWrapper}>
            <SelectDropdown
              name={`${this.props.name}Column`}
              placeholder="Введите название спринта..."
              multi={false}
              value={this.props.selectedSprintValue}
              onChange={this.props.onSprintChange}
              noResultsText="Нет результатов"
              options={this.props.sprints}
            />
          </div>
          <Button
            onClick={this.props.onCreateTaskClick}
            type="bordered"
            text="Создать задачу"
            icon="IconPlus"
            name={this.props.name}
            className={css.button}
            data-tip="Создать задачу"
          />
        </div>
        <div className={css.progressBarWrapper} data-tip={this.props.estimates.summary}>
          <div
            className={classnames({
              [css.progressBar]: this.props.estimates.active,
              [css.exceeded]: this.props.estimates.exceeded
            })}
            style={{ width: this.props.estimates.width }}
          />
        </div>
      </div>
    );
  }
}

export default SprintColumnHeader;
