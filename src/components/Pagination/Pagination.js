import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import PaginationItem from './PaginationItem';
import * as css from './Pagination.scss';

const paginationConfig = {
  maxVisibleCount: 8,
  tail: 2,
  skipChar: '...'
};

const SkipItem = () => <PaginationItem active={false} index={paginationConfig.skipChar} clickable={false} />;

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
  const fillItems = (min, max) => {
    for (let i = min; i < max; i++) {
      const index = i + 1;
      const active = activePage === index;
      items.push(<PaginationItem active={active} key={i} index={index} clickable handleClick={handleClick} />);
    }
  };

  const startCount = paginationConfig.maxVisibleCount - paginationConfig.tail;
  const finishCount = itemsCount - startCount;

  const isBegin = activePage <= startCount;
  const isMiddle = activePage > startCount && activePage <= finishCount;
  const isEnd = activePage > finishCount;

  if (itemsCount <= paginationConfig.maxVisibleCount) {
    fillItems(0, itemsCount);
  } else if (isMiddle) {
    items.push(
      <PaginationItem key="startPage" active={activePage === 1} index={1} clickable handleClick={handleClick} />
    );
    items.push(<SkipItem key="startSkip" />);
    const middleLength = paginationConfig.maxVisibleCount - paginationConfig.tail * 2;
    fillItems(Math.floor(activePage - middleLength / 2), Math.floor(activePage + middleLength / 2) - 1);
    items.push(<SkipItem key="finishSkip" />);
    items.push(
      <PaginationItem
        key="finishPage"
        active={activePage === itemsCount}
        index={itemsCount}
        clickable
        handleClick={handleClick}
      />
    );
  } else if (isBegin) {
    fillItems(0, paginationConfig.maxVisibleCount - paginationConfig.tail);
    items.push(<SkipItem key="finishSkip" />);
    items.push(
      <PaginationItem
        key="finishPage"
        active={activePage === itemsCount}
        index={itemsCount}
        clickable
        handleClick={handleClick}
      />
    );
  } else if (isEnd) {
    items.push(
      <PaginationItem key="startPage" active={activePage === 1} index={1} clickable handleClick={handleClick} />
    );
    items.push(<SkipItem key="startSkip" />);
    fillItems(itemsCount - (paginationConfig.maxVisibleCount - paginationConfig.tail), itemsCount);
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
