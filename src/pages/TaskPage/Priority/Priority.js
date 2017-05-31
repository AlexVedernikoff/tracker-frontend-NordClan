import React from 'react';
import PropTypes from 'prop-types';
import * as css from './Priority.scss';
import { IconMinus, IconPlus } from '../../../components/Icons';

const Priority = (props) => {
  return (
    <div className={css.priority}>
      Приоритет:
      <span className={css.count}>
        <IconPlus className={css.icon} data-tip="Увеличить приоритет"/>
        <span>3</span>
        <IconMinus className={css.icon} data-tip="Уменьшить приоритет" data-place='bottom'/>
      </span>
    </div>
  );
};

Priority.propTypes = {

};

export default Priority;
