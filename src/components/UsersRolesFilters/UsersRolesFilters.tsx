import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Moment } from 'moment';
import connect from 'react-redux/es/connect/connect';

import { getDepartments } from '~/actions/Dictionaries';
import DatepickerDropdown from '~/components/DatepickerDropdown/DatepickerDropdown';
import Input from '~/components/Input';
import { Option } from '~/components/OptionsModal/OptionsModal';
import SelectDropdown from '~/components/SelectDropdown/SelectDropdown';
import { CompanyDepartment } from '~/pages/types';

import * as css from './UsersRolesFilters.scss';
import localize from './UsersRolesFilters.json';

interface UsersRolesFiltersProps {
  departments: CompanyDepartment[];
  fetchUsers: (filters: Record<string, unknown>) => void;
  getDepartments: (filters: Record<string, unknown>) => void;
  lang: string;
  location: Location;
}

interface Filters {
  status: boolean;
  first_name?: string;
  last_name?: string;
  employment_date_from?: string;
  employment_date_to?: string;
  birth_date_from?: string;
  birth_date_to?: string;
  phone?: string;
  telegram?: string;
  city?: string;
  departments?: number[];
}

const debounceTime = 500;

const UsersRolesFilters: FC<UsersRolesFiltersProps> = (props) => {
  const { lang, fetchUsers, location, getDepartments, departments } = props;

  const [filters, setFilters] = useState<Filters>({status: getStatusFilter()});

  const debouncedFetchUsers = useMemo(() => debounce(fetchUsers, debounceTime), []);

  const departmentsOptions = useMemo(() => departments
    ? departments.map(dep => ({
    label: dep.name,
    value: dep.id
    }))
    : [], [departments]);

  function onInputChange (e: ChangeEvent<HTMLInputElement>) {
    e.persist();
    const { name, value } = e.target;
    if (!value) {
      return clearFilter(name as keyof Filters);
    }
    setFilters(prev => ({...prev, [name]: value }));
  }

  function onDateChange (field: string) {
    return function (date: Moment) {
      setFilters(prev => {

        if (!date) {
          delete prev[field]
          return {...prev}
        }

        return {
          ...prev,
          [field]: date.toISOString()
        }
      })
    };
  }

  function onDepartmentChange(deps: Option[]) {
    setFilters(prev => ({
      ...prev,
      departments: deps.map(dep => dep.value) as number[]
    }));
  }

  useEffect(() => {
    debouncedFetchUsers(filters);
  }, [filters]);

  useEffect(() => {
    getDepartments({});
  }, []);

  function getStatusFilter () {
    return location.pathname === '/roles';
  }

  function clearFilter(field: keyof Filters) {
    setFilters(prev => {
      delete prev[field];
      return { ...prev }
    })
  }

  useEffect(() => {
    setFilters(prev => ({...prev, status: getStatusFilter()}))
  }, [location])

  return (
    <div className={css.container}>
      <div className={css.filter__group}>
        <Input name='first_name' onChange={onInputChange} placeholder={localize[lang].FIRST_NAME} />
        <Input name='last_name' onChange={onInputChange} placeholder={localize[lang].LAST_NAME} />
      </div>
      <div className={css.filter__group}>
        <div className={css.filter__group__dates}>
          <DatepickerDropdown
            onDayChange={onDateChange('employment_date_from')}
            placeholder={localize[lang].EMPLOYMENT_DATE_FROM}
          />
          <DatepickerDropdown
            onDayChange={onDateChange('employment_date_to')}
            placeholder={localize[lang].EMPLOYMENT_DATE_TO}
          />
        </div>
        <div className={css.filter__group__dates}>
          <DatepickerDropdown
            onDayChange={onDateChange('birth_date_from')}
            placeholder={localize[lang].BIRTH_DATE_FROM}
          />
          <DatepickerDropdown
            onDayChange={onDateChange('birth_date_to')}
            placeholder={localize[lang].BIRTH_DATE_TO}
          />
        </div>
      </div>
      <div className={css.filter__group}>
        <Input
          name='phone'
          onChange={onInputChange}
          placeholder={localize[lang].PHONE}
          value={filters.phone}
        />
        <Input
          name='telegram'
          onChange={onInputChange}
          placeholder={localize[lang].TELEGRAM}
          value={filters.telegram}
        />
      </div>
      <div className={css.filter__group}>
        <Input name='city' onChange={onInputChange} placeholder={localize[lang].CITY} />
        <SelectDropdown
          canClear
          multi
          name='departments'
          onChange={onDepartmentChange}
          options={departmentsOptions}
          placeholder={localize[lang].DEPARTMENTS}
          value={filters.departments}
        />
      </div>
    </div>
  );
};

UsersRolesFilters.propTypes = {
  departments: PropTypes.array.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  getDepartments: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  departments: PropTypes.array.isRequired
};

const mapDispatchToProps = {
  getDepartments
};

const mapStateToProps = (state) => ({
  departments: state.Dictionaries.departments
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersRolesFilters);
