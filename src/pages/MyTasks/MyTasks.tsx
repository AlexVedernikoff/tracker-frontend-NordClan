import React, { Component } from 'react';
import { exact, string, oneOf, func, arrayOf, number, bool } from 'prop-types';
import Title from '../../components/Title';

import flow from 'lodash/flow';

import AgileBoard from './AgileBoard';
import AgileBoardFilter from './AgileBoardFilter';

import ScrollTop from '../../components/ScrollTop';

export default class MyTasks extends Component<any, any> {
  static propTypes = {
    clearFilters: func.isRequired,
    filters: exact({
      authorId: arrayOf(number),
      isOnlyMine: bool,
      name: string,
      performerId: arrayOf(number),
      prioritiesId: number,
      typeId: arrayOf(number).isRequired
    }).isRequired,
    getAllUsers: func.isRequired,
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
    this.getTasks(); 
  }

  getTasks = () => {
    const { filters, getTasks } = this.props;

    const options = {
      prioritiesId: filters.prioritiesId || null,
      authorId: filters.authorId || null,
      typeId: filters.typeId || null,
      name: filters.name || null,
      performerId: filters.performerId || null
    };

    getTasks(options);
  };

  get agileBoardFilterView() {
    const { clearFilters, filters, getAllUsers, initialFilters, lang, setFilterValue, typeOptions, users } = this.props;
    
      return (
        <AgileBoardFilter
          lang={lang}
          getTasks={this.getTasks}
          initialFilters={initialFilters}
          filters={filters}
          setFilterValue={setFilterValue}
          clearFilters={clearFilters}
          typeOptions={typeOptions}
          getAllUsers={getAllUsers}
          users={users}
        />
      );
  }

  render() {
    const { localizationDictionary } = this.props;

    return (
      <div>
        <Title render={`[Epic] - ${localizationDictionary.MY_TASKS}`} />
        <h1>{localizationDictionary.MY_TASKS}</h1>
        <hr />
        {this.agileBoardFilterView}
        <AgileBoard getTasks={this.getTasks} />
        <ScrollTop />
      </div>
    );
  }
}
