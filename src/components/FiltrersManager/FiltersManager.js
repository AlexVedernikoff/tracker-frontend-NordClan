import React from 'react';
import PropTypes from 'prop-types';
import { history } from '../../History';

class FiltersManager extends React.Component {
  static PropTypes = {
    filtersLabel: PropTypes.array,
    useSessionStorage: PropTypes.bool,
    useLocalStorage: PropTypes.bool,
    mapFilterToUrl: PropTypes.func,
    mapFilterFromUrl: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state.filters = this.initFilters();
  }

  componentWillMount() {
    this.validateProps();
    if (this.urlQueryIsEmpty()) {
      if (this.useStorage()) {
        this.state.filters = this.getFiltersFromStorage();
        if (this.props.mapFiltersToUrl) {
          this.setUrlQuery();
        }
      }
    } else if (this.props.mapFilterFromUrl) {
      this.state.filters = {
        ...this.state.filters,
        ...this.props.this.getFiltersFromUrl()
      };
      if (this.useStorage()) {
        this.saveFiltersToStorage();
      }
      if (!this.props.mapFiltersToUrl) {
        this.props.location.query = {};
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.path === nextProps.location.path) {
      this.clearFilters();
      if (this.urlQueryIsEmpty()) {
        if (this.useStorage) {
          const filters = this.getFiltersFromStorage();
          this.setState(filters, () => {
            if (this.props.mapFilterToUrl) {
              this.setUrlQuery();
            }
          });
        }
      } else {
        if (this.props.mapFilterFromUrl) {
          this.setState(this.getFiltersFromUrl(), () => {
            if (this.useStorage) {
              this.saveFiltersToStorage();
            }
            if (!this.mapFiltersToUrl) {
              this.cleanUrlQuery();
            }
          });
        } else {
          if (this.useStorage) {
            this.setState(this.getFiltersFromStorage(), () => {
              if (this.props.mapFilterToUrl) {
                this.setUrlQuery();
              }
            });
          }
        }
      }
    }
  }

  useStorage = () => {
    return this.props.useSessionStorage || this.props.useLocalStorage;
  };

  mapFiltersToUrl = () => {
    let mappedFilters = {};
    for (const filter in this.state.filters) {
      if (this.state.filters.hasOwnProperty(filter)) {
        if (!this.isEmpty(this.state.filters[filter])) {
          mappedFilters[filter] = this.props.mapFilterToUrl(filter, this.state.filters[filter]);
        }
      }
    }
    return mappedFilters;
  };

  /* mapFiltersFromUrl = filtersData => {
    return filtersData.map(filter => this.props.mapFilterFromUrl(filter));
  };*/

  getUrlWithFilters = () => {
    return this.state.filters;
  };

  initFilters = () => {
    let initFilters;
    this.props.filtersLabel.forEach(label => {
      initFilters[label] = {};
    });
  };

  urlQueryIsEmpty = () => {
    return this.isEmpty(this.props.location.query);
  };

  isEmpty = obj => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  validateProps = () => {
    if (this.props.useSessionStorage && this.props.useLocalStorage) {
      throw new Error('');
    }
  };

  getFiltersFromStorage = () => {
    let filtersData = {};
    if (this.props.useSessionStorage) {
      filtersData = this.getFiltersFromSessionStorage();
    }
    if (this.props.useLocalStorage) {
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
    if (this.props.useLocalStorage) {
      this.saveFiltersToLocalStorage();
    }
    if (this.props.useSessionStorage) {
      this.saveFiltersToSessionStorage();
    }
  };

  saveFiltersToLocalStorage = () => {
    localStorage.setItem(this.props.location.pathname, JSON.stringify(this.state.filters));
  };

  saveFiltersToSessionStorage = () => {};

  getFiltersFromUrl = () => {
    let filtersData;
    this.props.filtersLabel.forEach(label => {
      if (this.props.location.query.hasOwnProperty(label)) {
        filtersData[label] = this.props.mapFilterFromUrl(label, this.props.location.query[label]);
      }
    });
  };

  updateFiltersCallback = () => {
    if (this.props.mapFilterToUrl) {
      this.setUrlQuery();
    }
    if (this.useStorage()) {
      this.saveFiltersToStorage();
    }
  };

  setUrlQuery = () => {
    const query = this.props.mapFiltersToUrl(this.state.filters);
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
    const ControlledComponent = React.Children.only(this.props.children);
    return (
      <ControlledComponent
        {...this.props}
        filters={this.state.filters}
        selectFilterValue={this.setFilterValue}
        clearFilters={this.clearFilters}
      />
    );
  }
}

export default FiltersManager;
