import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import * as css from './theme.scss';

const Pagination = (props) => {
  const { itemsCount, className, activePage, onItemClick, prevText, nextText } = props;

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
    items.push(<li key={i} className={classname(css['page-item'], {
      'active': activePage === index
    })}
        onClick={(e) => handleClick({ activePage: index }, e)}
      >
        <a className="page-link" href="#">{index}</a>
      </li>);
  }

  return (
    <ul className={css.pagination}>
      <li className={classname(css['page-item'], {
        'disabled': activePage === 1
      })} onClick={(e) => handleClick({ isPrev: true }, e)}><a className={css['page-link']} href="#">{prevText || 'Пред.'}</a></li>
      {
        itemsCount && items
      }
      <li className={classname(css['page-item'], {
        'disabled': activePage === itemsCount
      })} onClick={(e) => handleClick({ isNext: true }, e)}><a className={css['page-link']} href="#">{nextText || 'След.'}</a></li>
    </ul>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  className: PropTypes.string,
  activePage: PropTypes.number.isRequired,
  onItemClick: PropTypes.func.isRequired,
  prevText: PropTypes.string,
  nextText: PropTypes.string
};

export default Pagination;
