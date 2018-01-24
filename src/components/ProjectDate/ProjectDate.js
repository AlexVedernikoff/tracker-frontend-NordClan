import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './ProjectDate.scss';
import { IconEdit, IconCheck } from '../Icons';
import ReactTooltip from 'react-tooltip';
import DatepickerDropdown from '../DatepickerDropdown';
import moment from 'moment';

class Budget extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isEditing: false,
      value: props.value
    };
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
      value: e.target.value
    });
  };

  render () {
    const { header, value } = this.props;
    const formattedDay = moment(value).format('DD.MM.YYYY');
    return (
      <div className={css.projectDate}>
        <h2>{header}</h2>

        <div className={css.editor}>
          {
            this.state.isEditing
              ? <DatepickerDropdown
                name="date"
                value={value ? formattedDay : ''}
                onDayChange={this.handleDayToChange}
                placeholder="Введите дату"
                // disabledDataRanges={this.props.sprintsDateRanges}
              />
              : <div>{value ? formattedDay : 'Дата не указана'}</div>
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
  value: PropTypes.string
};

export default Budget;
