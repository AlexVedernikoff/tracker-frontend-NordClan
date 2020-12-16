import React, { Component } from 'react';
import { func, oneOf, arrayOf, exact, number, string, bool, array } from 'prop-types';
import { Row } from 'react-flexbox-grid';
import ReactTooltip from 'react-tooltip';

import flow from 'lodash/flow';

import * as css from './AgileBoardFilter.scss';
import FilterForm from './FilterForm';

import CollapsibleRow from '../../../components/CollapsibleRow';

class AgileBoardFilter extends Component<any, any> {
  static propTypes = {
    clearFilters: func.isRequired,
    filters: exact({
      authorId: arrayOf(number),
      isOnlyMine: bool,
      name: string,
      performerId: arrayOf(number),
      prioritiesId: number,
      typeId: arrayOf(number).isRequired
    }).isRequired,
    getAllUsers: func.isRequired,
    getTasks: func.isRequired,
    initialFilters: exact({
      authorId: arrayOf(number),
      isOnlyMine: bool,
      name: string,
      performerId: arrayOf(number),
      prioritiesId: number,
      typeId: arrayOf(number).isRequired
    }).isRequired,
    lang: oneOf(['en', 'ru']).isRequired,
    setFilterValue: func.isRequired,
    typeOptions: flow(
      exact,
      arrayOf
    )({
      label: string.isRequired,
      value: number.isRequired
    }).isRequired,
    users: array
  };

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
