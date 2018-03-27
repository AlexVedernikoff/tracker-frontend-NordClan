import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatepickerDropdown from '../../../../../components/DatepickerDropdown';
import moment from 'moment';
import { IconEdit, IconCheck, IconClose } from '../../../../../components/Icons';
import ReactTooltip from 'react-tooltip';

class ExternalUserExpiredDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      inputValue: props.value
    };
  }
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  startEdit = () => {
    this.setState(state => ({ isEditing: !state.isEditing }), () => ReactTooltip.hide());
  };

  handleDayToChange = date => {
    if (date) {
      this.setState({
        inputValue: moment(date).format()
      });
    }
  };
  saveChanges = () => {
    this.setState({ isEditing: false }, () => {
      ReactTooltip.hide();
      if (!this.state.inputValue) return;
      this.props.changeValue({ [this.props.fieldType]: this.state.inputValue });
    });
  };
  undoChanges = () => {
    this.setState(
      {
        isEditing: false,
        inputValue: this.props.value
      },
      () => ReactTooltip.hide()
    );
  };
  render() {
    const { inputValue } = this.state;
    const formattedDay = moment(inputValue).format('DD.MM.YYYY');
    return (
      <div>
        {this.state.isEditing ? (
          <DatepickerDropdown
            name="date"
            value={formattedDay}
            onDayChange={this.handleDayToChange}
            disabledDataRanges={[{ before: new Date() }]}
            placeholder="Введите дату"
          />
        ) : (
          <div>{formattedDay}</div>
        )}
        {this.state.isEditing ? (
          [
            <IconCheck
              // className={css.save}
              onClick={this.saveChanges}
              key="save"
              data-tip="Сохранить"
            />,
            <IconClose data-tip="Отменить" key="undo" onClick={this.undoChanges} />
          ]
        ) : (
          <IconEdit
            // className={css.edit}
            onClick={this.startEdit}
            data-tip="Редактировать"
          />
        )}
      </div>
    );
  }
}
ExternalUserExpiredDate.propTypes = {
  changeValue: PropTypes.func,
  fieldType: PropTypes.string,
  value: PropTypes.string
};
export default ExternalUserExpiredDate;
