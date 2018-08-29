import FiltersManager from '../../../components/FiltrersManager/FiltersManager';

const filtersSettings = {
  filtersLabel: ['prioritiesId', 'isOnlyMine', 'authorId', 'performerId', 'changedSprint', 'authorId', 'performerId'],
  useSessionStorage: true
};

const withFiltersManager = AgileBoard => {
  return (
    <FiltersManager {...filtersSettings}>
      <AgileBoard />
    </FiltersManager>
  );
};
