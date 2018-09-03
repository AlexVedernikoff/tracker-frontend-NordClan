import React from 'react';
import { history } from '../../History';
import { filterTypeCheck } from './filter-types';
import settings from './settings';

const FiltersManager = (ControlledComponent, filtersDescribe) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.validateSettings(settings);
    }

    componentWillMount() {
      this.state = {
        filters: this.getInitFilterState(filtersDescribe)
      };
      console.log('filtersDescribe', filtersDescribe);
      if (this.urlQueryIsEmpty()) {
        console.log('UrlEmpty');
        if (this.useStorage()) {
          this.state.filters = {
            ...this.state.filters,
            ...this.getFiltersFromStorage()
          };
          if (settings.mapFilterToUrl) {
            this.setUrlQuery();
          }
        }
      } else if (settings.mapFilterFromUrl) {
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
        if (!settings.mapFiltersToUrl) {
          this.cleanUrlQuery();
        }
      }
    }

    getInitFilterState = filtersDesc => {
      console.log('log filter', filtersDesc);
      const filtersState = {};
      for (const key in filtersDesc) {
        console.log('key', key);
        if (filterTypeCheck(filtersDesc[key])) {
          filtersState[key] = filtersDesc[key];
          if (!filtersState[key].value === undefined) {
            filtersState[key].value = {
              ...filtersState[key],
              value: null
            };
          }
        } else if (process.env.NODE_ENV !== 'production') {
          throw new Error(`Types check failed for ${key} property`);
        }
      }
      return filtersState;
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
          settings.filtersLabel.indexOf(key) !== -1 &&
          (filters[key] || filters[key] === 0 || filters[key] === false)
        ) {
          isEmpty = false;
        }
      }
      return isEmpty;
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

    initState = () => {
      const initFilters = {};
      settings.filtersLabel.forEach(label => {
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
      if (settings.useSessionStorage) {
        console.log('localSTOORAGE', this.getFiltersFromSessionStorage());
        filtersData = this.compareWithState(this.getFiltersFromSessionStorage());
      }
      if (settings.useLocalStorage) {
        console.log('localSTOORAGE', this.getFiltersFromLocalStorage());
        filtersData = this.compareWithState(this.getFiltersFromLocalStorage());
        console.log('editing', filtersData);
      }
      return filtersData;
    };

    compareWithState = filtersData => {
      const result = {};
      console.log('filtersData', filtersData);
      for (const key in filtersData) {
        if (this.state.filters[key] && filtersData[key] && this.state.filters[key].type === filtersData[key].type) {
          if (this.state.filters[key].itemType) {
            if (this.state.filters[key].itemType === filtersData[key].itemType) {
              result[key] = filtersData[key];
            }
          } else {
            result[key] = filtersData[key];
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
      if (settings.useLocalStorage) {
        this.saveFiltersToLocalStorage();
      }
      if (settings.useSessionStorage) {
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
          filtersData[key] = settings.mapFilterFromUrl(key, this.props.location.query[key], this.state.filters[key]);
        }
      }
      console.log('filtersData', filtersData);
      return filtersData;
    };

    updateFiltersCallback = () => {
      if (settings.mapFilterToUrl) {
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
      if (this.state.filters.hasOwnProperty(label)) {
        this.setState(
          {
            filters: {
              ...this.state.filters,
              [label]: {
                ...this.state.filters[label],
                value: value
              }
            }
          },
          () => {
            this.updateFiltersCallback();
            if (callback) {
              callback();
            }
          }
        );
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
          setFilterValue={this.setFilterValue}
          clearFilters={this.clearFilters}
        />
      );
    }
  };
};

export default FiltersManager;
