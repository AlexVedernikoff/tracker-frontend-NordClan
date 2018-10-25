import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Budget.scss';
import { IconEdit, IconCheck } from '../../Icons';
import ReactTooltip from 'react-tooltip';
import roundNum from '../../../utils/roundNum';
import parseInteger from '../../../utils/parseInteger';
import validateNumber from '../../../utils/validateNumber';
import Input from '../../../components/Input';

class Budget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      value: props.value
    };
  }

  componentDidMount() {}

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

  onChangeValue = e => {
    const { percents } = this.props;
    const value = e.target.value;
    if (percents) {
      if (validateNumber(value) && value <= 100) {
        this.setState({
          value: this.props.integerOnly ? parseInteger(value) : value
        });
      }
    } else {
      this.setState({
        value: this.props.integerOnly ? parseInteger(value) : value
      });
    }
  };

  selectAll = e => {
    e.target.select();
  };

  render() {
    const { header } = this.props;
    return (
      <div className={css.budget}>
        <div className={css.title}>{header}</div>

        <div className={css.editor}>
          {this.state.isEditing ? (
            <form onSubmit={this.toggleEditing}>
              <Input onFocus={this.selectAll} autoFocus onChange={this.onChangeValue} value={this.state.value} />
            </form>
          ) : (
            <div className={css.budgetValue}>{roundNum(this.props.value, 2)}</div>
          )}
        </div>

        {this.props.isProjectAdmin ? (
          <div
            className={css.editIcon}
            onClick={this.toggleEditing}
            data-tip={this.state.isEditing ? 'Сохранить' : 'Редактировать'}
          >
            {this.state.isEditing ? <IconCheck className={css.save} /> : <IconEdit className={css.edit} />}
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
  onEditSubmit: PropTypes.func.isRequired,
  percents: PropTypes.bool,
  value: PropTypes.number
};

export default Budget;
