import React from 'react';
import { mount, shallow } from 'enzyme';
import FiltersManager from '../../../src/components/FiltrersManager/FiltersManager';
import FilterTypes from '../../../src/components/FiltrersManager/filter-types';
import { expect } from 'chai';

describe('Filters settings validate', function() {
  const settings = {};
  it('Empty property object for initial filters should be incorrect', () => {
    const filtersSetting = {
      sprint: {
        type: FilterTypes.number,
        value: 567
      },
      tag: {
        type: FilterTypes.string,
        value: 'dfdfdf'
      },
      sprints: {
        type: FilterTypes.array,
        itemType: FilterTypes.string,
        value: ['fdfdf', 'sdsd']
      }
    };
    const ControlledComponent = props => <div>{...props}</div>;
    const WithFilters = FiltersManager(ControlledComponent, settings, filtersSetting);
    const wrapper = shallow(<WithFilters />);
    throw expect(wrapper).to.throw();
  });
});
