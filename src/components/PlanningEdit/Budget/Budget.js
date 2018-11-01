import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import * as css from './Budget.scss';
import { IconEdit, IconCheck } from '../../Icons';
import InputNumber from '../../InputNumber';
import roundNum from '../../../utils/roundNum';
import parseInteger from '../../../utils/parseInteger';
import localize from './Budget.json';

class Budget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      value: props.value
    };
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  toggleEditing = e => {
    e.preventDefault();
    if (this.state.isEditing) {
      this.saveBudget();
      this.stopEditing();
    } else {
      this.startEditing();
    }
  };

  startEditing = () => {
    this.setState({ isEditing: true }, () => {
      ReactTooltip.hide();
    });
  };

  stopEditing = () => {
    this.setState({ isEditing: false }, () => {
      ReactTooltip.hide();
    });
  };

  saveBudget = () => {
    const { onEditSubmit } = this.props;
    onEditSubmit(this.state.value);
  };

  onChangeValue = value => {
    this.setState({
      value: this.props.integerOnly ? parseInteger(value) : value
    });
  };

  selectAll = e => {
    e.target.select();
  };

  render() {
    const { header, max, min, lang, value } = this.props;
    const { isEditing } = this.state;

    return (
      <div className={css.budget}>
        <div className={css.title}>{header}</div>

        <div className={css.editor}>
          {isEditing ? (
            <form onSubmit={this.toggleEditing}>
              <InputNumber
                onFocus={this.selectAll}
                autoFocus
                defaultValue={value}
                onChange={this.onChangeValue}
                value={this.state.value}
                max={max}
                min={min}
              />
            </form>
          ) : (
            <div className={css.budgetValue}>{roundNum(value, 2)}</div>
          )}
        </div>

        {this.props.isProjectAdmin ? (
          <div
            className={css.editIcon}
            onClick={this.toggleEditing}
            data-tip={isEditing ? localize[lang].SAVE : localize[lang].EDIT}
          >
            {isEditing ? <IconCheck className={css.save} /> : <IconEdit className={css.edit} />}
          </div>
        ) : null}
      </div>
    );
  }
}

Budget.propTypes = {
  header: PropTypes.string.isRequired,
  id: PropTypes.number,
  integerOnly: PropTypes.bool,
  isProjectAdmin: PropTypes.bool,
  lang: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onEditSubmit: PropTypes.func.isRequired,
  value: PropTypes.number
};

export default Budget;
