import React from 'react';
import PropTypes from 'prop-types';
import * as css from './Pagination.scss';
import classnames from 'classnames';

const PaginationItem = ({ active, index, handleClick, clickable }) => (
  <li
    className={classnames({
      [css['page-item']]: true,
      [css.active]: active,
      [css.disabled]: active
    })}
    onClick={clickable ? e => !active && handleClick({ activePage: index }, e) : null}
  >
    {clickable ? (
      <a className={css['page-link']} href="#">
        {index}
      </a>
    ) : (
      <span className={classnames([css['page-link'], css.disabled])}>{index}</span>
    )}
  </li>
);

PaginationItem.propTypes = {
  active: PropTypes.bool,
  clickable: PropTypes.bool,
  handleClick: PropTypes.func,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PaginationItem;
