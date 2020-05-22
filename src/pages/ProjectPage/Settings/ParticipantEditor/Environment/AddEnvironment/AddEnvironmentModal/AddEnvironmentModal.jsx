import React, { PureComponent } from 'react';
import { func, oneOf } from 'prop-types';

import ModalContent from './ModalContent';

import Modal from '../../../../../../../components/Modal';

export default class AddEnvironmentModal extends PureComponent {
  static propTypes = {
    children: func.isRequired,
    lang: oneOf(['en', 'ru']).isRequired
  };

  constructor() {
    super();

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
    const { modalIsOpen } = this.state;
    const { children, lang } = this.props;

    return (
      <div>
        <Modal isOpen={modalIsOpen} contentLabel="modal" onRequestClose={this.toggleModalVisibility}>
          <ModalContent lang={lang} />
        </Modal>
        {children({ modalIsOpen, toggleModalVisibility: this.toggleModalVisibility })}
      </div>
    );
  }
}
