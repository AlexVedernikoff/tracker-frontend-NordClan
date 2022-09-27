import React, { Component } from 'react';

import css from './Loader.scss';

export default class Loader extends Component<any, any> {
  render() {
    return (
      <div className={css.Loader}>
        <span />
      </div>
    );
  }
}
