import React, { Component } from 'react';
import { Row } from 'react-flexbox-grid';
import ReactTooltip from 'react-tooltip';

import * as css from './AgileBoardFilter.scss';
import FilterForm from './FilterForm';

import CollapsibleRow from '../../../components/CollapsibleRow';

type AgileBoardFilterProps = {
  getTasks: Function,
  clearFilters: Function,
  filters: {
    prioritiesId: number,
    authorId: number,
    typeId: Array<number>,
    name: string,
    performerId: number
  },
  initialFilters: object,
  lang: string,
  setFilterValue: Function,
  typeOptions: Array<object>,
  users: Array<object>
};

type AgileBoardFilterState = {
  isOpened: boolean
};

class AgileBoardFilter extends Component<AgileBoardFilterProps, AgileBoardFilterState> {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false
    };
  }

  componentDidUpdate = () => {
    ReactTooltip.rebuild();
  };

  toggleOpen = () => {
    this.setState(({ isOpened }) => ({ isOpened: !isOpened }));
  };

  updateFilterList = () => {
    const { getTasks } = this.props;

    getTasks();
  };

  render() {
    const { clearFilters, filters, initialFilters, lang, setFilterValue, typeOptions, users } = this.props;

    const { isOpened } = this.state;

    return (
      <CollapsibleRow isOpened={isOpened} toggleOpen={this.toggleOpen}>
        <FilterForm
          updateFilterList={this.updateFilterList}
          // shareButtonText={localize[lang].SHARE_FILTERS}
          lang={lang}
          filters={filters}
          setFilterValue={setFilterValue}
          clearFilters={clearFilters}
          typeOptions={typeOptions}
          users={users}
          initialFilters={initialFilters}
        />
        <Row className={css.filtersRow} />
      </CollapsibleRow>
    );
  }
}

export default AgileBoardFilter;
