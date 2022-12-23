import React, { PureComponent } from 'react';
import { oneOf, func, number } from 'prop-types';

import css from './addEnvironment.scss';
import localize from './addEnvironment.json';

import AddEnvironmentModal from './AddEnvironmentModal';

import Button from '../../../../../../components/Button';

export default class AddEnvironment extends PureComponent<any, any> {
  static propTypes = {
    lang: oneOf(['en', 'ru']).isRequired,
    onAddEnvironmentElement: func.isRequired,
    projectId: number.isRequired
  };

  static defaultProps = {};

  get localizationDictionary() {
    const { lang } = this.props;

    return localize[lang];
  }

  handleAddButtonClick = toggleModalVisibility => () => {
    toggleModalVisibility(true);
  };

  renderEnvironmentModalChildren = ({ toggleModalVisibility }) => {
    const localizationDictionary = this.localizationDictionary;

    return (
      <Button
        type="primary"
        addedClassNames={{ [css.addButton]: true }}
        icon="IconPlus"
        onClick={this.handleAddButtonClick(toggleModalVisibility)}
        text={localizationDictionary.ADD_ENVIRONMENT}
      />
    );
  };

  render() {
    const { lang, onAddEnvironmentElement, projectId } = this.props;

    return (
      <AddEnvironmentModal lang={lang} onAddEnvironmentElement={onAddEnvironmentElement} projectId={projectId}>
        {this.renderEnvironmentModalChildren}
      </AddEnvironmentModal>
    );
  }
}
