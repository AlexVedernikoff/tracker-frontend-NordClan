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
  const { itemsCount, activePage, onItemClick, prevText, nextText, from = 1, to = itemsCount } = props;

  const PrevDisabled = activePage === 1 || activePage === from;
  const NextDisabled = activePage === itemsCount || activePage === to;

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

  const fillItems = (min, max) => {
    const filledArr = [];
    for (let i = min; i < max; i++) {
      const index = i + 1;
      const active = activePage === index;
      filledArr.push(<PaginationItem active={active} key={i} index={index} clickable handleClick={handleClick} />);
    }
    return filledArr;
  };

  const startCount = paginationConfig.maxVisibleCount - paginationConfig.tail;
  const finishCount = itemsCount - startCount + 1;
  const startPageItem = (
    <PaginationItem key="startPage" active={activePage === 1} index={1} clickable handleClick={handleClick} />
  );
  const finishPageItem = (
    <PaginationItem
      key="finishPage"
      active={activePage === itemsCount}
      index={itemsCount}
      clickable
      handleClick={handleClick}
    />
  );

  const needCut = itemsCount > paginationConfig.maxVisibleCount;
  const isStart = activePage < startCount;
  const isMiddle = activePage >= startCount && activePage <= finishCount;
  const isEnd = activePage > finishCount;

  const middleLength = isMiddle ? paginationConfig.maxVisibleCount - paginationConfig.tail * 2 : 0;
  const startMiddlePart = isMiddle ? Math.floor(activePage - middleLength / 2) : 0;
  const endMiddlePart = isMiddle ? Math.floor(activePage + middleLength / 2) : 0;

  let items = [];

  if (!needCut) {
    items = [...fillItems(from - 1, to)];
  } else if (isMiddle) {
    items = [
      startPageItem,
      <SkipItem key="startSkip" />,
      ...fillItems(startMiddlePart, endMiddlePart),
      <SkipItem key="finishSkip" />,
      finishPageItem
    ];
  } else if (isStart) {
    items = [
      ...fillItems(0, paginationConfig.maxVisibleCount - paginationConfig.tail),
      <SkipItem key="finishSkip" />,
      finishPageItem
    ];
  } else if (isEnd) {
    items = [
      startPageItem,
      <SkipItem key="startSkip" />,
      ...fillItems(itemsCount - (paginationConfig.maxVisibleCount - paginationConfig.tail), itemsCount)
    ];
  }

  return (
    <ul className={css.pagination}>
      <li
        className={classnames({
          [css['page-item']]: true,
          [css.disabled]: PrevDisabled
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
          [css.disabled]: NextDisabled
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
  from: PropTypes.number,
  itemsCount: PropTypes.number.isRequired,
  nextText: PropTypes.string,
  onItemClick: PropTypes.func.isRequired,
  prevText: PropTypes.string,
  to: PropTypes.number
};

export default Pagination;
