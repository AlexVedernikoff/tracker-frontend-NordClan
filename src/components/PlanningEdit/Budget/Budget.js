import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import * as css from './Budget.scss';
import { IconEdit, IconCheck } from '../../Icons';
import roundNum from '../../../utils/roundNum';
import parseInteger from '../../../utils/parseInteger';
import validateNumber from '../../../utils/validateNumber';
import Input from '../../../components/Input';
import localize from './Budget.json';

class Budget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      value: props.value || 0
    };
  }

  componentDidUpdate(prevProps) {
    ReactTooltip.rebuild();
    this.updateValue(prevProps.value);
  }

  updateValue = prevValue => {
    if (prevValue !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  };

  toggleEditing = e => {
    e.preventDefault();
    if (this.state.isEditing && (this.state.value !== '' && this.state.value !== undefined)) {
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
    if (this.state.value === this.props.value) return;
    const { onEditSubmit } = this.props;
    onEditSubmit(this.state.value);
  };

  onChangeValue = e => {
    const { percents } = this.props;
    const value = e.target.value;

    if (value.includes(',')) {
      return;
    }

    if (percents) {
      if (validateNumber(value) && value <= 100) {
        this.setState({
          value: this.props.integerOnly ? parseInteger(value) : value
        });
      }
    } else if (validateNumber(value)) {
      this.setState({
        value: this.props.integerOnly ? parseInteger(value) : value
      });
    }
  };

  selectAll = e => {
    e.target.select();
  };

  render() {
    const { header, lang } = this.props;
    const { isEditing, value } = this.state;
    const saveDataTip = this.state.value ? localize[lang].SAVE : localize[lang].ENTER_NUMBER;
    return (
      <div className={css.budget}>
        <div className={css.title}>{header}</div>

        <div className={css.editor}>
          {isEditing ? (
            <form onSubmit={this.toggleEditing}>
              <Input onFocus={this.selectAll} autoFocus onChange={this.onChangeValue} value={value} />
            </form>
          ) : (
            <div className={css.budgetValue}>{roundNum(value, 2)}</div>
          )}
        </div>

        {this.props.isProjectAdmin ? (
          <div
            className={css.editIcon}
            onClick={this.toggleEditing}
            data-tip={this.state.isEditing ? saveDataTip : localize[lang].EDIT}
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
  onEditSubmit: PropTypes.func.isRequired,
  percents: PropTypes.bool,
  value: PropTypes.number
};

export default Budget;
