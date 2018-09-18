import React from 'react';
import { history } from '../../History';
import * as config from './config';
import { mapFilterFromUrl } from './helpers';

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
      return this.filtersIsEmpty(this.state.filters);
    };

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
      const mappedFilters = {};
      const filtersKeys = Object.keys(this.state.filters);

      filtersKeys.forEach(filter => {
        if (!this.isEmpty(this.state.filters[filter])) {
          mappedFilters[filter] = config.mapFilterToUrl(filter, this.state.filters[filter]);
        }
      });

      return mappedFilters;
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
        if (this.state.filters[key]) {
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
          filtersIsEmpty={this.filtersStateIsEmpty}
        />
      );
    }
  };
};

export default FiltersManager;
