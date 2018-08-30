import FiltersManager from '../../../components/FiltrersManager/FiltersManager';
import React from 'react';

const filtersSettings = {
  filtersLabel: [
    'prioritiesId',
    'isOnlyMine',
    'authorId',
    'performerId',
    'changedSprint',
    'authorId',
    'performerId',
    'typeId'
  ],
  useLocalStorage: true
};

const withFiltersManager = AgileBoard => {
  return (
    <FiltersManager {...filtersSettings}>
      <AgileBoard />
    </FiltersManager>
  );
};

export default withFiltersManager;
