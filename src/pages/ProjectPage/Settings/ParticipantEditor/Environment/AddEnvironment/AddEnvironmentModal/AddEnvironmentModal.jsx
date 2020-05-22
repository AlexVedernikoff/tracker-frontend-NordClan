import React, { PureComponent } from 'react';
import { func, oneOf, number } from 'prop-types';

import ModalContent from './ModalContent';

import Modal from '../../../../../../../components/Modal';

export default class AddEnvironmentModal extends PureComponent {
  static propTypes = {
    children: func.isRequired,
    lang: oneOf(['en', 'ru']).isRequired,
    onAddEnvironmentElement: func.isRequired,
    projectId: number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };
  }

  toggleModalVisibility = modalVisibility => {
    this.setState(({ modalIsOpen }) => ({
      modalIsOpen: typeof modalVisibility === 'boolean' ? modalVisibility : !modalIsOpen
    }));
  };

  render() {
    const { children, lang, onAddEnvironmentElement, projectId } = this.props;
    const { modalIsOpen } = this.state;

    return (
      <div>
        <Modal isOpen={modalIsOpen} contentLabel="modal" onRequestClose={this.toggleModalVisibility}>
          <ModalContent onAddEnvironmentElement={onAddEnvironmentElement} projectId={projectId} lang={lang} />
        </Modal>
        {children({ modalIsOpen, toggleModalVisibility: this.toggleModalVisibility })}
      </div>
    );
  }
}
