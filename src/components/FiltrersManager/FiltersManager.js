import React from 'react';
import { history } from '../../History';
import FilterTypes from './filter-types';

const FiltersManager = (ControlledComponent, settings, filtersSetting) =>
  class FiltersManager extends React.Component {
    configureManager() {
      console.error('settings', settings);
      console.error('props', this.props);
      this.settings = {};
      this.validateSettings(settings);
      this.validateFiltersSetting(filtersSetting);
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

    validateFiltersSetting = filtersSettings => {
      for (const filterKey in filtersSettings) {
        if (filtersSettings[filterKey].type) {
          if (filtersSettings[filterKey].value) {
            switch (filtersSettings[filterKey].type) {
              case FilterTypes.number:
                if (!(typeof filtersSettings[filterKey] === 'number')) {
                  throw new Error(`For filters property ${filterKey} must be number`);
                }
                break;
              case FilterTypes.array:
                if (!Array.isArray(filtersSettings[filterKey])) {
                  throw new Error(`For filters property ${filterKey} must be array`);
                } else {
                  if (filtersSettings[filterKey].itemType) {
                    if (isArray(filtersSettings[filterKey].value)) {
                      filtersSettings[filterKey].value.forEach(el => {
                        if (typeof el !== filtersSettings[filterKey].type) {
                          throw new Error(`filters property ${filtersSettings[filterKey]}: incorrect item types `);
                        }
                      });
                    } else {
                      throw new Error(`filter value for ${filterKey} must be array`);
                    }
                  } else {
                    throw new Error(`filter type for ${filterKey} filter property is required`);
                  }
                }
                break;
              case FilterTypes.boolean:
                if (!(typeof filtersSettings[filterKey] === 'boolean')) {
                  throw new Error(`For filters property ${filterKey} must be boolean`);
                }
              case FilterTypes.string:
                if (!(typeof filtersSettings[filterKey] === 'string')) {
                  throw new Error(`For filters property ${filterKey} must be boolean`);
                }
            }
          }
        } else {
          throw new Error('type for filter is required');
        }
      }
    };

    validateSettings = settings => {};

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
      let mappedFilters = {};
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
      let initFilters = {};
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
        filtersData = this.getFiltersFromSessionStorage();
      }
      if (this.settings.useLocalStorage) {
        filtersData = this.getFiltersFromLocalStorage();
      }
      return filtersData;
    };

    getFiltersFromLocalStorage = () => {
      try {
        const LocalStorageFilters = localStorage.getItem(this.props.location.pathname);
        return LocalStorageFilters ? JSON.parse(LocalStorageFilters) : {};
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
      let filtersData = {};
      for (const key in this.props.location.query) {
        if (this.settings.filtersLabel.indexOf(key) !== -1) {
          console.log('ietrateKey');
          filtersData[key] = this.settings.mapFilterFromUrl(key, this.props.location.query[key]);
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

export default FiltersManager;
