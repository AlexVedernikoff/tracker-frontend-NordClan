import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Budget.scss';
import { IconEdit, IconCheck } from '../../Icons';
import ReactTooltip from 'react-tooltip';
import InputNumber from '../../InputNumber';
import roundNum from '../../../utils/roundNum';

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

  toggleEditing = () => {
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
      value
      // value: parseFloat(parseFloat(e.target.value).toFixed(2))
    });
  };

  render() {
    const { header } = this.props;

    return (
      <div className={css.budget}>
        <div className={css.title}>{header}</div>

        <div className={css.editor}>
          {this.state.isEditing ? (
            <InputNumber defaultValue={this.props.value} onChange={this.onChangeValue} />
          ) : (
            <div className={css.budgetValue}>{roundNum(this.props.value, 2)}</div>
          )}
        </div>

        {this.props.isProjectAdmin ? (
          <div>
            {this.state.isEditing ? (
              <IconCheck onClick={this.toggleEditing} data-tip="Сохранить" />
            ) : (
              <IconEdit onClick={this.toggleEditing} data-tip="Редактировать" />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

Budget.propTypes = {
  header: PropTypes.string.isRequired,
  id: PropTypes.number,
  isProjectAdmin: PropTypes.bool,
  onEditSubmit: PropTypes.func.isRequired,
  value: PropTypes.number
};

export default Budget;
