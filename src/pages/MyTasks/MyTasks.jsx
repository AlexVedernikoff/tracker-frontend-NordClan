import React, { Component } from 'react';
import { exact, string, oneOf, func, shape } from 'prop-types';
import Title from 'react-title-component';

import AgileBoard from './AgileBoard';
import AgileBoardFilter from './AgileBoardFilter';

import ScrollTop from '../../components/ScrollTop';
import { initialFilters } from './constants';

export default class MyTasks extends Component {
  static propTypes = {
    clearFilters: func.isRequired,
    filters: shape({}),
    getTasks: func.isRequired,
    lang: oneOf(['ru', 'en']),
    localizationDictionary: exact({
      MY_TASKS: string.isRequired
    }).isRequired,
    setFilterValue: func.isRequired
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

  render() {
    const { localizationDictionary, lang, filters, setFilterValue, clearFilters } = this.props;

    return (
      <div>
        <Title render={`[Epic] - ${localizationDictionary.MY_TASKS}`} />
        <h1>{localizationDictionary.MY_TASKS}</h1>
        <hr />
        <AgileBoardFilter
          lang={lang}
          getTasks={this.getTasks}
          initialFilters={initialFilters}
          filters={filters}
          setFilterValue={setFilterValue}
          clearFilters={clearFilters}
        />
        <AgileBoard getTasks={this.getTasks} />
        <ScrollTop />
      </div>
    );
  }
}
