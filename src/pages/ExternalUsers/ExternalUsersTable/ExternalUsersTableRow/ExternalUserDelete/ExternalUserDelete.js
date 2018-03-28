import React, { Component } from 'react';
import { IconDelete } from '../../../../../components/Icons';
import ConfirmModal from '../../../../../components/ConfirmModal';

class ExternalUserDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }
  openConfirmModal = () => {
    this.setState({ isModalOpen: true });
  };
  closeConfirmModal = () => {
    this.setState({ isModalOpen: false });
  };
  render() {
    return (
      <div>
        <IconDelete onClick={this.openConfirmModal} />
        <ConfirmModal
          isOpen={this.state.isModalOpen}
          contentLabel="modal"
          text="Вы действительно хотите удалить этого участника?"
          onCancel={this.closeConfirmModal}
          onConfirm={this.unbindUser}
          onRequestClose={this.handleCloseConfirmDelete}
        />
      </div>
    );
  }
}

export default ExternalUserDelete;
