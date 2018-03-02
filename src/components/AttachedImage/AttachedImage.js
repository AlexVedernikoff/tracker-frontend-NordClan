import React from 'react';
import PropTypes from 'prop-types';
import { IconDelete, IconDownload } from '../Icons';
import Modal from '../Modal';
import ConfirmModal from '../ConfirmModal';

export default class AttachedImage extends React.Component {
  static propTypes = {
    fileName: PropTypes.string.isRequired,
    id: PropTypes.number,
    path: PropTypes.string.isRequired,
    previewPath: PropTypes.string.isRequired,
    removeAttachment: PropTypes.func.isRequired,
    removeInProgress: PropTypes.bool,
    type: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isConfirmDeleteOpen: false
    };
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  handleOpenConfirmDelete = event => {
    event.stopPropagation();
    this.setState({ isConfirmDeleteOpen: true });
  };

  handleCloseConfirmDelete = () => {
    this.setState({ isConfirmDeleteOpen: false });
  };

  handleRemove = () => {
    const { id, removeAttachment } = this.props;
    removeAttachment(id);
    this.handleCloseConfirmDelete();
  };

  stopBubbling = event => {
    event.stopPropagation();
  };

  render () {
    const css = require('./AttachedImage.scss');

    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    const imageStyles = {
      maxHeight: 'calc(100vh - 2rem)',
      maxWidth: '100%',
      display: 'block'
    };

    const { fileName, path, previewPath, canEdit} = this.props;

    return (
      <li className={css.attachment} onClick={this.handleOpenModal}>

        <div className={css.actions}>
          <a
            target="_blank"
            href={`/${path}`}
            onClick={this.stopBubbling}
            download
          >
            <button>
              <IconDownload style={iconStyles} />
            </button>
          </a>
          <button onClick={this.handleOpenConfirmDelete} hidden={!canEdit}>
            <IconDelete style={iconStyles} />
          </button>
        </div>

        <div className={css.imagePreview}>
          <img src={`/${previewPath}`} alt="" className={css.screen} />
        </div>
        <div className={css.attachmentName}>
          {fileName}
        </div>

        {this.state.isModalOpen
          ? <Modal
              isOpen
              contentLabel="modal"
              onRequestClose={this.handleCloseModal}
            >
              <img src={`/${path}`} alt="" style={imageStyles} />
            </Modal>
          : null}

        {this.state.isConfirmDeleteOpen
          ? <ConfirmModal
              isOpen
              contentLabel="modal"
              onRequestClose={this.handleCloseConfirmDelete}
              onConfirm={this.handleRemove}
              onCancel={this.handleCloseConfirmDelete}
              text="Вы уверены, что хотите удалить этот файл?"
            />
          : null}

      </li>
    );
  }
}
AttachedImage.propTypes = {
  canEdit: PropTypes.bool
};
