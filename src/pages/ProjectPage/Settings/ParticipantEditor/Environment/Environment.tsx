import React, { PureComponent } from 'react';
import { oneOf, number, arrayOf, shape, string, func } from 'prop-types';

import flow from 'lodash/flow';

import * as css from './Environment.scss';
import localize from './environment.json';

import AddEnvironment from './AddEnvironment';
import AddedEnvironmentsCollection from './AddedEnvironmentsCollection';

export default class Environment extends PureComponent {
  static propTypes = {
    addEnvironmentElement: func.isRequired,
    deleteEnvironmentElement: func.isRequired,
    getProjectEnvironment: func.isRequired,
    lang: oneOf(['en', 'ru']).isRequired,
    params: shape({
      projectId: string.isRequired
    }).isRequired,
    projectEnvironment: flow(
      shape,
      arrayOf
    )({
      description: string,
      id: number,
      title: string.isRequired
    }),
    purgeProjectEnvironment: func.isRequired
  };

  static defaultProps = {
    projectEnvironment: []
  };

  componentDidMount() {
    const { getProjectEnvironment } = this.props;

    const projectId = this.projectId;

    if (typeof projectId === 'number' && !isNaN(projectId)) {
      getProjectEnvironment(this.projectId);
    }
  }

  componentWillUnmount() {
    const { purgeProjectEnvironment } = this.props;

    purgeProjectEnvironment();
  }

  get localizationDictionary() {
    const { lang } = this.props;

    return localize[lang];
  }

  get projectId() {
    const { params } = this.props;
    const { projectId } = params;

    return parseInt(projectId, 10);
  }

  render() {
    const { addEnvironmentElement, deleteEnvironmentElement, lang, projectEnvironment } = this.props;

    const localizationDictionary = this.localizationDictionary;
    const projectId = this.projectId;

    if (typeof projectId !== 'number' && !isNaN(projectId)) {
      return null;
    }

    return (
      <div className={css.container}>
        <h2>{localizationDictionary.ENVIRONMENT}</h2>
        <AddedEnvironmentsCollection
          lang={lang}
          environmentsCollection={projectEnvironment}
          onRemoveEnvironmentElement={deleteEnvironmentElement}
          projectId={projectId}
        />
        <AddEnvironment lang={lang} onAddEnvironmentElement={addEnvironmentElement} projectId={projectId} />
      </div>
    );
  }
}
