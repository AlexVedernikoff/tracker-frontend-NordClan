import React from 'react';
import { history } from '../../History';
import { filterTypeCheck } from './filter-types';

const FiltersManager = (ControlledComponent, settings, filtersDescribe) => {
  return class extends React.Component {
    configureManager() {
      console.error('settings', settings);
      console.error('props', this.props);
      this.settings = {};
      this.setInitFilterState(filtersDescribe);
      this.validateSettings(settings);
      this.settings.useSessionStorage = settings.useSessionStorage ? settings.useSessionStorage : null;
      this.settings.useLocalStorage = settings.useLocalStorage ? settings.useLocalStorage : null;
      this.settings.mapFilterToUrl = settings.mapFilterToUrl ? settings.mapFilterToUrl : null;
      this.settings.mapFilterFromUrl = settings.mapFilterFromUrl ? settings.mapFilterFromUrl : null;
    }

    constructor(props) {
      super(props);
      this.configureManager();
    }

    componentWillMount() {
      if (this.urlQueryIsEmpty()) {
        console.log('UrlEmpty');
        if (this.useStorage()) {
          this.state.filters = {
            ...this.state.filters,
            ...this.getFiltersFromStorage()
          };
          if (this.settings.mapFilterToUrl) {
            this.setUrlQuery();
          }
        }
      } else if (this.settings.mapFilterFromUrl) {
        console.log('UrlEmpty not empty');
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
        } else if (this.useStorage) {
          this.state.filters = this.getFiltersFromStorage();
        }
        if (!this.settings.mapFiltersToUrl) {
          this.cleanUrlQuery();
        }
      }
    }

    setInitFilterState = filters => {
      const filtersState = {};
      for (const key in filters) {
        if (filterTypeCheck(filters[key])) {
          filtersState[key] = filters[key];
        } else if (process.env.NODE_ENV !== 'production') {
          throw new Error(`Types check failed for ${key} property`);
        }
      }
      this.state.filters = filtersState;
    };

    validateSettings = sett => {
      if (sett.useSessionStorage && sett.useLocalStorage) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error('useSessionStorage and useLocalStorage can not be both true');
        }
      }
    };

    filtersIsEmpty = filters => {
      console.log('filterIsEmpty', filters);
      let isEmpty = true;
      for (const key in filters) {
        if (
          this.settings.filtersLabel.indexOf(key) !== -1 &&
          (filters[key] || filters[key] === 0 || filters[key] === false)
        ) {
          isEmpty = false;
        }
      }
      return isEmpty;
    };

    useStorage = () => {
      return this.settings.useSessionStorage || this.settings.useLocalStorage;
    };

    mapFiltersToUrl = () => {
      const mappedFilters = {};
      for (const filter in this.state.filters) {
        if (this.state.filters.hasOwnProperty(filter)) {
          if (!this.isEmpty(this.state.filters[filter])) {
            mappedFilters[filter] = this.settings.mapFilterToUrl(filter, this.state.filters[filter]);
          }
        }
      }
      return mappedFilters;
    };

    getUrlWithFilters = () => {
      return this.state.filters;
    };

    initState = () => {
      const initFilters = {};
      this.settings.filtersLabel.forEach(label => {
        initFilters[label] = null;
      });
      return {
        filters: initFilters
      };
    };

    urlQueryIsEmpty = () => {
      console.log('query', this.props.location.query);
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
      if (this.settings.useSessionStorage) {
        filtersData = this.compareWithState(this.getFiltersFromSessionStorage());
      }
      if (this.settings.useLocalStorage) {
        filtersData = this.compareWithState(this.getFiltersFromLocalStorage());
      }
      return filtersData;
    };

    compareWithState = filtersData => {
      const result = {};
      for (const key in filtersData) {
        if (
          this.state.filters[key] &&
          this.state.filters[key].value === filtersData.value &&
          this.state.filters[key].type === filtersData[key].type
        ) {
          if (this.state.filters[key].itemType) {
            if (this.state.filters[key].itemType === filtersData[key].itemType) {
              result[key] = filtersData[key];
            } else {
              result[key] = filtersData[key];
            }
          }
        }
      }
      return result;
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
      if (this.settings.useLocalStorage) {
        this.saveFiltersToLocalStorage();
      }
      if (this.settings.useSessionStorage) {
        this.saveFiltersToSessionStorage();
      }
    };

    saveFiltersToLocalStorage = () => {
      console.log('saveFiltersToLocalStorage');
      localStorage.setItem(this.props.location.pathname, JSON.stringify(this.state.filters));
    };

    saveFiltersToSessionStorage = () => {};

    getFiltersFromUrl = () => {
      console.log('getFiltersFromUrl');
      const filtersData = {};
      for (const key in this.props.location.query) {
        if (this.state.filters[key]) {
          filtersData[key] = this.settings.mapFilterFromUrl(
            key,
            this.props.location.query[key],
            this.state.filters[key]
          );
        }
      }
      console.log('filtersData', filtersData);
      return filtersData;
    };

    updateFiltersCallback = () => {
      if (this.settings.mapFilterToUrl) {
        this.setUrlQuery();
      }
      if (this.useStorage()) {
        this.saveFiltersToStorage();
      }
    };

    setUrlQuery = () => {
      const query = this.mapFiltersToUrl(this.state.filters);
      history.replace({
        ...this.props.location,
        query
      });
    };

    cleanUrlQuery = () => {
      history.replace({
        ...this.props.location,
        query: {}
      });
    };

    setFilterValue = (label, value, callback) => {
      if (this.state.filtersLabel.indexOf(label) !== -1) {
        this.setState({ [label]: value }, () => {
          this.updateFiltersCallback();
          callback();
        });
      }
    };

    clearFilters = () => {
      this.setState({ filters: {} }, this.updateFiltersCallback);
    };

    render() {
      return (
        <ControlledComponent
          {...this.props}
          filters={this.state.filters}
          selectFilterValue={this.setFilterValue}
          clearFilters={this.clearFilters}
        />
      );
    }
  };
};

export default FiltersManager;
