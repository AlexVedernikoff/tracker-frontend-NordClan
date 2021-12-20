import React, { Component } from 'react';
import { exact, string, oneOf, func, arrayOf, number, bool, array } from 'prop-types';
import Title from '../../components/Title';
import flow from 'lodash/flow';
import AgileBoard from './AgileBoard';
import ScrollTop from '../../components/ScrollTop';

export default class MyTasks extends Component<any, any> {
  static propTypes = {
    clearFilters: func.isRequired,
    filters: exact({
      authorId: arrayOf(number),
      isOnlyMine: bool,
      name: string,
      performerId: arrayOf(number),
      projectIds: arrayOf(number),
      prioritiesId: number,
      typeId: arrayOf(number).isRequired
    }).isRequired,
    getAllUsers: func.isRequired,
    getProjectsAll: func.isRequired,
    getTasks: func.isRequired,
    initialFilters: exact({
      authorId: arrayOf(number),
      isOnlyMine: bool,
      name: string,
      performerId: arrayOf(number),
      prioritiesId: number,
      typeId: arrayOf(number).isRequired
    }).isRequired,
    isAdmin: bool.isRequired,
    lang: oneOf(['ru', 'en']).isRequired,
    localizationDictionary: exact({
      MY_TASKS: string.isRequired
    }).isRequired,
    projects: flow(
      exact,
      arrayOf
    )({
      id: number,
      name: string
    }),
    setFilterValue: func.isRequired,
    typeOptions: flow(
      exact,
      arrayOf
    )({
      value: number.isRequired,
      label: string.isRequired
    }).isRequired,
    users: flow(
      exact,
      arrayOf
    )({
      active: number,
      emailPrimary: string,
      firstNameEn: string,
      firstNameRu: string,
      fullNameEn: string,
      fullNameRu: string,
      id: number.isRequired,
      lastNameEn: string,
      lastNameRu: string,
      mobile: string,
      photo: string,
      skype: string
    })
  };

  componentDidMount() {
    const { getAllUsers, getProjectsAll } = this.props;
    getProjectsAll();
    getAllUsers();
  }

  render() {
    const { localizationDictionary, getAllUsers, projects, typeOptions, users, getTasks } = this.props;

    return (
      <div>
        <Title render={`[Epic] - ${localizationDictionary.MY_TASKS}`} />
        <h1>{localizationDictionary.MY_TASKS}</h1>
        <hr />
        <AgileBoard getAllUsers={getAllUsers} getTasks={getTasks} projects={projects} typeOptions={typeOptions} users={users} />
        <ScrollTop />
      </div>
    );
  }
}
