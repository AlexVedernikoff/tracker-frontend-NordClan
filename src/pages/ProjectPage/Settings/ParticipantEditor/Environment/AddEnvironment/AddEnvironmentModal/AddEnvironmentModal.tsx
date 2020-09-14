import React, { PureComponent } from 'react';
import { func, oneOf, number } from 'prop-types';

import ModalContent from './ModalContent';

import Modal from '../../../../../../../components/Modal';

export default class AddEnvironmentModal extends PureComponent<any, any> {
  static propTypes = {
    children: func.isRequired,
    lang: oneOf(['en', 'ru']).isRequired,
    onAddEnvironmentElement: func.isRequired,
    projectId: number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      addEnvironmentPending: false
    };
  }

  toggleModalVisibility = (modalVisibility, callback) => {
    this.setState(
      ({ modalIsOpen }) => ({
        modalIsOpen: typeof modalVisibility === 'boolean' ? modalVisibility : !modalIsOpen
      }),
      callback
    );
  };

  handleAddAndClose = ({ title, description, projectId }) => {
    const { onAddEnvironmentElement } = this.props;

    this.setState({ addEnvironmentPending: true });

    onAddEnvironmentElement(
      {
        title,
        description,
        projectId
      },
      () => {
        this.setState({ addEnvironmentPending: false });
        this.toggleModalVisibility(false);
      },
      () => {
        this.setState({ addEnvironmentPending: false });
      }
    );
  };

  handleAdd = ({ setModalContentState, title, description, projectId }) => {
    const { onAddEnvironmentElement } = this.props;

    this.setState({ addEnvironmentPending: true });

    onAddEnvironmentElement(
      {
        title,
        description,
        projectId
      },
      () => {
        this.setState({ addEnvironmentPending: false });
        setModalContentState({ description: '', title: '' });
      },
      () => {
        this.setState({ addEnvironmentPending: false });
      }
    );
  };

  render() {
    const { children, lang, onAddEnvironmentElement, projectId } = this.props;
    const { modalIsOpen, addEnvironmentPending } = this.state;

    return (
      <div>
        <Modal isOpen={modalIsOpen} contentLabel="modal" onRequestClose={this.toggleModalVisibility}>
          <ModalContent
            onAddEnvironmentElement={onAddEnvironmentElement}
            projectId={projectId}
            lang={lang}
            onAddAndClose={this.handleAddAndClose}
            onAdd={this.handleAdd}
            pending={addEnvironmentPending}
          />
        </Modal>
        {children({ modalIsOpen, toggleModalVisibility: this.toggleModalVisibility })}
      </div>
    );
  }
}
