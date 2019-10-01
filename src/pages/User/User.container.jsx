import React, { Component } from 'react';
import { connect } from 'react-redux';

import { eq, negate, isObject } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';

import UserTitle from './UserTitle';
import * as css from './User.styles.scss';
import localize from './User.dictionary.json';

import { updateUserProfile } from '../../actions/UsersRoles';
import { Photo } from '../../components';
import Input from '../../components/Input';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Select from 'react-select';
import Button from '../../components/Button';

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
        phone: '',
        mobile: '',
        emailPrimary: '',
        skype: '',
        deletedAt: '',
        department: '',
        globalRole: 'USER',
        departmentList: [],
        birthDate: ''
      },
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
    this.setState({
      currUser: {
        ...this.state.currUser,
        ...user
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

  render() {
    const { user, dictionary, lang, isAdmin } = this.props;
    const { currUser, roles } = this.state;
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

    console.log(this.state.currUser);

    if (negate(isObject)(user)) {
      return <div />;
    }

    return (
      <section>
        <UserTitle renderTitle={`[object Object] - ${dictionary.USER}`} user={user} />
        <div>
          <Photo user={user} />
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
              <div className={css.itemTitle}>{localize[lang].PHONE}:</div>
              {isAdmin ? (
                <Input value={currUser.phone || ''} name="phone" onChange={this.changeHandler.bind(this)} />
              ) : (
                <div className={css.itemValue}>{user.phone}</div>
              )}
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].MOB_PHONE}:</div>
              {isAdmin ? (
                <Input value={currUser.mobile || ''} name="mobile" onChange={this.changeHandler.bind(this)} />
              ) : (
                <div className={css.itemValue}>{user.mobile}</div>
              )}
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
              {isAdmin ? (
                <Input value={currUser.skype || ''} name="skype" onChange={this.changeHandler.bind(this)} />
              ) : (
                <div className={css.itemValue}>{user.skype}</div>
              )}
            </div>
          </div>
          <h4>{localize[lang].INFO_USER}</h4>
          <div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].ROLE}:</div>
              {roleSelected}
            </div>
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
              <div className={css.itemTitle}>{localize[lang].DATE_DEL}:</div>
              <div className={css.itemValue}>{user.deletedAt}</div>
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>{localize[lang].DEPART}:</div>
              {departmentSelect}
            </div>
          </div>
          <div className={css.actionFormUser}>
            <Button text={localize[lang].BTN_SAVE} onClick={this.saveUser.bind(this)} />
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
