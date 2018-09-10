import React from 'react';
import { history } from '../../History';
import * as settings from './settings';
import * as _ from 'lodash';

const FiltersManager = (ControlledComponent, initialFilters) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        filters: initialFilters
      };
    }

    componentWillMount() {
      if (this.urlQueryIsEmpty()) {
        if (this.useStorage()) {
          this.state.filters = {
            ...this.state.filters,
            ...this.getFiltersFromStorage()
          };
        }
      } else if (settings.mapFilterFromUrl) {
        const filtersFromUrl = this.getFiltersFromUrl();
        if (!this.filtersIsEmpty(filtersFromUrl)) {
          this.state = {
            filters: {
              ...this.state.filters,
              ...filtersFromUrl
            }
          };
          if (this.useStorage()) {
            this.saveFiltersToStorage();
          }
        } else if (this.useStorage()) {
          this.state.filters = this.getFiltersFromStorage();
        }
        this.cleanUrlQuery();
      }
    }

    filtersIsEmpty = filters => {};

    filtersStateIsEmpty = () => {
      return this.filtersIsEmpty(this.state.filters);
    };

    useStorage = () => {
      return settings.useSessionStorage || settings.useLocalStorage;
    };

    mapFiltersToUrl = () => {
      const mappedFilters = {};
      for (const filter in this.state.filters) {
        if (this.state.filters.hasOwnProperty(filter)) {
          if (!this.isEmpty(this.state.filters[filter])) {
            mappedFilters[filter] = settings.mapFilterToUrl(filter, this.state.filters[filter]);
          }
        }
      }
      return mappedFilters;
    };

    getUrlWithFilters = () => {
      return this.state.filters;
    };

    urlQueryIsEmpty = () => {
      return this.isEmpty(this.props.location.query);
    };

    isEmpty = obj => {
      for (const key in obj) {
        return false;
      }
      return true;
    };

    getFiltersFromStorage = () => {
      let filtersData = {};
      if (settings.useSessionStorage) {
        filtersData = this.compareWithInitFilters(this.getFiltersFromSessionStorage());
      }
      if (settings.useLocalStorage) {
        filtersData = this.compareWithInitFilters(this.getFiltersFromLocalStorage());
      }
      return filtersData;
    };

    compareWithInitFilters = filtersData => {
      const validFilters = {};
      for (const key in filtersData) {
        if (initialFilters[key] !== undefined) {
          validFilters[key] = initialFilters[key];
        }
      }
      return validFilters;
    };

    getFiltersFromLocalStorage = () => {
      try {
        const LocalStorageFilters = localStorage.getItem(this.props.location.pathname);
        return LocalStorageFilters ? JSON.parse(LocalStorageFilters) : {};
      } catch (e) {
        return {};
      }
    };

    getFiltersFromSessionStorage = () => {
      try {
        const SessionStorageFilters = sessionStorage.getItem(this.props.location.pathname);
        return SessionStorageFilters ? JSON.parse(SessionStorageFilters) : {};
      } catch (e) {
        return {};
      }
    };

    saveFiltersToStorage = () => {
      if (settings.useLocalStorage) {
        this.saveFiltersToLocalStorage();
      }
      if (settings.useSessionStorage) {
        this.saveFiltersToSessionStorage();
      }
    };

    saveFiltersToLocalStorage = () => {
      localStorage.setItem(this.props.location.pathname, JSON.stringify(this.state.filters));
    };

    saveFiltersToSessionStorage = () => {
      sessionStorage.setItem(this.props.location.pathname, JSON.stringify(this.state.filters));
    };

    getFiltersFromUrl = () => {
      const filtersData = {};
      for (const key in this.props.location.query) {
        if (this.state.filters[key]) {
          filtersData[key] = settings.mapFilterFromUrl(key, this.props.location.query[key]);
        }
      }
      return filtersData;
    };

    cleanUrlQuery = () => {
      history.replace({
        ...this.props.location,
        query: {}
      });
    };

    setFilterValue = (label, value, callback) => {
      if (Array.isArray(this.state.filters[label])) {
        this.setState(
          {
            filters: {
              [label]: [...this.state.filters, value]
            }
          },
          this.checkCallback(callback)
        );
      } else if (this.state.filters[label] !== undefined) {
        this.setState(
          {
            filters: {
              ...this.state.filters,
              [label]: value
            }
          },
          this.checkCallback(callback)
        );
      }
      this.saveFiltersToStorage();
    };

    clearFilters = callback => {
      this.setState(
        {
          filters: initialFilters
        },
        this.checkCallback(callback)
      );
    };

    checkCallback = callback => {
      if (callback) {
        callback();
      }
    };

    render() {
      return (
        <ControlledComponent
          {...this.props}
          filters={this.state.filters}
          setFilterValue={this.setFilterValue}
          clearFilters={this.clearFilters}
          filtersIsEmpty={this.filtersStateIsEmpty}
        />
      );
    }
  };
};

export default FiltersManager;
