import React from 'react';

export default class StatusDropdown extends React.Component {

  render() {
    const css = require('./StatusDropdown.scss');

    return (
      <span>
        <span className={css.status + ' ' + css.inProgress}>Статус: В процессе</span>
      </span>
    );
  }
}
