import React from 'react';
import { history } from '../../History';
import * as config from './config';
import { mapFilterFromUrl, mapFilterToUrl, storageType } from './helpers';

const FiltersManager = (ControlledComponent, initialFilters = {}) => {
  return class extends React.Component {
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

    checkFilterItemEmpty = filterName => {
      const filter = this.state.filters[filterName];
      if (typeof filter === 'string' || filter instanceof String || Array.isArray(filter)) {
        return !filter.length;
      }
      return filter === null || filter === false;
    };

    isFilterEmpty = () => Object.keys(this.state.filters).every(key => this.checkFilterItemEmpty(key));

    get filtersStateIsEmpty() {
      return this.isFilterEmpty(this.state.filters);
    }

    get useStorage() {
      return config.useSessionStorage || config.useLocalStorage;
    }

    mapFiltersToUrl = () => {
      let query = `${window.location}?`;
      const filtersKeys = Object.keys(this.state.filters);

      filtersKeys.forEach(key => {
        if (!this.checkFilterItemEmpty(key)) {
          query += `${mapFilterToUrl(this.state.filters[key], key)}&`;
        }
      });

      return query.slice(0, query.length - 1);
    };

    get urlQueryIsEmpty() {
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
        filtersData = this.compareWithInitFilters(this._getFiltersFromStorage(storageType));
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
      for (const key in this.props.location.query) {
        const isArray = key.indexOf('[') !== -1;
        const filterName = isArray ? key.replace(/\[\]/g, '') : key;
        if (this.state.filters.hasOwnProperty(filterName)) {
          filtersData[filterName] = mapFilterFromUrl(filterName, this.props.location.query[key], isArray);
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
          checkFilterItemEmpty={this.checkFilterItemEmpty}
          isFilterEmpty={this.filtersStateIsEmpty}
          mapFiltersToUrl={this.mapFiltersToUrl}
        />
      );
    }
  };
};

export default FiltersManager;
