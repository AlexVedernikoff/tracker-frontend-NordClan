import React from 'react';
/*import { mount, shallow } from 'enzyme';
import FiltersManager from '../../../src/components/FiltrersManager/FiltersManager';
import FilterTypes from '../../../src/components/FiltrersManager/filter-types';*/
import { expect } from 'chai';
import FiltersManager from '../../../src/components/FiltrersManager/FiltersManager';
import filterTypes from '../../../src/components/FiltrersManager/filter-types';

describe('Filters manager methods', function() {
  const FilterManagerClass = FiltersManager({});
  FilterManagerClass.prototype.state = {};
  const filterManager = new FilterManagerClass();

  it('setInitFilterState', () => {
    const filterDescribe = {
      label: {
        type: filterTypes.string,
        value: 'str'
      }
    };
    let filterState = filterManager.getInitFilterState(filterDescribe);
    let expectedState = {
      label: {
        type: filterTypes.string,
        value: 'str'
      }
    };
    expect(filterState).to.deep.equal(expectedState);

    expectedState = {
      label: {
        type: filterTypes.array,
        value: [1, 3, 5, 5],
        itemType: filterTypes.number
      }
    };

    filterState = filterManager.getInitFilterState(expectedState);
    console.log('FILTERS STATE ', filterState);
    expect(filterState).to.deep.equal(expectedState);

    expectedState = {
      label: {
        type: filterTypes.array,
        value: ['', '', '', ''],
        itemType: filterTypes.string
      }
    };

    filterState = filterManager.getInitFilterState(expectedState);
    expect(filterState).to.deep.equal(expectedState);
  });
});

describe('Filter manager query props', () => {
  const FilterManagerClass = FiltersManager({});
  FilterManagerClass.prototype.state = {};
  it('urlQueryIsEmpty', () => {
    let propsMock = {
      location: {
        pathname: '/projects/2',
        search: '?changedSprint=52',
        query: {
          changedSprint: '52'
        }
      }
    };
    const filterManager = new FilterManagerClass();
    filterManager.props = propsMock;
    expect(filterManager.urlQueryIsEmpty()).to.equal(false);
    filterManager.props.location.query = {};
    expect(filterManager.urlQueryIsEmpty()).to.equal(true);
  });
});

describe('Filters manager localStorage & sessionStorage test', () => {
  it('save filters to local storage', () => {
    const filtersDescribe = {
      changedSprint: {
        type: filterTypes.number,
        value: 46
      }
    };
    const FilterManagerClass = FiltersManager(null, filtersDescribe);
    let propsMock = {
      location: {
        pathname: '/projects/2',
        search: '?changedSprint=52',
        query: {
          changedSprint: '52'
        }
      }
    };

    const data = {};
    data.filters = {
      changedSprint: {
        value: 52,
        type: filterTypes.number
      }
    };
    console.log('NEWWW', data);

    FilterManagerClass.prototype.state = {};
    const filterManager = new FilterManagerClass();
    console.log(filterManager.state);
    filterManager.props = propsMock;
    filterManager.saveFiltersToLocalStorage();
    console.log('TEST', localStorage.getItem('/projects/2'));
    //localStorage.setItem("/projects/2", {...localStorage.getItem("/projects/2"), task: 'fsfsf'});
    console.log('NEWWW', data);
    expect(filterManager.getFiltersFromStorage()).to.deep.equal(data.filters);
    console.log('filter', filterManager.getFiltersFromStorage());
  });
});
