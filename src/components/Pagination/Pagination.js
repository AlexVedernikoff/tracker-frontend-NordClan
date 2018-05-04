import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Pagination.scss';

const Pagination = props => {
  const { itemsCount, activePage, onItemClick, prevText, nextText } = props;

  const PrevDisabled = activePage === 1;
  const NextDisabled = activePage === itemsCount;

  const handleClick = (clickOptions, e) => {
    e.preventDefault();
    let options = clickOptions;

    if (clickOptions.isPrev) {
      if (PrevDisabled) {
        return;
      }

      options = {
        ...clickOptions,
        activePage: activePage - 1
      };
    }

    if (clickOptions.isNext) {
      if (NextDisabled) {
        return;
      }

      options = {
        ...clickOptions,
        activePage: activePage + 1
      };
    }

    if (onItemClick && typeof onItemClick === 'function') {
      onItemClick(options);
    }
  };

  const items = [];
  for (let i = 0; i < itemsCount; i++) {
    const index = i + 1;
    const active = activePage === index;
    items.push(
      <li
        key={i}
        className={classnames({
          [css['page-item']]: true,
          [css.active]: active,
          [css.disabled]: active
        })}
        onClick={e => !active && handleClick({ activePage: index }, e)}
      >
        <a className={css['page-link']} href="#">
          {index}
        </a>
      </li>
    );
  }

  return (
    <ul className={css.pagination}>
      <li
        className={classnames({
          [css['page-item']]: true,
          [css.disabled]: activePage === 1
        })}
        onClick={e => handleClick({ isPrev: true }, e)}
      >
        <a className={css['page-link']} href="#">
          {prevText || '«'}
        </a>
      </li>
      {itemsCount && items}
      <li
        className={classnames({
          [css['page-item']]: true,
          [css.disabled]: activePage === itemsCount
        })}
        onClick={e => handleClick({ isNext: true }, e)}
      >
        <a className={css['page-link']} href="#">
          {nextText || '»'}
        </a>
      </li>
    </ul>
  );
};

Pagination.propTypes = {
  activePage: PropTypes.number.isRequired,
  className: PropTypes.string,
  itemsCount: PropTypes.number.isRequired,
  nextText: PropTypes.string,
  onItemClick: PropTypes.func.isRequired,
  prevText: PropTypes.string
};

export default Pagination;
