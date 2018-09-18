import React, { Component } from 'react';
import * as css from './ExternalUsersTableRow.scss';
import PropTypes from 'prop-types';
import ExternalUserInput from './ExternalUserInput';
import ExternalUserActivity from './ExternalUserActivity';
import ExternalUserExpiredDate from './ExternalUserExpiredDate';
import { IconEdit, IconCheck, IconClose } from '../../../../components/Icons';
import ExternalUserDelete from './ExternalUserDelete';
import ExternalUserRefreshLink from './ExternalUserRefreshLink';
import { connect } from 'react-redux';
import { editExternalUser, deleteExternalUser, refreshExternalUserLink } from '../../../../actions/ExternalUsers';
import { showNotification } from '../../../../actions/Notifications';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';
import localize from './externalUsersTableRow.json';

class ExternalUsersTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      tempValues: {},
      isValid: {}
    };
    const { lang } = props;
    this.validation = {
      name: value => {
        if (value.length < 2) {
          this.props.showNotification({
            message: localize[lang].ERROR_MESSAGE,
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
            message: localize[lang].ENTER_VALID_EMAIL,
            type: 'error'
          });
          return false;
        }
        return true;
      },
      expiredDate: value => {
        if (!value) {
          this.props.showNotification({
            message: localize[lang].SPECIFY_DATE,
            type: 'error'
          });
          return false;
        }
        return true;
      },
      description: value => {
        if (value.length > 5000) {
          this.props.showNotification({
            message: localize[lang].LONG_DESCRIPTION,
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
  onEditValues = (fieldName, type) => value => {
    this.setState(state => ({
      tempValues: {
        ...state.tempValues,
        [fieldName]: value
      },
      isValid: {
        ...state.isValid,
        [fieldName]: this.onValidate(value, type)
      }
    }));
  };
  onValidate = (value, type) => {
    switch (type) {
      case 'name': {
        return value.length < 2;
      }
      case 'email': {
        const re = /\S+@\S+\.\S+/;
        return !re.test(value);
      }
      default:
        return false;
    }
  };
  saveEditChanges = () => {
    const id = this.props.exUser.id;
    const changedFields = this.state.tempValues;
    if (!Object.keys(changedFields).length) {
      this.setState(
        {
          isEditing: false
        },
        () => ReactTooltip.hide()
      );
      return;
    }
    if (
      (changedFields.firstNameRu !== undefined && !this.validation.name(changedFields.firstNameRu)) ||
      (changedFields.login !== undefined && !this.validation.email(changedFields.login)) ||
      (changedFields.expiredDate !== undefined && !this.validation.expiredDate(changedFields.expiredDate)) ||
      (changedFields.description !== undefined && !this.validation.description(changedFields.description))
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
        this.props.editExternalUser(id, {
          ...changedFields
        });
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

  startRefresh = () => {
    this.props.refreshExternalUserLink(this.props.exUser);
  };
  render() {
    const { lang } = this.props;
    return (
      <div className={css.TableRow}>
        <div className={classnames(css.TableCell, css.TableCellName)}>
          <ExternalUserInput
            value={this.props.exUser.firstNameRu}
            isEditing={this.state.isEditing}
            onValueChange={this.onEditValues('firstNameRu', 'name')}
            isValid={this.state.isValid.firstNameRu}
          />
        </div>
        <div className={classnames(css.TableCell, css.TableCellLogin)}>
          <ExternalUserInput
            value={this.props.exUser.login}
            isEditing={this.state.isEditing}
            onValueChange={this.onEditValues('login', 'email')}
            isValid={this.state.isValid.login}
          />
        </div>
        <div className={classnames(css.TableCell, css.TableCellDesc)}>
          <ExternalUserInput
            value={this.props.exUser.description}
            isEditing={this.state.isEditing}
            onValueChange={this.onEditValues('description')}
            isValid={this.state.isValid.description}
          />
        </div>
        <div className={classnames(css.TableCell, css.TableCellActivity)}>
          <ExternalUserActivity
            checked={!!this.props.exUser.isActive}
            isEditing={this.state.isEditing}
            onValueChange={this.onEditValues('isActive')}
          />
        </div>
        <div className={classnames(css.TableCell, css.TableCellDate)}>
          <ExternalUserExpiredDate
            placeholder={localize[lang].ENTER_DATE}
            value={this.props.exUser.expiredDate}
            isEditing={this.state.isEditing}
            onValueChange={this.onEditValues('expiredDate')}
          />
        </div>
        <div className={css.TableCellEdit}>
          {this.state.isEditing ? (
            [
              <IconCheck
                className={css.icon}
                onClick={this.saveEditChanges}
                key="save"
                data-tip={localize[lang].SAVE}
              />,
              <IconClose className={css.icon} data-tip={localize[lang].UNDO} key="undo" onClick={this.undoChanges} />
            ]
          ) : (
            <IconEdit
              className={classnames(css.icon, css.editIcon)}
              onClick={this.startEdit}
              data-tip={localize[lang].EDIT}
            />
          )}
        </div>
        <div className={css.TableCellDelete}>
          <ExternalUserRefreshLink
            onConfirm={this.startRefresh}
            data-tip={localize[lang].SEND}
            username={this.props.exUser.firstNameRu}
            text={localize[lang].CONFIRM_REFRESH_LINK}
          />
        </div>
        <div className={css.TableCellDelete}>
          <ExternalUserDelete
            onDelete={this.deleteUser}
            username={this.props.exUser.firstNameRu}
            text={localize[lang].CONFIRM_DELETE_USER}
            dataTip={localize[lang].DELETE}
          />
        </div>
      </div>
    );
  }
}
ExternalUsersTableRow.propTypes = {
  deleteExternalUser: PropTypes.func,
  editExternalUser: PropTypes.func,
  exUser: PropTypes.object,
  refreshExternalUserLink: PropTypes.func,
  showNotification: PropTypes.func
};
const mapStateToProps = state => ({
  lang: state.Localize.lang
});
const mapDispatchToProps = {
  deleteExternalUser,
  editExternalUser,
  showNotification,
  refreshExternalUserLink
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExternalUsersTableRow);
