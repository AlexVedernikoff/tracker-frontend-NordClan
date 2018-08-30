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
      if (this.props.useSessionStorage || this.props.useLocalStorage) {
        this.state.filters = this.getFiltersFromStorage();
        if (this.props.mapFiltersToUrl) {
          this.setUrlQuery();
        }
      }
    } else if (this.props.mapFiltersFromUrl) {
      this.state.filters = {
        ...this.state.filters,
        ...this.props.mapFiltersFromUrl(this.getFiltersFromUrl())
      };
      if (this.props.useLocalStorage || this.props.useSessionStorage) {
        this.saveFiltersToStorage();
      }
      if (!this.props.mapFiltersToUrl) {
        this.props.location.query = {};
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.path === nextProps.location.path) {
    }
  }

  mapFiltersToUrl = () => {
    return this.state.filters.map(filter => this.props.mapFilterToUrl(filter));
  };

  mapFiltersFromUrl = filtersData => {
    return filtersData.map(filter => this.props.mapFilterFromUrl(filter));
  };

  initFilters = () => {
    let initFilters;
    this.props.filtersLabel.forEach(label => {
      initFilters[label] = {};
    });
  };

  urlQueryIsEmpty = () => {
    return Object.keys(this.props.location.query).length === 0 && obj.constructor === Object;
  };

  validateProps = () => {
    if (this.props.useSessionStorage && this.props.useLocalStorage) {
      throw new Error('');
    }
  };

  getFiltersFromStorage = () => {
    let filtersData;
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
      const LocalStorageFilters = localStorage.getItem(WrappedComponent.name + 'FiltersStorage');
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
    localStorage.setItem(this.props.location.path, JSON.stringify(this.state.filtersData));
  };

  saveFiltersToSessionStorage = () => {};

  getFiltersFromUrl = () => {
    let filtersData;
    this.props.filtersLabel.forEach(label => {
      if (this.props.location.query.hasOwnProperty(label)) {
        filtersData[label] = this.props.location.query[label];
      }
    });
  };

  updateFiltersCallback = () => {
    if (this.props.mapFiltersToUrl) {
      this.setUrlQuery();
    }
    if (this.props.useLocalStorage || this.props.useSessionStorage) {
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

  setFilterValue = (label, value, callback) => {
    if (this.state.filtersLabel.indexOf(label) !== -1) {
      this.setState(
        {
          ...this.state.filters,
          [label]: value
        },
        () => {
          this.updateFiltersCallback();
          callback();
        }
      );
    }
  };

  clearFilters = () => {
    this.setState({ filters: {} }, this.updateFiltersCallback);
  };

  render() {
    const WrappedChild = React.Children.only(this.props.children);
    return (
      <WrappedChild
        {...this.props}
        filters={this.state.filters}
        selectFilterValue={this.setFilterValue}
        clearFilters={this.clearFilters()}
      />
    );
  }
}

export default FiltersManager;
