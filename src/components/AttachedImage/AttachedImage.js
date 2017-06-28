import React from 'react';
import PropTypes from 'prop-types';
import { IconDelete, IconDownload, IconClose } from '../Icons';
import Modal from '../Modal';
import ConfirmModal from '../ConfirmModal';

export default class AttachedImage extends React.Component {
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

    const { fileName, filePath, fileType } = this.props;

    return (
      <li className={css.attachment} onClick={this.handleOpenModal}>

        <div className={css.actions}>
          <a
            target="_blank"
            href={filePath}
            onClick={this.stopBubbling}
            download
          >
            <button>
              <IconDownload style={iconStyles} />
            </button>
          </a>
          <button onClick={this.handleOpenConfirmDelete}>
            <IconDelete style={iconStyles} />
          </button>
        </div>

        <div className={css.imagePreview}>
          <img src={filePath} alt="" className={css.screen} />
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
              <img src={filePath} alt="" style={imageStyles} />
            </Modal>
          : null}

        {this.state.isConfirmDeleteOpen
          ? <ConfirmModal
              isOpen
              contentLabel="modal"
              onRequestClose={this.handleCloseConfirmDelete}
              onConfirm={() => console.log('Йеп')}
              onCancel={this.handleCloseConfirmDelete}
              text="Вы уверены, что хотите удалить этот файл?"
            />
          : null}

      </li>
    );
  }
}

AttachedImage.propTypes = {
  fileName: PropTypes.string.isRequired,
  filePath: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired
};
