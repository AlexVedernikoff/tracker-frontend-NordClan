import React, { Component } from 'react';
import { eq, negate, isObject } from 'lodash';
import PropTypes from 'prop-types';

import UserTitle from './UserTitle';
import * as css from './User.styles.scss';

import { Photo } from '../../components';

export class User extends Component {
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
    })
  };

  componentDidMount() {
    this.props.getUser();
  }

  componentDidUpdate(prevProps) {
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

  render() {
    const { user, dictionary } = this.props;

    console.warn(this.props.user);

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
              <div className={css.itemTitle}>Телефон:</div>
              <div className={css.itemValue}>{user.phone}</div>
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Мобильный телефон:</div>
              <div className={css.itemValue}>{user.mobile}</div>
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>e-mail:</div>
              <div className={css.itemValue}>{user.emailPrimary}</div>
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Skype:</div>
              <div className={css.itemValue}>{user.skype}</div>
            </div>
          </div>
          <h4>Информация о пользователе</h4>
          <div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Роль:</div>
              <div className={css.itemValue}>{user.globalRole}</div>
            </div>
            <div className={css.itemContainer}>
              <div className={css.itemTitle}>Дата рождения:</div>
              <div className={css.itemValue}>{user.birthDate}</div>
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
              <div className={css.itemValue}>{user.department}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
