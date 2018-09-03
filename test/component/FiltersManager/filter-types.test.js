import filterTypes, { filterTypeCheck, typeCheck } from '../../../src/components/FiltrersManager/filter-types';
import { expect } from 'chai';

describe('type check', function() {
  it('filter without type should be false', () => {
    const filter = { value: 'str' };
    expect(filterTypeCheck(filter)).to.equal(false);
  });

  it('filter with incorrect type should be false', () => {
    const filter = { type: 'unknown' };
    expect(filterTypeCheck(filter)).to.equal(false);
  });

  it('array filters without itemType should be false', () => {
    const arrayFilter = {
      type: filterTypes.array
    };
    expect(filterTypeCheck(arrayFilter)).to.equal(false);
  });

  it('array filters with incorrect itemType should be false', () => {
    const arrayFilter = {
      type: filterTypes.array,
      itemType: 'unknown'
    };
    expect(filterTypeCheck(arrayFilter)).to.equal(false);
  });

  it('filter with incorrect value type should be false', () => {
    const filter = {
      type: filterTypes.string,
      value: 3
    };
    expect(filterTypeCheck(filter)).to.equal(false);
  });

  it('array filters with incorrect value should be false', () => {
    const arrayFilter = {
      type: filterTypes.array,
      value: 'unknown',
      itemType: filterTypes.string
    };
    expect(filterTypeCheck(arrayFilter)).to.equal(false);
  });

  it('array filters with incorrect item value should be false', () => {
    const arrayFilter = {
      type: filterTypes.array,
      value: ['1', '2', '3', 8],
      itemType: filterTypes.string
    };
    expect(filterTypeCheck(arrayFilter)).to.equal(false);
    arrayFilter.value = [undefined, undefined];
    expect(filterTypeCheck(arrayFilter)).to.equal(false);
    arrayFilter.value = [undefined, [undefined, undefined, [null, null]]];
    expect(filterTypeCheck(arrayFilter)).to.equal(false);
    arrayFilter.value = ['sdsd', null];
    expect(filterTypeCheck(arrayFilter)).to.equal(false);
    expect(filterTypeCheck(undefined)).to.equal(false);
  });

  it('correct filter should be true', () => {
    const filter = {
      type: filterTypes.number,
      value: 45
    };
    expect(filterTypeCheck(filter)).to.equal(true);
    filter.value = 0;
    expect(filterTypeCheck(filter)).to.equal(true);
    filter.type = filterTypes.string;
    filter.value = '';
    expect(filterTypeCheck(filter)).to.equal(true);
    filter.value = false;
    filter.type = filterTypes.boolean;
    expect(filterTypeCheck(filter)).to.equal(true);
  });

  it('correct array filters should be true', () => {
    const arrayFilter = {
      type: filterTypes.array,
      value: [],
      itemType: filterTypes.string
    };
    expect(filterTypeCheck(arrayFilter)).to.equal(true);
    arrayFilter.value = ['', '', '2'];
    expect(filterTypeCheck(arrayFilter)).to.equal(true);
    arrayFilter.value = [false, false];
    arrayFilter.itemType = filterTypes.boolean;
    expect(filterTypeCheck(arrayFilter)).to.equal(true);
  });
});
