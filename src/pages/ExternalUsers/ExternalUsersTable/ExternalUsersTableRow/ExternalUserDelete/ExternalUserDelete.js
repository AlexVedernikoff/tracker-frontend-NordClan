import React, { Component } from 'react';
import { IconDelete } from '../../../../../components/Icons';
import ConfirmModal from '../../../../../components/ConfirmModal';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import * as css from './ExternalUserDelete.scss';

class ExternalUserDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  openConfirmModal = () => {
    this.setState({ isModalOpen: true });
  };
  closeConfirmModal = () => {
    this.setState({ isModalOpen: false });
  };
  confirmDeleteUser = () => {
    this.setState({ isModalOpen: false }, () => {
      this.props.onDelete();
    });
  };
  render() {
    const { dataTip, text } = this.props;
    return (
      <div className={css.ExternalUserDelete}>
        <IconDelete onClick={this.openConfirmModal} data-tip={dataTip} className={css.deleteIcon} />
        <ConfirmModal
          isOpen={this.state.isModalOpen}
          contentLabel="modal"
          text={`${text} ${this.props.username}?`}
          onCancel={this.closeConfirmModal}
          onConfirm={this.confirmDeleteUser}
          onRequestClose={this.handleCloseConfirmDelete}
        />
      </div>
    );
  }
}
ExternalUserDelete.propTypes = {
  onDelete: PropTypes.func,
  username: PropTypes.string
};
export default ExternalUserDelete;
