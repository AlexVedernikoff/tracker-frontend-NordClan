import React, { PureComponent } from 'react';
import { oneOf } from 'prop-types';

import * as css from './Environment.scss';
import localize from './environment.json';

import AddEnvironment from './AddEnvironment';
import AddedEnvironmentsCollection from './AddedEnvironmentsCollection';

export default class Environment extends PureComponent {
  static propTypes = {
    lang: oneOf(['en', 'ru']).isRequired
  };

  get localizationDictionary() {
    const { lang } = this.props;

    return localize[lang];
  }

  render() {
    const { lang } = this.props;

    const localizationDictionary = this.localizationDictionary;

    return (
      <div className={css.container}>
        <h2>{localizationDictionary.ENVIRONMENT}</h2>
        <AddedEnvironmentsCollection lang={lang} />
        <AddEnvironment lang={lang} />
      </div>
    );
  }
}
