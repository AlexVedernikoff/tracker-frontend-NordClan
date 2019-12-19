import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import classnames from 'classnames';

import { eq, negate, isObject } from 'lodash';
import PropTypes from 'prop-types';

import UserTitle from './UserTitle';
import * as css from './User.styles.scss';
import localize from './User.dictionary.json';

import { updateUserProfile } from '../../actions/UsersRoles';
import { Photo } from '../../components/Photo';
import Input from '../../components/Input';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Select from 'react-select';
import Button from '../../components/Button';
import ValidatedInput from '../../components/ValidatedInput';
import Validator from '../../components/ValidatedInput/Validator';
import { ROLES_PATH } from '../../constants/UsersProfile';
import UserPhotoModal from '../../components/UserPhotoModal';
import Checkbox from '../../components/Checkbox';
import Modal from '../../components/Modal';

class User extends Component {
  static propTypes = {
    dictionary: PropTypes.objectOf(PropTypes.string).isRequired,
    getUser: PropTypes.func.isRequired,
    location: PropTypes.shape({
      action: PropTypes.string.isRequired,
      hash: PropTypes.string,
      key: PropTypes.string,
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object,
      search: PropTypes.string,
      state: PropTypes.object
    }).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string
    }),
    purgeUser: PropTypes.func.isRequired,
    user: PropTypes.shape({
      authorsProjects: PropTypes.arrayOf(PropTypes.number),
      birthDate: PropTypes.string,
      deletedAt: PropTypes.string,
      department: PropTypes.string,
      emailPrimary: PropTypes.string,
      expiredDate: PropTypes.string,
      firstNameEn: PropTypes.string,
      firstNameRu: PropTypes.string,
      fullNameEn: PropTypes.string,
      fullNameRu: PropTypes.string,
      globalRole: PropTypes.string,
      id: PropTypes.number,
      isActive: PropTypes.number,
      lastNameEn: PropTypes.string,
      lastNameRu: PropTypes.string,
      mobile: PropTypes.string,
      phone: PropTypes.string,
      photo: PropTypes.string,
      projects: PropTypes.arrayOf(PropTypes.number),
      projectsRoles: PropTypes.shape({
        admin: PropTypes.arrayOf(PropTypes.number),
        user: PropTypes.arrayOf(PropTypes.number)
      }),
      psId: PropTypes.string,
      skype: PropTypes.string,
      employmentDate: PropTypes.string
    }),
    lang: PropTypes.string,
    updateUsersProfile: PropTypes.func.isRequired,
    getDepartments: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    departments: PropTypes.array,
    isAdmin: PropTypes.bool
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
        active: 1
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
      this.setState({ newUser: true });
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
    let data = Object.assign({}, this.state.currUser);

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
    const { user, dictionary, isAdmin, lang } = this.props;
    const fullName = user ? (lang === 'ru' ? user.fullNameRu : user.fullNameEn) : '';

    const { roles, currUser, avatarModalOpened, isOpenDismissModal } = this.state;

    const formattedDayFrom = user && user.birthDate ? moment(user.birthDate).format('DD.MM.YYYY') : '';
    const formattedEmploymentDate = user && user.employmentDate ? moment(user.employmentDate).format('DD.MM.YYYY') : '';

    const formattedDayDelete =
      user && !user.active
        ? user && user.deleteDate
          ? moment(user.deleteDate).format('DD.MM.YYYY')
          : moment(new Date()).format('DD.MM.YYYY')
        : null;

    let roleSelected, departmentSelect;

    if (isAdmin) {
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
                <div className={css.itemValue}>{user.firstNameRu}</div>
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
                <div className={css.itemValue}>{user.lastNameRu}</div>
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
                <div className={css.itemValue}>{user.firstNameEn}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Lastname:</div>
              {isAdmin ? (
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
                <div className={css.itemValue}>{user.lastNameEn}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].PHONE}:</div>
              {isAdmin ? (
                <div className={css.inputWidth}>
                  <Input value={currUser.phone || ''} name="phone" onChange={this.changeHandler.bind(this)} />
                </div>
              ) : (
                <div className={css.itemValue}>{user.phone}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].MOB_PHONE}:</div>
              {isAdmin ? (
                <div className={css.inputWidth}>
                  <Input value={currUser.mobile || ''} name="mobile" onChange={this.changeHandler.bind(this)} />
                </div>
              ) : (
                <div className={css.itemValue}>{user.mobile}</div>
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
                <div className={css.itemValue}>{user.emailPrimary}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].EMAIL}:</div>
              {isAdmin ? (
                <div className={css.inputWidth}>
                  <Input
                    value={currUser.emailSecondary || ''}
                    name="emailSecondary"
                    onChange={this.changeHandler.bind(this)}
                  />
                </div>
              ) : (
                <div className={css.itemValue}>{user.emial}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Skype:</div>
              {isAdmin ? (
                <div className={css.inputWidth}>
                  <Input value={currUser.skype || ''} name="skype" onChange={this.changeHandler.bind(this)} />
                </div>
              ) : (
                <div className={css.itemValue}>{user.skype}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].CITY}:</div>
              {isAdmin ? (
                <div className={css.inputWidth}>
                  <Input value={currUser.city || ''} name="city" onChange={this.changeHandler.bind(this)} />
                </div>
              ) : (
                <div className={css.itemValue}>{user.city}</div>
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
          {isAdmin && (
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
                  {isAdmin ? (
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
                {isAdmin && !user ? (
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
