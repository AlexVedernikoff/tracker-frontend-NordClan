import React from 'react';
import PropTypes from 'prop-types';
import { IconDelete, IconDownload, IconClose } from '../Icons';
import ReactModal from 'react-modal';
import ConfirmDelete from 'react-modal';

const ReactModalStyles = {
  content: {
    left: '260px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlay: {
    zIndex: 5
  }
};

const ConfirmDeleteStyles = {
  content: {
    top: '40%',
    left: '40%',
    right: '40%',
    bottom: '40%'
  },
  overlay: {
    zIndex: 5
  }
};

export default class AttachedImage extends React.Component {
  constructor(props) {
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

  render() {
    const css = require('./AttachedImage.scss');

    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    const imageStyles = {
      maxHeight: '90%',
      maxWidth: '100%'
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
          ? <ReactModal
              isOpen={true}
              style={ReactModalStyles}
              contentLabel="modal"
              onRequestClose={this.handleCloseModal}
            >
              <IconClose
                style={iconStyles}
                className={css.iconClose}
                onClick={this.handleCloseModal}
              />
              <img src={filePath} alt="" style={imageStyles} />
            </ReactModal>
          : null}

        {this.state.isConfirmDeleteOpen
          ? <ConfirmDelete
              isOpen={true}
              contentLabel="modal"
              style={ConfirmDeleteStyles}
            >
              <p>Are you sure want to delete this file?</p>
              <button onClick={this.handleCloseConfirmDelete}>No</button>
            </ConfirmDelete>
          : null}

      </li>
    );
  }
}

AttachedImage.PropTypes = {
  fileType: PropTypes.string.isRequired,
  filePath: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired
};
