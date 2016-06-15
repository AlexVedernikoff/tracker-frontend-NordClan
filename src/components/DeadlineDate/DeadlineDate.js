/* компонент для отображения даты дедлайна, принимает дату и стили для контейнера*/
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

  return (
    <div style={styles.dateDeadlineBar}>
      <p style={styles.labelDayOfDeadline}>{date.day}</p>
      <p style={styles.labelMonthOfDeadline}>{date.month}</p>
    </div>
  );
};

DeadlineDate.propTypes = {
  date: PropTypes.shape({
    day: PropTypes.number,
    month: PropTypes.string
  }),
  style: PropTypes.object
};

export default DeadlineDate;
