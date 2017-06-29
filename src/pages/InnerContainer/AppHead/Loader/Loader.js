import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as css from './Loader.scss';

export default class Loader extends Component {
  render () {
    return (
      <div className={css.Loader}>
        <span/>
      </div>
    );
  }
}
