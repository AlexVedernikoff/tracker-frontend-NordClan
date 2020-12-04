import React from 'react';

import isString from 'lodash/fp/isString';
import isPlainObject from 'lodash/fp/isPlainObject';
import isEqual from 'lodash/fp/isEqual';
const ru = require('convert-layout/ru');

import * as config from './config';
import { mapFilterFromUrl, mapFilterToUrl, storageType } from './helpers';

import { history } from '../../History';

const FiltersManager = (ControlledComponent, initialFilters = {}) => {
  interface Props {
    location?: { query: {} }
  }

  interface State {
    filters: {}
  }

  return class extends React.Component<Props, State> {
    constructor(props) {
      super(props);
      this.state = {
        filters: initialFilters
      };
    }

    componentDidMount() {
      // если в query приходят параметры фильтра, то берем значения из него
      if (!this.urlQueryIsEmpty) {
        this.applyFiltersFromUrl();
        return;
      }

      this.updateStateFilters(this.getFiltersFromStorage());
    }

    updateStateFilters(newFilters, cb = () => {}) {
      this.setState(
        prevState => ({
          filters: {
            ...prevState.filters,
            ...newFilters
          }
        }),
        cb
      );
    }

    applyFiltersFromUrl() {
      const filtersFromUrl = this.getFiltersFromUrl();
      this.updateStateFilters(filtersFromUrl, () => {
        if (this.useStorage) {
          this.saveFiltersToStorage();
        }
      });
      this.cleanUrlQuery();
    }

    checkFilterItemEmpty = (filterName: string) => {
      const filter = this.state.filters[filterName];
      if (typeof filter === 'string' || filter instanceof String || Array.isArray(filter)) {
        return !filter.length;
      }
      return filter === null || filter === false || filter === initialFilters[filterName];
    };

    isFilterEmpty = (): boolean => Object.keys(this.state.filters).every(key => this.checkFilterItemEmpty(key));

    get filtersStateIsEmpty(): boolean {
      return this.isFilterEmpty();
    }

    get useStorage(): boolean {
      return config.useSessionStorage || config.useLocalStorage;
    }

    mapFiltersToUrl = (): string => {
      return `${window.location}?${this.mapFiltersToQuery()}`;
    };

    mapFiltersToQuery = (): string => {
      let query = '?';
      const filtersKeys = Object.keys(this.state.filters);

      filtersKeys.forEach(key => {
        if (!this.checkFilterItemEmpty(key)) {
          query += `${mapFilterToUrl(this.state.filters[key], key)}&`;
        }
      });

      return query.slice(0, query.length - 1);
    };

    get urlQueryIsEmpty(): boolean {
      if (!this.props.location) {
        return true;
      }
      return this.isEmpty(this.props.location.query);
    }

    get storage() {
      return storageType === 'local' ? localStorage : sessionStorage;
    }

    isEmpty = obj => {
      return !Object.keys(obj).length;
    };

    getFiltersFromStorage = () => {
      let filtersData = {};
      if (storageType) {
        filtersData = this.compareWithInitFilters(this._getFiltersFromStorage());
      }
      return filtersData;
    };

    compareWithInitFilters = filtersData => {
      const validFilters = { ...filtersData };
      for (const key in filtersData) {
        if (!!initialFilters[key] && !filtersData[key]) {
          validFilters[key] = initialFilters[key];
        }
      }
      return validFilters;
    };

    _getFiltersFromStorage() {
      try {
        const filters = this.storage.getItem('filtersData');
        return filters ? JSON.parse(filters) : {};
      } catch (e) {
        return {};
      }
    }

    saveFiltersToStorage() {
      this.storage.setItem('filtersData', JSON.stringify(this.state.filters));
    }

    getFiltersFromUrl = () => {
      const filtersData = {};
      for (const key in this.props.location?.query) {
        const isArray = key.indexOf('[') !== -1;
        const filterName = isArray ? key.replace(/\[\]/g, '') : key;
        if (this.state.filters.hasOwnProperty(filterName)) {
          filtersData[filterName] = mapFilterFromUrl(filterName, this.props.location?.query[key], isArray);
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

    updateFilterCb = cb => {
      this.saveFiltersToStorage();
      this.checkCallback(cb);
    };

    setFilterValue = (label, value, callback) => {
      if (!Object.keys(this.state.filters).includes(label)) {
        return;
      }

      this.setState(prevState => {
        return {
          filters: {
            ...prevState.filters,
            [label]: value
          }
        };
      }, this.updateFilterCb.bind(this, callback));
    };

    getFilteredData = (data = []) => {
      const { filters } = this.state;

      if (isEqual(filters, initialFilters)) {
        return data;
      }

      const layoutAgnosticCompare = (filter, value) => {
        const filterValue = filter.toLowerCase().trim();
        const testValue = value.toLowerCase().trim();
        return (
          testValue.includes(filterValue) ||
          testValue.includes(ru.toEn(filterValue)) ||
          testValue.includes(ru.fromEn(filterValue))
        );
      }

      const isMatchFilter = (filter, initFilter, value) => {
        return (
          filter === initFilter ||
          filter === value ||
          ([filter, value].every(isString) && layoutAgnosticCompare(filter, value))
        );
      };

      const getValue = option => (isPlainObject(option) ? option.value : option);

      return data.filter(item => {
        for (const key in initialFilters) {
          if (!isMatchFilter(getValue(filters[key]), initialFilters[key], item[key])) {
            return false;
          }
        }

        return true;
      });
    };

    clearFilters = (customFields, callback) => {
      this.setState(
        {
          filters: {
            ...initialFilters,
            ...customFields
          }
        },
        this.updateFilterCb.bind(this, callback)
      );
    };

    checkCallback = (callback: () => void) => {
      if (callback) {
        callback();
      }
    };

    render() {
      return (
        <ControlledComponent
          {...this.props}
          initialFilters={initialFilters}
          getFilteredData={this.getFilteredData}
          filters={this.state.filters}
          setFilterValue={this.setFilterValue}
          clearFilters={this.clearFilters}
          checkFilterItemEmpty={this.checkFilterItemEmpty}
          isFilterEmpty={this.filtersStateIsEmpty}
          mapFiltersToUrl={this.mapFiltersToUrl}
          mapFiltersToQuery={this.mapFiltersToQuery}
        />
      );
    }
  };
};

export default FiltersManager;
