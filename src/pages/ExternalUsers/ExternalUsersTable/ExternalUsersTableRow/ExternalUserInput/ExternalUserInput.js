import React, { Component } from 'react';
// import * as css from './ExternalUsersTableRow.scss';
import PropTypes from 'prop-types';
import Input from '../../../../../components/Input';
import { IconEdit, IconCheck, IconClose } from '../../../../../components/Icons';
import ReactTooltip from 'react-tooltip';

class ExternalUserInput extends Component {
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
  onInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };
  validateEmail = email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  saveChanges = () => {
    if (this.props.fieldType === 'name' && this.state.inputValue.length < 2) {
      this.props.showNotification({
        message: 'Имя должно содержать не менее двух символов',
        type: 'error'
      });
      return;
    }
    if (this.props.fieldType === 'email' && !this.validateEmail(this.state.inputValue)) {
      this.props.showNotification({
        message: 'Введите корректный e-mail',
        type: 'error'
      });
      return;
    }
    this.setState({ isEditing: false }, () => {
      ReactTooltip.hide();
      if (this.props.value === this.state.inputValue) return;
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
    return (
      <div>
        {this.state.isEditing ? (
          <Input type="text" maxLength={100} value={this.state.inputValue} onChange={this.onInputChange} />
        ) : (
          <div>{this.props.value}</div>
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
ExternalUserInput.propTypes = {
  changeValue: PropTypes.func,
  fieldType: PropTypes.string,
  showNotification: PropTypes.func,
  value: PropTypes.string
};
export default ExternalUserInput;
