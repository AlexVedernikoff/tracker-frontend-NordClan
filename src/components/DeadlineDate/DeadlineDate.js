/* компонент для отображения даты дедлайна, принимает дату (в Unix timestamp) и стили для контейнера*/
import React, { PropTypes } from 'react';

const DeadlineDate = (props) => {
  const { date, style } = props;
  const styles = {
    dateDeadlineBar: {
      textAlign: 'center',
      fontSize: 20,
      ...style
    },
    labelDayOfDeadline: {
      lineHeight: '14px',
      marginBottom: '5px'
    },
    labelMonthOfDeadline: {
      fontSize: '12px',
      margin: 0
    }
  };
  const dateObj = new Date(date);
  const day = new Intl.DateTimeFormat('ru', {day: 'numeric'}).format(dateObj);
  const month = new Intl.DateTimeFormat('ru', {month: 'long'}).format(dateObj);

  return (date) ? (
    <div style={styles.dateDeadlineBar}>
      <p style={styles.labelDayOfDeadline}>{day}</p>
      <p style={styles.labelMonthOfDeadline}>{month}</p>
    </div>
  ) : (
    <div style={styles.dateDeadlineBar}>&mdash;</div>
  );
};

DeadlineDate.propTypes = {
  date: PropTypes.number,
  style: PropTypes.object
};

DeadlineDate.defaultProps = {
  date: 0
};

export default DeadlineDate;
