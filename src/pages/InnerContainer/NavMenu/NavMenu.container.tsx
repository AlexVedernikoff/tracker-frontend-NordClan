import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eq from 'lodash/get';
import reduce from 'lodash/reduce';

import {
  IconCalendar,
  IconEdit,
  IconPortfolio,
  IconUsers,
  IconExternalUsers,
  IconList,
  IconOrganization,
  IconUser,
  IconBook
} from '../../../components/Icons';
import Toggle from '../../../components/LanguageToggle';

import isAdmin from '../../../utils/isAdmin';
import { isVisor } from '../../../utils/isVisor';
import isHR from '../../../utils/isHR';

import { DEV_OPS, EXTERNAL_USER } from '../../../constants/Roles';

import localize from './NavMenu.dictionary.json';
import * as css from './NavMenu.styles.scss';

import ToggleButton from './ToggleButton';
import NawButton from './NawButton';
import NawLink from './NawLink';
import SidebarHeader from './SidebarHeader';

export class NavMenu extends Component<any, any> {
  static propTypes = {
    lang: PropTypes.string,
    mqlMatches: PropTypes.bool,
    setLocalize: PropTypes.func,
    sidebarDocked: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    toggleMenu: PropTypes.func,
    user: PropTypes.object
  };

  get dictionary() {
    const { lang } = this.props;

    return localize[lang];
  }

  get sideMenuRoadMap() {
    const {
      user: { globalRole }
    } = this.props;
    const dictionary = this.dictionary;
    const isAdminRole = isAdmin(globalRole);
    const isDevOpsRole = eq(globalRole, DEV_OPS);
    const isExternalUser = eq(globalRole, EXTERNAL_USER);
    const isVisorRole = isVisor(globalRole);
    const isHRRole = isHR(globalRole);

    return [
      {
        isActive: !isExternalUser,
        Icon: IconUser,
        to: '/user',
        title: dictionary.USER
      },
      {
        isActive: true,
        Icon: IconPortfolio,
        to: '/projects',
        title: dictionary.MY_PROJECTS
      },
      {
        isActive: true,
        Icon: IconEdit,
        to: '/tasks',
        title: dictionary.MY_TASKS
      },
      {
        isActive: isAdminRole || isDevOpsRole,
        Icon: IconList,
        to: '/tasks-devops',
        title: dictionary.MY_TASKS_DEVOPS
      },
      {
        isActive: !isExternalUser,
        Icon: IconCalendar,
        to: '/timereports',
        title: dictionary.TIMESHEETS
      },
      {
        isActive: isAdminRole || isVisorRole,
        Icon: IconOrganization,
        to: '/company-timereports',
        title: dictionary.COMPANY_TIMESHEETS
      },
      {
        isActive: isAdminRole || isHRRole,
        Icon: IconUsers,
        to: '/roles',
        title: dictionary.USERS
      },
      {
        isActive: isAdminRole,
        Icon: IconExternalUsers,
        to: '/externalUsers',
        title: dictionary.EXTERNAL_USERS
      },
      {
        isActive: isAdminRole,
        Icon: IconBook,
        to: '/testing-case-reference',
        title: dictionary.TESTING_CASE_REFERENCE
      }
    ];
  }

  get nawMenuList() {
    const { sidebarOpened } = this.props;

    const nawMenuItems = (() => {
      const NawMenuItem = sidebarOpened ? NawLink : NawButton;

      return reduce(
        this.sideMenuRoadMap,
        (accumulator, props, index) => {
          if (props.isActive) {
            const item = <NawMenuItem {...props} key={`${index}-${props.to}`} />;

            return [...accumulator, item];
          }

          return accumulator;
        },
        []
      );
    })();

    return <ul className={css.sidebarLinks}>{nawMenuItems}</ul>;
  }

  render() {
    const { mqlMatches, sidebarOpened, toggleMenu, lang, user } = this.props;

    return (
      <div className={sidebarOpened ? css.navigation : css.navigationMenuClosed}>
        <SidebarHeader user={user} sidebarOpened={sidebarOpened} />
        {this.nawMenuList}
        <ToggleButton sidebarOpened={sidebarOpened} mqlMatches={mqlMatches} toggleMenu={toggleMenu} />
        <Toggle lang={lang} onChange={this.props.setLocalize} location="navMenu" />
      </div>
    );
  }
}
