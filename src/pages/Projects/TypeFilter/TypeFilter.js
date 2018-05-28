import React, { Component } from 'react';
import PropTypes from 'prop-types';

import createOptions from '../../../utils/createTwoWayFilterOptions';
import * as css from './TypeFilter.scss';
import Select from '../../../components/SelectDropdown';

class TypeFilter extends Component {
  static propTypes = {};

  render() {
    return (
      <div className={css.typeFilter}>
        <Select
          name="performer"
          placeholder="Выберите тип проекта"
          multi
          noResultsText="Нет результатов"
          backspaceRemoves={false}
          options={createOptions(
            [
              { label: 'Стажировка', value: 1, className: css.not },
              { label: 'Продуктовый', value: 2, className: css.equal },
              { label: 'Внутренний', value: 3, className: css.equal }
            ],
            css.optGroupLabel,
            css.option
          )}
          {...this.props}
        />
      </div>
    );
  }
}

export default TypeFilter;
