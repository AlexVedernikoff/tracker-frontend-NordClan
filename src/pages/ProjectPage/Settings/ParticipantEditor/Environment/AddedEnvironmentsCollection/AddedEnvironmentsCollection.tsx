import React, { PureComponent } from 'react';
import { oneOf, number, exact, arrayOf, string, func } from 'prop-types';
import { Row } from 'react-flexbox-grid';

import flow from 'lodash/flow';

import AddedEnvironmentElement from './AddedEnvironmentElement';
import * as css from './addedEnvironmentsCollection.scss';

export default class AddedEnvironmentsCollection extends PureComponent<any, any> {
  static propTypes = {
    environmentsCollection: flow(
      exact,
      arrayOf
    )({
      createdAt: string,
      deletedAt: string,
      description: string.isRequired,
      id: number.isRequired,
      projectId: number.isRequired,
      title: string.isRequired,
      updatedAt: string
    }),
    lang: oneOf(['en', 'ru']).isRequired,
    onRemoveEnvironmentElement: func.isRequired,
    projectId: number.isRequired
  };

  get addedEnvironmentsCollection() {
    const { environmentsCollection, onRemoveEnvironmentElement, projectId } = this.props;

    return environmentsCollection.map(addedEnvironmentElementData => {
      const { id, description, title } = addedEnvironmentElementData;

      return (
        <AddedEnvironmentElement
          key={id}
          id={id}
          description={description}
          classNames={[css.elementContainer]}
          title={title}
          projectId={projectId}
          onRemoveEnvironmentElement={onRemoveEnvironmentElement}
        />
      );
    });
  }

  render() {
    return <Row className={css.container}>{this.addedEnvironmentsCollection}</Row>;
  }
}
