import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from '../PlanningEdit.scss';
import { IconEdit, IconCheck } from '../../Icons';
import ReactTooltip from 'react-tooltip';
import Input from '../../Input';
import { formatCurrency } from '../../../utils/Currency';

class Budget extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isEditing: false,
      value: props.value
    };
  }

  componentDidMount () {
  }

  componentDidUpdate () {
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
    this.setState({ isEditing: true });
  };

  stopEditing = () => {
    this.setState({ isEditing: false });
  };

  saveBudget = () => {
    const { onEditSubmit } = this.props;
    onEditSubmit(this.state.value);
  };

  onChangeValue = (e) => {
    this.setState({
      value: parseFloat(parseFloat(e.target.value).toFixed(2))
    });
  };

  render () {
    const { header } = this.props;

    return (
      <div className={css.PlanningEdit}>
        <h2>{header}</h2>

        <div className={css.editor}>
          {
            this.state.isEditing
              ? <Input
                type='number'
                defaultValue={this.props.value}
                onChange={this.onChangeValue}
              />
              : <div>{formatCurrency(this.props.value)}</div>
          }
        </div>

        {
          this.props.isProjectAdmin
            ? <div className={css.editBorder}>
              {
                this.state.isEditing
                  ? <IconCheck
                    className={css.save}
                    onClick={this.toggleEditing}
                    data-tip="Сохранить"
                  />
                  : <IconEdit
                    className={css.edit}
                    onClick={this.toggleEditing}
                    data-tip="Редактировать"
                  />
              }
            </div>
            : null
        }
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
