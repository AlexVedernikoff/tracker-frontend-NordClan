import React from 'react';

export default class PriorityDropdown extends React.Component {

  render() {
    const css = require('./PriorityDropdown.scss');

    return (
      <span className={css.priority + ' ' + css.third}>
        <span>Приоритет: </span><span>3</span>
      </span>
    );
  }
}
