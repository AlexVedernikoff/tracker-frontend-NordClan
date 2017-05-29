import React from 'react';
import cn from 'classnames';

export default class StatusDropdown extends React.Component {

  render () {
    const css = require('./StatusDropdown.scss');
    return (
      <span className={css.statusContainer}>
        <span className={css.status}>Статус:</span>
        <span className={css.statuses}>
          <span className={cn(css.status, css.inProgress)}>В процессе</span>
          <span className={css.dropList}>
            <span className={css.status + ' ' + css.inProgress}>Утвержден</span>
            <span className={css.status + ' ' + css.inProgress}>Требует внимания</span>
            <span className={css.status + ' ' + css.inProgress}>Прерван</span>
            <span className={css.status + ' ' + css.inProgress}>Завершен</span>
            <span className={css.status + ' ' + css.inProgress}>Отклонен</span>
            <span className={css.status + ' ' + css.inProgress}>Заморожен</span>
          </span>
        </span>
      </span>
    );
  }
}
