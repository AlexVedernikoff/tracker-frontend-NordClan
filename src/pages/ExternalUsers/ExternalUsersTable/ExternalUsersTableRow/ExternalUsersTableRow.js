import React, { Component } from 'react';
import * as css from './ExternalUsersTableRow.scss';
import PropTypes from 'prop-types';
import ExternalUserInput from './ExternalUserInput';
import ExternalUserActivity from './ExternalUserActivity';
import ExternalUserExpiredDate from './ExternalUserExpiredDate';
import { IconEdit, IconCheck, IconClose } from '../../../../components/Icons';
import ExternalUserDelete from './ExternalUserDelete';
import { connect } from 'react-redux';
import { editExternalUser, deleteExternalUser } from '../../../../actions/ExternalUsers';
import { showNotification } from '../../../../actions/Notifications';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';

class ExternalUsersTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      tempValues: {}
    };
    this.validation = {
      name: value => {
        if (value.length < 2) {
          this.props.showNotification({
            message: 'Имя должно содержать не менее двух символов',
            type: 'error'
          });
          return false;
        }
        return true;
      },
      email: value => {
        const re = /\S+@\S+\.\S+/;
        if (!re.test(value)) {
          this.props.showNotification({
            message: 'Введите корректный e-mail',
            type: 'error'
          });
          return false;
        }
        return true;
      },
      expiredDate: value => {
        if (!value) {
          this.props.showNotification({
            message: 'Укажите дату',
            type: 'error'
          });
          return false;
        }
        return true;
      }
    };
  }
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  onEditValues = fieldName => value => {
    this.setState(state => ({
      tempValues: {
        ...state.tempValues,
        [fieldName]: value
      }
    }));
  };
  saveEditChanges = () => {
    const id = this.props.exUser.id;
    const changedFields = this.state.tempValues;
    if (
      (changedFields.name !== undefined && !this.validation.name(changedFields.name)) ||
      (changedFields.email !== undefined && !this.validation.email(changedFields.email)) ||
      (changedFields.expiredDate !== undefined && !this.validation.expiredDate(changedFields.expiredDate))
    ) {
      return;
    }
    this.setState(
      {
        isEditing: false,
        changedFields: {}
      },
      () => {
        ReactTooltip.hide();
        this.props.editExternalUser(id, changedFields);
      }
    );
  };
  undoChanges = () => {
    this.setState(
      {
        isEditing: false,
        tempValues: {}
      },
      () => ReactTooltip.hide()
    );
  };
  deleteUser = () => {
    this.props.deleteExternalUser(this.props.exUser.id);
  };
  startEdit = () => {
    this.setState(state => ({ isEditing: !state.isEditing }), () => ReactTooltip.hide());
  };
  render() {
    return (
      <div className={css.TableRow}>
        <div className={css.TableCell}>
          <ExternalUserInput
            value={this.props.exUser.name}
            isEditing={this.state.isEditing}
            onValueChange={this.onEditValues('name')}
          />
        </div>
        <div className={css.TableCell}>
          <ExternalUserInput
            value={this.props.exUser.email}
            isEditing={this.state.isEditing}
            onValueChange={this.onEditValues('email')}
          />
        </div>
        <div className={css.TableCell}>
          <ExternalUserActivity
            checked={this.props.exUser.isActive}
            isEditing={this.state.isEditing}
            onValueChange={this.onEditValues('isActive')}
          />
        </div>
        <div className={css.TableCell}>
          <ExternalUserExpiredDate
            value={this.props.exUser.expiredDate}
            isEditing={this.state.isEditing}
            onValueChange={this.onEditValues('expiredDate')}
          />
        </div>
        <div className={css.TableCellEdit}>
          {this.state.isEditing ? (
            [
              <IconCheck className={css.icon} onClick={this.saveEditChanges} key="save" data-tip="Сохранить" />,
              <IconClose className={css.icon} data-tip="Отменить" key="undo" onClick={this.undoChanges} />
            ]
          ) : (
            <IconEdit
              className={classnames(css.icon, css.editIcon)}
              onClick={this.startEdit}
              data-tip="Редактировать"
            />
          )}
        </div>
        <div className={css.TableCellEdit}>
          <ExternalUserDelete username={this.props.exUser.name} onDelete={this.deleteUser} />
        </div>
      </div>
    );
  }
}
ExternalUsersTableRow.propTypes = {
  deleteExternalUser: PropTypes.func,
  editExternalUser: PropTypes.func,
  exUser: PropTypes.object,
  showNotification: PropTypes.func
};
const mapStateToProps = state => ({});
const mapDispatchToProps = {
  deleteExternalUser,
  editExternalUser,
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalUsersTableRow);
