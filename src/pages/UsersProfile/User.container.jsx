import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { bool, func, array, objectOf, string, shape, object, number, arrayOf } from 'prop-types';
import Select from 'react-select';

import eq from 'lodash/eq';
import negate from 'lodash/negate';
import isObject from 'lodash/isObject';

import UserTitle from './UserTitle';
import * as css from './User.styles.scss';
import localize from './User.dictionary.json';

import { updateUserProfile } from '../../actions/UsersRoles';

import { ROLES_PATH } from '../../constants/UsersProfile';

import { Photo } from '../../components/Photo';
import Input from '../../components/Input';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Button from '../../components/Button';
import ValidatedInput from '../../components/ValidatedInput';
import Validator from '../../components/ValidatedInput/Validator';
import UserPhotoModal from '../../components/UserPhotoModal';
import Modal from '../../components/Modal';
import Checkbox from '../../components/Checkbox';
import Redirect from '../Redirect';

class User extends Component {
  static propTypes = {
    canEdit: bool,
    createUser: func.isRequired,
    departments: array,
    dictionary: objectOf(string).isRequired,
    getDepartments: func.isRequired,
    getUser: func.isRequired,
    lang: string,
    location: shape({
      action: string.isRequired,
      hash: string,
      key: string,
      pathname: string.isRequired,
      query: object,
      search: string,
      state: object
    }).isRequired,
    params: shape({
      id: string
    }),
    purgeUser: func.isRequired,
    updateUsersProfile: func.isRequired,
    user: shape({
      active: number,
      authorsProjects: arrayOf(number),
      birthDate: string,
      deletedAt: string,
      deleteDate: object,
      department: string,
      emailPrimary: string,
      expiredDate: string,
      firstNameEn: string,
      firstNameRu: string,
      fullNameEn: string,
      fullNameRu: string,
      globalRole: string,
      id: number,
      isActive: number,
      lastNameEn: string,
      lastNameRu: string,
      mobile: string,
      phone: string,
      photo: string,
      projects: arrayOf(number),
      projectsRoles: shape({
        admin: arrayOf(number),
        user: arrayOf(number)
      }),
      psId: string,
      skype: string,
      employmentDate: string
    })
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpenDismissModal: false,
      newUser: false,
      currUser: {
        firstNameRu: '',
        firstNameEn: '',
        lastNameRu: '',
        lastNameEn: '',
        phone: '',
        mobile: '',
        emailPrimary: '',
        emailSecondary: '',
        skype: '',
        deletedAt: '',
        globalRole: 'USER',
        departmentList: [],
        birthDate: null,
        password: '',
        city: '',
        employmentDate: null,
        deleteDate: null,
        active: 1,
        allowVPN: false
      },
      avatarModalOpened: false,
      roles: [
        { label: 'ADMIN', value: 'ADMIN' },
        { label: 'USER', value: 'USER' },
        { label: 'VISOR', value: 'VISOR' },
        { label: 'DEV_OPS', value: 'DEV_OPS' }
      ]
    };
  }

  componentDidMount() {
    if (this.props.params.id) {
      this.props.getUser();
    } else {
      this.setState({
        newUser: true,
        currUser: {
          ...this.state.currUser,
          allowVPN: true
        }
      });
    }
    this.props.getDepartments();
  }

  componentDidUpdate(prevProps) {
    if (negate(eq)(prevProps.user, this.props.user) && !this.state.newUser) {
      this.userMount();
    }
    if (negate(eq)(prevProps.location.pathname, this.props.location.pathname)) {
      this.props.getUser();
      this.props.getDepartments();
    }
  }

  componentWillUnmount() {
    this.props.purgeUser();
  }

  get userFieldsRoadMap() {
    return;
  }

  userMount = () => {
    const user = Object.assign({}, this.props.user);
    const depart = user.departmentList.map(el => ({ label: el.name, value: el.id }));
    user.departmentList = depart;

    this.setState(({ currUser }) => ({
      currUser: { ...currUser, ...user }
    }));
  };

  saveUser = () => {
    const data = Object.assign({}, this.state.currUser);

    if (!data.deleteDate && !data.active) {
      data.deleteDate = new Date();
    }

    if (data.active) {
      this.props.user.deleteDate = null;
    }

    data.departmentList = data.departmentList.map(el => el.value);
    this.props.updateUsersProfile(data);
  };

  createUser = () => {
    const { lang } = this.props;
    const notificationMessages = { successMsg: localize[lang].USER_CREATED, errMsg: localize[lang].UNKNOWN_ERROR };
    const data = Object.assign({}, this.state.currUser);
    data.departmentList = data.departmentList.map(el => el.value);
    this.props.createUser(data, notificationMessages, ROLES_PATH);
  };

  dismissUser = () => {
    const data = Object.assign({}, this.state.currUser);

    if (!data.deleteDate) {
      data.deleteDate = new Date();
    }

    data.active = 0;
    data.departmentList = data.departmentList.map(el => el.value);

    this.props.updateUsersProfile(data);

    this.props.user.active = false;
    this.setState({ isOpenDismissModal: false, active: false });
  };

  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(({ currUser }) => ({
      currUser: { ...currUser, [name]: value }
    }));
  };

  handleOpenDismissModal = () => {
    if (this.state.isOpenDismissModal) {
      this.setState({ isOpenDismissModal: false });
    } else {
      this.setState({ isOpenDismissModal: true });
    }
  };

  setDate = day => {
    const deleteDate = day ? day.toDate() : moment(new Date()).format('DD.MM.YYYY');

    this.setState(({ currUser }) => ({
      currUser: { ...currUser, deleteDate: deleteDate }
    }));
  };

  changePhotoHandler = photo => {
    this.setState(({ currUser }) => ({
      currUser: { ...currUser, photo }
    }));
  };

  departmentList = () => {
    return this.props.departments.map(el => ({ label: el.name, value: el.id }));
  };

  changeHandlerDepart = option => {
    this.setState(({ currUser }) => ({
      currUser: { ...currUser, departmentList: [...option] }
    }));
  };

  changeHandlerBirthDate = momentObj => {
    const birthDate = momentObj ? momentObj.toDate() : null;
    this.setState(({ currUser }) => ({
      currUser: { ...currUser, birthDate }
    }));
  };

  changeHandlerEmploymentDate = momentObj => {
    const employmentDate = momentObj ? momentObj.format() : null;
    this.setState(({ currUser }) => ({
      currUser: { ...currUser, employmentDate }
    }));
  };

  changeHandlerRole = opt => {
    this.setState(({ currUser }) => ({
      currUser: { ...currUser, globalRole: opt.value }
    }));
  };

  handlerSetActiveFlag = () => {
    this.setState(({ currUser }) => ({
      currUser: { ...currUser, active: Number(this.state.currUser.active) }
    }));
  };

  handleChangeCheckbox = field => () => {
    this.setState(({ currUser }) => ({
      currUser: {
        ...currUser,
        [field]: !currUser[field]
      }
    }));
  };

  validForm = () => {
    return !(
      this.state.currUser.firstNameRu &&
      this.state.currUser.firstNameEn &&
      this.state.currUser.lastNameRu &&
      this.state.currUser.lastNameEn &&
      this.state.currUser.emailPrimary &&
      (!this.props.user ? this.state.currUser.password : true)
    );
  };

  openAvatarModal = () => {
    this.setState({ avatarModalOpened: true });
  };

  closeAvatarModal = () => {
    this.setState({ avatarModalOpened: false });
  };

  validator = new Validator();

  render() {
    const { user, dictionary, isAdmin, canEdit, lang } = this.props;
    const fullName = user
      ? lang === 'ru'
        ? user.fullNameRu || user.fullNameEn
        : user.fullNameEn || user.fullNameRu
      : '';

    const req = <a className={css.nessSymbol}> *</a>;

    const {
      roles,
      currUser,
      avatarModalOpened,
      isOpenDismissModal,
      isValidFirstNameRu,
      isValidFirstNameEn,
      isValidLastNameRu,
      isValidLastNameEn,
      isValidPassword,
      buttonChecked,
      isValidEmailPrimary
    } = this.state;

    const formattedDayFrom = user && user.birthDate ? moment(user.birthDate).format('DD.MM.YYYY') : '';
    const formattedEmploymentDate = user && user.employmentDate ? moment(user.employmentDate).format('DD.MM.YYYY') : '';

    const formattedDayDelete =
      user && !user.active
        ? user && user.deleteDate
          ? moment(user.deleteDate).format('DD.MM.YYYY')
          : moment(new Date()).format('DD.MM.YYYY')
        : null;

    let roleSelected, departmentSelect;

    if (canEdit) {
      roleSelected = (
        <Select
          name="globalRole"
          multi={false}
          backspaceRemoves={false}
          options={roles}
          className={css.selectType}
          value={currUser.globalRole}
          onChange={this.changeHandlerRole}
        />
      );

      departmentSelect = (
        <Select
          name="departmentList"
          multi
          backspaceRemoves={false}
          options={this.departmentList()}
          className={css.selectType}
          noResultsText="нет данных"
          value={currUser.departmentList}
          onChange={this.changeHandlerDepart}
        />
      );
    } else {
      roleSelected = <div className={css.itemValue}>{currUser.globalRole}</div>;
      departmentSelect = <div className={css.itemValue}>{currUser.department || ''}</div>;
    }

    if (negate(isObject)(user) && !this.state.newUser) {
      return <div />;
    }

    const handleAllowVPNChange = this.handleChangeCheckbox('allowVPN');
    return (
      <section>
        <UserTitle renderTitle={`[Epic] - ${dictionary.USER}`} user={currUser} />
        <div>
          <div className={css.userAvatar}>
            <Photo user={currUser} openModal={this.openAvatarModal} />
          </div>

          <h4>{localize[lang].TITLE}</h4>

          <div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].NAME}:</div>
              {isAdmin ? (
                this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <div className={css.inputWidth}>
                      <ValidatedInput
                        name="firstNameRu"
                        value={currUser.firstNameRu || ''}
                        onChange={this.changeHandler}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].ERROR_FIELD}
                      />
                    </div>
                  ),
                  'firstNameRu',
                  currUser.firstNameRu.length < 1
                )
              ) : (
                <div className={css.itemValue}>{user && user.firstNameRu}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].SURNAME}:</div>
              {isAdmin ? (
                this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <div className={css.inputWidth}>
                      <ValidatedInput
                        name="lastNameRu"
                        value={currUser.lastNameRu || ''}
                        onChange={this.changeHandler}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].ERROR_FIELD}
                      />
                    </div>
                  ),
                  'lastNameRu',
                  currUser.lastNameRu.length < 1
                )
              ) : (
                <div className={css.itemValue}>{user && user.lastNameRu}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Name:</div>
              {isAdmin ? (
                this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <div className={css.inputWidth}>
                      <ValidatedInput
                        name="firstNameEn"
                        value={currUser.firstNameEn || ''}
                        onChange={this.changeHandler}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].ERROR_FIELD}
                      />
                    </div>
                  ),
                  'firstNameEn',
                  this.state.currUser.firstNameEn.length < 1
                )
              ) : (
                <div className={css.itemValue}>{user && user.firstNameEn}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Lastname:</div>
              {canEdit ? (
                this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <div className={css.inputWidth}>
                      <ValidatedInput
                        name="lastNameEn"
                        value={currUser.lastNameEn || ''}
                        onChange={this.changeHandler}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].ERROR_FIELD}
                      />
                    </div>
                  ),
                  'lastNameEn',
                  this.state.currUser.lastNameEn.length < 1
                )
              ) : (
                <div className={css.itemValue}>{user && user.lastNameEn}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].PHONE}:</div>
              {canEdit ? (
                <div className={css.inputWidth}>
                  <Input value={currUser.phone || ''} name="phone" onChange={this.changeHandler.bind(this)} />
                </div>
              ) : (
                <div className={css.itemValue}>{user && user.phone}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].MOB_PHONE}:</div>
              {canEdit ? (
                <div className={css.inputWidth}>
                  <Input value={currUser.mobile || ''} name="mobile" onChange={this.changeHandler.bind(this)} />
                </div>
              ) : (
                <div className={css.itemValue}>{user && user.mobile}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].CORP_EMAIL}:</div>
              {isAdmin ? (
                this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <div className={css.inputWidth}>
                      <ValidatedInput
                        name="emailPrimary"
                        value={currUser.emailPrimary || ''}
                        onChange={this.changeHandler}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].ERROR_FIELD}
                      />
                    </div>
                  ),
                  'emailPrimary',
                  this.state.currUser.emailPrimary.length < 1
                )
              ) : (
                <div className={css.itemValue}>{user && user.emailPrimary}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].EMAIL}:</div>
              {canEdit ? (
                <div className={css.inputWidth}>
                  <Input
                    value={currUser.emailSecondary || ''}
                    name="emailSecondary"
                    onChange={this.changeHandler.bind(this)}
                  />
                </div>
              ) : (
                <div className={css.itemValue}>{user && user.emial}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Skype:</div>
              {canEdit ? (
                <div className={css.inputWidth}>
                  <Input value={currUser.skype || ''} name="skype" onChange={this.changeHandler.bind(this)} />
                </div>
              ) : (
                <div className={css.itemValue}>{user && user.skype}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].CITY}:</div>
              {canEdit ? (
                <div className={css.inputWidth}>
                  <Input value={currUser.city || ''} name="city" onChange={this.changeHandler.bind(this)} />
                </div>
              ) : (
                <div className={css.itemValue}>{user && user.city}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].BIRTH}:</div>
              <DatepickerDropdown
                className={css.inputWidth}
                name="birthDate"
                value={formattedDayFrom}
                onDayChange={this.changeHandlerBirthDate}
              />
            </div>
          </div>
        </div>
        <div>
          {canEdit && (
            <div>
              {' '}
              <h4>{localize[lang].INFO_USER}</h4>
              <div className={css.itemContainer}>
                <div className={css.itemTitle}>{localize[lang].ROLE}:</div>
                {roleSelected}
              </div>
              <div className={css.itemContainer}>
                <div className={css.itemTitle}>{localize[lang].DEPART}:</div>
                {departmentSelect}
              </div>
              <h4>{localize[lang].INFO_ACCOUNT}</h4>
              <div>
                <div className={css.itemContainer}>
                  <div className={css.itemTitle}>{localize[lang].EMPLOYMENT_DATE}:</div>
                  {canEdit ? (
                    <div className={css.itemTitle}>
                      <DatepickerDropdown
                        name="employmentDate"
                        className={css.inputWidth}
                        value={formattedEmploymentDate}
                        onDayChange={this.changeHandlerEmploymentDate}
                      />
                    </div>
                  ) : (
                    <div className={css.itemValue}>{formattedEmploymentDate || '-'}</div>
                  )}
                </div>

                {!this.state.newUser ? (
                  <div className={css.itemContainer}>
                    <div className={css.itemTitle}>{localize[lang].DATE_DEL}:</div>
                    {user && user.active === 1 ? (
                      <div className={css.itemInlineContainer}>
                        <div className={css.itemTitle}>
                          <DatepickerDropdown
                            className={css.itemContainerDataDelete}
                            name="deleteDate"
                            value={formattedDayDelete}
                            onDayChange={this.setDate}
                          />
                        </div>
                        <div className={css.itemContainerDataDeleteButton}>
                          <Button
                            text={!this.state.newUser ? localize[lang].DISMISS_USER : localize[lang].BTN_CREATE}
                            onClick={this.handleOpenDismissModal}
                            disabled={this.validForm()}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={css.itemTitle}>{user ? user.deleteDate : ''}:</div>
                    )}
                  </div>
                ) : (
                  <div />
                )}
                {!this.state.newUser && (
                  <div className={css.itemContainer}>
                    <div className={css.itemTitle}>{localize[lang].ACCOUNT}:</div>
                    {user && user.active === 1 ? (
                      <div className={css.itemValue}>{localize[lang].ACTIVE}</div>
                    ) : (
                      <div className={css.itemValue}>{localize[lang].DISABLED}</div>
                    )}
                  </div>
                )}
                {canEdit && !user ? (
                  this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <div className={css.itemContainer}>
                        <div className={css.itemTitle}>{localize[lang].PASSWORD}:</div>
                        <div className={css.inputWidth}>
                          <ValidatedInput
                            name="password"
                            value={currUser.password || ''}
                            onChange={this.changeHandler}
                            onBlur={handleBlur}
                            shouldMarkError={shouldMarkError}
                            errorText={localize[lang].ERROR_FIELD}
                          />
                        </div>
                      </div>
                    ),
                    'password',
                    currUser.password.length < 1
                  )
                ) : (
                  <div />
                )}
              </div>
              <div className={css.itemContainer}>
                <Checkbox
                  checked={currUser.allowVPN}
                  onChange={handleAllowVPNChange}
                  label={localize[lang].VPN_ENTRY}
                />
              </div>
            </div>
          )}

          <div className={css.actionFormUser}>
            <Button
              text={!this.state.newUser ? localize[lang].BTN_SAVE : localize[lang].BTN_CREATE}
              onClick={!this.state.newUser ? this.saveUser.bind(this) : this.createUser}
              disabled={this.validForm()}
            />
          </div>
        </div>
        {avatarModalOpened && (
          <UserPhotoModal user={currUser} closeModal={this.closeAvatarModal} changePhoto={this.changePhotoHandler} />
        )}

        {isOpenDismissModal && (
          <Modal isOpen contentLabel="modal" onRequestClose={this.handleOpenDismissModal}>
            <form className={css.changeStage}>
              <h3>
                {localize[lang].ARE_YOU_SURE} {fullName}?
              </h3>
              <div className={css.modalContainer}>
                <Button
                  addedClassNames={{ [css.buttonBlock]: true }}
                  type="green"
                  text="OK"
                  onClick={this.dismissUser}
                  htmlType="submit"
                />
                <Button
                  addedClassNames={{ [css.buttonBlock]: true }}
                  text={localize[lang].CANCEL}
                  onClick={this.handleOpenDismissModal}
                  disabled={this.validForm()}
                />
              </div>
            </form>
          </Modal>
        )}
      </section>
    );
  }
}

const mapDispatchToProps = {
  updateUserProfile
};

export default connect(
  null,
  mapDispatchToProps
)(User);
