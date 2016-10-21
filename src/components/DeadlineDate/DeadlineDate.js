/* компонент для отображения даты дедлайна, принимает дату (в Unix timestamp) и стили для контейнера*/
import React, { PropTypes } from 'react';

const DeadlineDate = (props) => {
  const { date, style, css } = props;

  const dateObj = new Date(date);
  const day = new Intl.DateTimeFormat('ru', {day: 'numeric'}).format(dateObj);
  const month = new Intl.DateTimeFormat('ru', {month: 'long'}).format(dateObj);

  return (date) ? (
    <div className={css.dateDeadlineBar} style={{...style}}>
      <p className={css.labelDayOfDeadline}>{day}</p>
      <p className={css.labelMonthOfDeadline}>{month}</p>
    </div>
  ) : (
    <div className={css.dateDeadlineBar} style={{...style}}>&mdash;</div>
  );
};

DeadlineDate.propTypes = {
  date: PropTypes.number,
  style: PropTypes.object,
  css: PropTypes.object
};

DeadlineDate.defaultProps = {
  date: 0,
  css: require('./deadlineDate.scss')
};

export default DeadlineDate;
