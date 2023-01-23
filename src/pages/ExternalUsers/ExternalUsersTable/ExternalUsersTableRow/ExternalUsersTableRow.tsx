import React, { Component } from 'react';
import css from './ExternalUsersTableRow.scss';
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
import { getFirstName, getLastName, getLocalizedUserFieldNames, getNonLocalizedUserFieldNames } from '../../../../utils/NameLocalisation';
import moment from 'moment';
import { ExternalUser } from '../ExternalUsersTable';
import { getExternalUserTypeOptions } from '../../utils';
import Select from '~/components/Select';

type ExternalUsersTableRowProp = {
  deleteExternalUser: (id) => void,
  editExternalUser: (id, changedFields) => Promise<any>,
  exUser: ExternalUser,
  lang: string,
  refreshExternalUserLink: (exUser: ExternalUser) => Promise<any>,
  showNotification: (notification, duration?: number) => Promise<any>,
}

class ExternalUsersTableRow extends Component<ExternalUsersTableRowProp, any> {

  validation: {
    name: (value) => boolean,
    lastname: (value) => boolean,
    login: (value) => boolean,
    expiredDate: (value) => boolean,
    description: (value) => boolean,
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      tempValues: {},
      isValid: {},
      isLoading: false
    };
    const { lang } = props;

    const validationProps = {
      requiredNameLength: 2,
      requiredLastnameLength: 2,
    }
    this.validation = {
      name: value => {
        if (value.length < validationProps.requiredNameLength) {
          this.props.showNotification({
            message: localize[lang].ERROR_MESSAGE,
            type: 'error'
          });
          return false;
        }
        return true;
      },
      lastname: value => {
        if (value.length < validationProps.requiredLastnameLength) {
          this.props.showNotification({
            message: localize[lang].ERROR_MESSAGE,
            type: 'error'
          });
          return false;
        }
        return true;
      },
      login: value => {
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
        if (moment().diff(value, 'days') > 0) {
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
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  componentDidUpdate(prevProps: ExternalUsersTableRowProp) {
    ReactTooltip.rebuild();

    if (prevProps.lang !== this.props.lang) {
      this.setState(state => ({
        tempValues: {
          ...state.tempValues,
          [getLocalizedUserFieldNames().firstName]: state.tempValues[getNonLocalizedUserFieldNames().firstName],
          [getLocalizedUserFieldNames().lastName]: state.tempValues[getNonLocalizedUserFieldNames().lastName],
          [getNonLocalizedUserFieldNames().firstName]: undefined,
          [getNonLocalizedUserFieldNames().lastName]: undefined
        },
        isValid: {
          ...state.isValid,
          [getLocalizedUserFieldNames().firstName]: state.isValid[getNonLocalizedUserFieldNames().firstName],
          [getLocalizedUserFieldNames().lastName]: state.isValid[getNonLocalizedUserFieldNames().lastName],
          [getNonLocalizedUserFieldNames().firstName]: undefined,
          [getNonLocalizedUserFieldNames().lastName]: undefined
        }
      }))
    }
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
      case 'lastname': {
        return value.length < 2;
      }
      case 'email': {
        const re = /\S+@\S+\.\S+/;
        return !re.test(value);
      }
      case 'date':
        return moment().diff(value, 'days') > 0;
      default:
        return false;
    }
  };

  saveEditChanges = () => {
    const { id } = this.props.exUser;
    const changedFields = this.state.tempValues;
    if (!Object.keys(changedFields).length) {
      this.setState({ isEditing: false }, ReactTooltip.hide);
      return;
    } else {
      for (const field in changedFields) {
        if (this.validation[field] && !this.validation[field](changedFields[field])) {
          return;
        }
      }
    }
    this.setState(
      {
        isEditing: false,
        isLoading: true,
        changedFields: {}
      },
      () => {
        ReactTooltip.hide();
        this.props
          .editExternalUser(id, {
            ...changedFields
          })
          .then(() => {
            this.setState({
              isLoading: false
            });
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
    const { lang, exUser } = this.props;
    const { isEditing, isValid, tempValues } = this.state;

    return (
      <div className={css.TableRow}>
        <div className={classnames(css.TableCell, css.TableCellName)}>
          <ExternalUserInput
            value={getFirstName(exUser)}
            isEditing={isEditing}
            onValueChange={this.onEditValues(getLocalizedUserFieldNames().firstName, 'name')}
            isValid={isValid[getLocalizedUserFieldNames().firstName]}
          />
        </div>
        <div className={classnames(css.TableCell, css.TableCellLastName)}>
          <ExternalUserInput
            value={getLastName(exUser)}
            isEditing={isEditing}
            onValueChange={this.onEditValues(getLocalizedUserFieldNames().lastName, 'lastname')}
            isValid={isValid[getLocalizedUserFieldNames().lastName]}
          />
        </div>
        <div className={classnames(css.TableCell, css.TableCellLogin)}>
          <ExternalUserInput
            value={exUser.login}
            isEditing={isEditing}
            onValueChange={this.onEditValues('login', 'email')}
            isValid={isValid.login}
          />
        </div>
        <div className={classnames(css.TableCell, css.TableCellType)}>
          <Select
            options={getExternalUserTypeOptions(lang)}
            className={classnames(css.select, css.typeSelectValue, {
              [css.isDisabled]: !isEditing,
            })}
            value={tempValues.externalUserType || exUser.externalUserType}
            placeholder=''
            disabled={!isEditing}
            onChange={this.onEditValues('externalUserType', 'enum')}
          />
        </div>
        <div className={classnames(css.TableCell, css.TableCellDesc)}>
          <ExternalUserInput
            value={exUser.description}
            isEditing={isEditing}
            onValueChange={this.onEditValues('description', 'string')}
            isValid={isValid.description}
            noLengthConstraints
          />
        </div>
        <div className={classnames(css.TableCell, css.TableCellActivity)}>
          <ExternalUserActivity
            checked={!!exUser.isActive}
            isEditing={isEditing}
            isLoading={this.state.isLoading}
            onValueChange={this.onEditValues('isActive', 'boolean')}
          />
        </div>
        <div className={classnames(css.TableCell, css.TableCellDate)}>
          <ExternalUserExpiredDate
            value={exUser.expiredDate}
            isEditing={isEditing}
            onValueChange={this.onEditValues('expiredDate', 'date')}
            isValid={isValid.expiredDate}
          />
        </div>
        <div className={css.TableCellButton}>
          {isEditing ? (
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
        <div className={css.TableCellButton}>
          <ExternalUserRefreshLink
            onConfirm={this.startRefresh}
            dataTip={localize[lang].REFRESH}
            username={getFirstName(exUser)}
            text={localize[lang].CONFIRM_REFRESH_LINK}
          />
        </div>
        <div className={css.TableCellButton}>
          <ExternalUserDelete
            onDelete={this.deleteUser}
            username={getFirstName(exUser)}
            text={localize[lang].CONFIRM_DELETE_USER}
            dataTip={localize[lang].DELETE}
          />
        </div>
      </div>
    );
  }
}
(ExternalUsersTableRow as any).propTypes = {
  deleteExternalUser: PropTypes.func,
  editExternalUser: PropTypes.func,
  exUser: PropTypes.object,
  lang: PropTypes.string,
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
