import React, { PureComponent } from 'react';
import { oneOf } from 'prop-types';
import { Row } from 'react-flexbox-grid/lib';

import AddedEnvironmentElement from './AddedEnvironmentElement';
import * as css from './addedEnvironmentsCollection.scss';

export default class AddedEnvironmentsCollection extends PureComponent {
  static propTypes = {
    lang: oneOf(['en', 'ru']).isRequired
  };

  get addedEnvironmentsCollection() {
    return [
      { id: 1, description: 'description test1', title: 'title test1' },
      { id: 2, description: 'description test2', title: 'title test2' }
    ].map(addedEnvironmentElementData => {
      const { id, description, title } = addedEnvironmentElementData;

      return <AddedEnvironmentElement key={id} id={id} description={description} title={title} />;
    });
  }

  render() {
    return <Row className={css.container}>{this.addedEnvironmentsCollection}</Row>;
  }
}
