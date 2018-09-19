import React from 'react';
import { history } from '../../History';
import * as config from './config';
import { mapFilterFromUrl, mapFilterToUrl } from './helpers';

const FiltersManager = (ControlledComponent, initialFilters = {}, getDataForFilterFromUrl = value => value) => {
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

    get storageType() {
      if (config.useSessionStorage) {
        return 'session';
      }

      if (config.useLocalStorage) {
        return 'local';
      }

      return false;
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

    isEmpty = obj => {
      return !Object.keys(obj).length;
    };

    getFiltersFromStorage = () => {
      let filtersData = {};
      if (this.storageType) {
        filtersData = this.compareWithInitFilters(this._getFiltersFromStorage(this.storageType));
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
      const storage = this.storageType === 'local' ? localStorage : sessionStorage;
      try {
        const filters = storage.getItem('filtersData');
        return filters ? JSON.parse(filters) : {};
      } catch (e) {
        return {};
      }
    }

    saveFiltersToStorage() {
      const storage = this.storageType === 'local' ? localStorage : sessionStorage;
      storage.setItem('filtersData', JSON.stringify(this.state.filters));
    }

    getFiltersFromUrl = () => {
      const filtersData = {};
      for (const key in this.props.location.query) {
        const isArray = key.indexOf('[') !== -1;
        const filterName = isArray ? key.replace(/\[\]/g, '') : key;
        if (this.state.filters.hasOwnProperty(filterName)) {
          let value = mapFilterFromUrl(filterName, this.props.location.query[key]);
          value = getDataForFilterFromUrl(value, filterName, this.props);
          filtersData[filterName] = isArray ? [value] : value;
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

    clearFilters = callback => {
      this.setState(
        {
          filters: initialFilters
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
