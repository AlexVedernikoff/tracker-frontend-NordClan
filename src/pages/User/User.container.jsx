import React, { Component } from 'react';
import { connect } from 'react-redux';

import { eq, negate, isObject } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';

import UserTitle from './UserTitle';
import * as css from './User.styles.scss';
import localize from './User.dictionary.json';

import { updateUserProfile } from '../../actions/UsersRoles';
import { Photo } from '../../components/Photo';
import Input from '../../components/Input';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Select from 'react-select';
import Button from '../../components/Button';
import UserPhotoModal from '../../components/UserPhotoModal';

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
      skype: PropTypes.string
    }),
    updateUserProfile: PropTypes.func,
    lang: PropTypes.string,
    departments: PropTypes.array,
    getDepartments: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool,
    birthDate: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
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
        department: '',
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
    this.props.getUser();
  }

  componentDidUpdate(prevProps) {
    if (negate(eq)(prevProps.user, this.props.user)) {
      this.props.getDepartments();
      this.userMount();
    }
    if (negate(eq)(prevProps.location.pathname, this.props.location.pathname)) {
      this.props.getUser();
    }
  }

  componentWillUnmount() {
    this.props.purgeUser();
  }

  userMount = () => {
    const user = Object.assign({}, this.props.user);
    const depart = user.departmentList.map(el => ({ label: el.name, value: el.id }));
    user.departmentList = depart;

    let userDataForState = {
      id: user.id,
      phone: user.phone,
      mobile: user.mobile,
      skype: user.skype,
      birthDate: user.birthDate,
      photo: user.photo
    };

    if (user.isAdmin) {
      userDataForState = {
        ...userDataForState,
        firstNameRu: user.firstNameRu,
        firstNameEn: user.firstNameEn,
        lastNameRu: user.lastNameRu,
        lastNameEn: user.lastNameEn,
        emailPrimary: user.emailPrimary,
        departmentList: user.departmentList,
        department: user.department
      };
    }

    this.setState({
      currUser: {
        ...this.state.currUser,
        ...user
      }
    });
  };

  saveUser = () => {
    const depart = [];
    this.state.currUser.departmentList.forEach(e => {
      depart.push(e.value);
    });
    let userDataForState = {
      id: this.state.currUser.id,
      phone: this.state.currUser.phone,
      mobile: this.state.currUser.mobile,
      skype: this.state.currUser.skype,
      birthDate: this.state.currUser.birthDate,
      photo: this.state.currUser.photo
    };
    if (this.props.isAdmin) {
      userDataForState = {
        ...userDataForState,
        firstNameRu: this.state.currUser.firstNameRu,
        firstNameEn: this.state.currUser.firstNameEn,
        lastNameRu: this.state.currUser.lastNameRu,
        lastNameEn: this.state.currUser.lastNameEn,
        emailPrimary: this.state.currUser.emailPrimary,
        departmentList: depart,
        deleteDate: this.state.currUser.deleteDate
      };
    }
    this.props.updateUserProfile(userDataForState);
  };

  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      currUser: {
        ...this.state.currUser,
        [name]: value
      }
    });
  };

  changePhotoHandler = photo => {
    this.setState({ currUser: { ...this.state.currUser, photo } });
  };

  departmentList = () => {
    return this.props.departments.map(el => ({ label: el.name, value: el.id }));
  };

  changeHandlerDepart = option => {
    this.setState({
      currUser: {
        ...this.state.currUser,
        departmentList: [...option]
      }
    });
  };

  changeHandlerRole = opt => {
    this.setState({
      currUser: {
        ...this.state.currUser,
        globalRole: opt.value
      }
    });
  };

  changeBirtDate = val => {
    const date = val.format();
    this.setState({
      currUser: {
        ...this.state.currUser,
        birthDate: date
      }
    });
  };

  openAvatarModal = () => {
    this.setState({ avatarModalOpened: true });
  };

  closeAvatarModal = () => {
    this.setState({ avatarModalOpened: false });
  };

  render() {
    const { user, dictionary, lang, isAdmin } = this.props;
    const { currUser, roles, avatarModalOpened } = this.state;
    const formattedDayFrom = user && user.birthDate ? moment(currUser.birthDate).format('DD.MM.YYYY') : '';

    let roleSelected, departmentSelect;

    if (isAdmin) {
      departmentSelect = (
        <Select
          name="departmentList"
          multi
          backspaceRemoves={false}
          options={this.departmentList()}
          className={css.selectType}
          value={currUser.departmentList || ''}
          onChange={this.changeHandlerDepart}
        />
      );
      roleSelected = (
        <Select
          name="globalRole"
          multi={false}
          backspaceRemoves={false}
          options={roles}
          className={css.selectType}
          value={currUser.globalRole || ''}
          onChange={this.changeHandlerRole}
        />
      );
    } else {
      roleSelected = <div className={css.itemValue}>{currUser.globalRole}</div>;
      departmentSelect = <div className={css.itemValue}>{currUser.department}</div>;
    }

    if (negate(isObject)(user)) {
      return <div />;
    }

    return (
      <section>
        <UserTitle renderTitle={`[Epic] - ${dictionary.USER}`} user={user} />
        <div>
          <Photo user={currUser} openModal={this.openAvatarModal} />
          <h4>{localize[lang].TITLE}</h4>

          <div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].NAME}:</div>
              {isAdmin ? (
                <Input value={currUser.firstNameRu || ''} name="firstNameRu" onChange={this.changeHandler.bind(this)} />
              ) : (
                <div className={css.itemValue}>{user.firstNameRu}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].SURNAME}:</div>
              {isAdmin ? (
                <Input value={currUser.lastNameRu || ''} name="lastNameRu" onChange={this.changeHandler.bind(this)} />
              ) : (
                <div className={css.itemValue}>{user.lastNameRu}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].PHONE}:</div>
              <Input value={currUser.phone || ''} name="phone" onChange={this.changeHandler.bind(this)} />
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].MOB_PHONE}:</div>
              <Input value={currUser.mobile || ''} name="mobile" onChange={this.changeHandler.bind(this)} />
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>e-mail:</div>
              {isAdmin ? (
                <Input
                  value={currUser.emailPrimary || ''}
                  name="emailPrimary"
                  onChange={this.changeHandler.bind(this)}
                />
              ) : (
                <div className={css.itemValue}>{user.emailPrimary}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Skype:</div>
              <Input value={currUser.skype || ''} name="skype" onChange={this.changeHandler.bind(this)} />
            </div>
          </div>
          <h4>{localize[lang].INFO_USER}</h4>
          <div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].BIRTH}:</div>
              <DatepickerDropdown
                name="birthDate"
                className={css.selectType}
                value={formattedDayFrom}
                onDayChange={this.changeBirtDate}
              />
            </div>
          </div>
          <h4>{localize[lang].INFO_ACCOUNT}</h4>
          <div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].DEPART}:</div>
              {departmentSelect}
            </div>
          </div>
          <div className={css.actionFormUser}>
            <Button text={localize[lang].BTN_SAVE} onClick={this.saveUser.bind(this)} />
          </div>
        </div>
        {avatarModalOpened && (
          <UserPhotoModal user={currUser} closeModal={this.closeAvatarModal} changePhoto={this.changePhotoHandler} />
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
