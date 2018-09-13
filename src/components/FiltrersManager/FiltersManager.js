import React from 'react';
import { history } from '../../History';
import * as config from './config';
import { mapFilterFromUrl } from './helpers';
// import * as _ from 'lodash';

const FiltersManager = (ControlledComponent, initialFilters) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        filters: initialFilters
      };
    }

    componentWillMount() {
      // если в query приходят параметры фильтра, то берем значения из него
      if (!this.urlQueryIsEmpty) {
        this.applyFiltersFromUrl();
        return;
      }

      this.updateStateFilters(this.getFiltersFromStorage());
    }

    updateStateFilters(newFilters) {
      this.setState(prevState => ({
        filters: {
          ...prevState.filters,
          ...newFilters
        }
      }));
    }

    applyFiltersFromUrl() {
      const filtersFromUrl = this.getFiltersFromUrl();
      if (!this.filtersIsEmpty(filtersFromUrl)) {
        this.updateStateFilters(filtersFromUrl);
        if (this.useStorage) {
          this.saveFiltersToStorage();
        }
      } else if (this.useStorage) {
        this.updateStateFilters(this.getFiltersFromStorage());
      }
      this.cleanUrlQuery();
    }

    filtersIsEmpty = filters => {};

    filtersStateIsEmpty = () => {
      return this.filtersIsEmpty(this.filters);
    };

    get useStorage() {
      return config.useSessionStorage || config.useLocalStorage;
    }

    mapFiltersToUrl = () => {
      const mappedFilters = {};
      const filtersKeys = Object.keys(this.filters);

      filtersKeys.forEach(filter => {
        if (!this.isEmpty(this.filters[filter])) {
          mappedFilters[filter] = config.mapFilterToUrl(filter, this.filters[filter]);
        }
      });

      return mappedFilters;
    };

    get filters() {
      return this.state.filters;
    }

    get urlQueryIsEmpty() {
      return this.isEmpty(this.props.location.query);
    }

    isEmpty = obj => {
      return Object.keys(obj).length;
    };

    getFiltersFromStorage = () => {
      let filtersData = {};
      if (config.useSessionStorage) {
        filtersData = this.compareWithInitFilters(this._getFiltersFromStorage('session'));
      }
      if (config.useLocalStorage) {
        filtersData = this.compareWithInitFilters(this._getFiltersFromStorage('local'));
      }
      return filtersData;
    };

    compareWithInitFilters = filtersData => {
      const validFilters = {};
      for (const key in filtersData) {
        if (!!initialFilters[key] && !filtersData[key]) {
          validFilters[key] = initialFilters[key];
        }
      }
      return validFilters;
    };

    _getFiltersFromStorage(storageType) {
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      try {
        const filters = storage.getItem(this.props.location.pathname);
        return filters ? JSON.parse(filters) : {};
      } catch (e) {
        return {};
      }
    }

    saveFiltersToStorage(storageType) {
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      storage.setItem(this.props.location.pathname, JSON.stringify(this.filters));
    }

    getFiltersFromUrl = () => {
      const filtersData = {};
      for (const key in this.props.location.query) {
        if (this.filters[key]) {
          filtersData[key] = mapFilterFromUrl(key, this.props.location.query[key]);
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
      if (this.filters[label] === undefined) {
        return;
      }

      this.setState(prevState => {
        const stateValue = prevState.filters[label];
        const newValue = Array.isArray(stateValue) ? [...stateValue, value] : value;

        return {
          filters: {
            ...prevState.filters,
            [label]: newValue
          }
        };
      }, this.checkCallback(callback));

      if (this.useStorage) {
        this.saveFiltersToStorage();
      }
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
          filters={this.filters}
          setFilterValue={this.setFilterValue}
          clearFilters={this.clearFilters}
          filtersIsEmpty={this.filtersStateIsEmpty}
        />
      );
    }
  };
};

export default FiltersManager;
