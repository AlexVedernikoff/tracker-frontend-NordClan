import React, { Component } from 'react';
import { connect } from 'react-redux';

import { eq, negate, isObject } from 'lodash';
import PropTypes from 'prop-types';

import UserTitle from './UserTitle';
import * as css from './User.styles.scss';

import { updateUserProfile } from '../../actions/UsersRoles';
import { Photo } from '../../components';
import Input from '../../components/Input';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Select from 'react-select';
import Button from '../../components/Button';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currUser: {
        firstNameRu: '',
        phone: props.user ? props.user.phone : '',
        // phone: '',
        mobile: '',
        emailPrimary: '',
        scype: '',
        deletedAt: '',
        department: '',
        globalRole: 1
      },
      roles: [
        { label: 'ADMIN', value: 1 },
        { label: 'USER', value: 2 },
        { label: 'VISOR', value: 3 },
        { label: 'DEV_OPS', value: 4 }
      ],
      department: [
        { value: '01', label: 'department 01' },
        { value: '02', label: 'department 02' },
        { value: '03', label: 'department 03' }
      ]
    };
  }

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
      department: PropTypes.array,
      emailPrimary: PropTypes.string,
      expiredDate: PropTypes.string,
      firstNameEn: PropTypes.string,
      firstNameRu: PropTypes.string,
      fullNameEn: PropTypes.string,
      fullNameRu: PropTypes.string,
      globalRole: PropTypes.string,
      id: PropTypes.number,
      isActive: PropTypes.bool,
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
    })
  };

  componentDidMount() {
    this.props.getUser();
  }

  componentDidUpdate(prevProps) {
    if (negate(eq)(prevProps.user, this.props.user)) {
      this.userMount();
    }
    if (negate(eq)(prevProps.location.pathname, this.props.location.pathname)) {
      this.props.getUser();
    }
  }

  componentWillUnmount() {
    this.props.purgeUser();
  }

  get userFieldsRoadMap() {
    return;
  }

  userMount = () => {
    this.setState({
      currUser: {
        ...this.state.currUser,
        ...this.props.user
      }
    });
  };

  saveUser = () => {
    this.props.updateUserProfile(this.state.currUser);
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

  changeHandlerDepart = e => {};

  changeHandlerRole = e => {
    const value = event.target.value;
    this.setState({
      currUser: {
        globalRole: value
      }
    });
  };

  render() {
    const { user, dictionary } = this.props;
    const { roles, department, currUser } = this.state;
    const formattedDayFrom = user && user.birthDate ? moment(user.birthDate).format('DD.MM.YYYY') : '';
    const admin = user && user.globalRole === 'ADMIN';

    let roleSelected, departmentSelect;

    if (admin) {
      roleSelected = (
        <Select
          name="department"
          multi={false}
          backspaceRemoves={false}
          options={roles}
          className={css.selectType}
          value={currUser.globalRole || ''}
          onChange={this.changeHandlerDepart.bind(this)}
        />
      );
      departmentSelect = (
        <Select
          name="globalRole"
          multi={true}
          backspaceRemoves={false}
          options={department}
          className={css.selectType}
          value={currUser.department || ''}
          onChange={this.changeHandlerRole}
        />
      );
    } else {
      roleSelected = <div className={css.itemValue}>{currUser.globalRole}</div>;
      departmentSelect = <div className={css.itemValue}>{currUser.department}</div>;
    }

    // console.log(this.props.user);
    console.log(this.state.currUser);

    if (negate(isObject)(user)) {
      return <div />;
    }

    return (
      <section>
        <UserTitle renderTitle={`[object Object] - ${dictionary.USER}`} user={user} />
        <div>
          <Photo user={user} />
          <h4>Контактная информация</h4>

          <div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Имя:</div>
              {admin ? (
                <Input value={currUser.firstNameRu || ''} name="firstNameRu" onChange={this.changeHandler.bind(this)} />
              ) : (
                <div className={css.itemValue}>{user.firstNameRu}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Телефон:</div>
              {admin ? (
                <Input value={currUser.phone || ''} name="phone" onChange={this.changeHandler.bind(this)} />
              ) : (
                <div className={css.itemValue}>{user.phone}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Мобильный телефон:</div>
              {admin ? (
                <Input value={currUser.mobile || ''} name="mobile" onChange={this.changeHandler.bind(this)} />
              ) : (
                <div className={css.itemValue}>{user.mobile}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>e-mail:</div>
              {admin ? (
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
              {admin ? (
                <Input value={currUser.skype || ''} name="skype" onChange={this.changeHandler.bind(this)} />
              ) : (
                <div className={css.itemValue}>{user.skype}</div>
              )}
            </div>
          </div>
          <h4>Информация о пользователе</h4>
          <div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Роль:</div>
              {roleSelected}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Дата рождения:</div>
              <DatepickerDropdown
                name="birthDate"
                value={formattedDayFrom}
                // onDayChange={}
              />
            </div>
          </div>
          <h4>Информация об учётной записи</h4>
          <div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Дата удаления:</div>
              <div className={css.itemValue}>{user.deletedAt}</div>
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Отдел:</div>
              {departmentSelect}
            </div>
          </div>
          <div className={css.actionFormUser}>
            <Button text="Сохранить" onClick={this.saveUser.bind(this)} />
          </div>
        </div>
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
