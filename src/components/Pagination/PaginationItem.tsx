import React from 'react';
import PropTypes from 'prop-types';
import * as css from './Pagination.scss';
import classnames from 'classnames';

interface Props {
  active: boolean
  index: string | number
  handleClick?: (event: { activePage: string | number; }, e) => void
  clickable: boolean
}

const PaginationItem = ({ active, index, handleClick, clickable }: Props) => (
  <li
    className={classnames({
      [css['page-item']]: true,
      [css.active]: active,
      [css.disabled]: active
    })}
    onClick={clickable ? e => !active && handleClick && handleClick({ activePage: index }, e) : undefined}
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

(PaginationItem as any).propTypes = {
  active: PropTypes.bool,
  clickable: PropTypes.bool,
  handleClick: PropTypes.func,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PaginationItem;
