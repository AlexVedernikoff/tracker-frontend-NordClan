import React from 'react';
import PropTypes from 'prop-types';
import { IconDelete, IconDownload } from '../Icons';
import ConfirmModal from '../ConfirmModal';
import localize from './AttachedImage.json';

export default class AttachedImage extends React.Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    fileName: PropTypes.string.isRequired,
    id: PropTypes.number,
    index: PropTypes.number,
    lang: PropTypes.string,
    open: PropTypes.func,
    path: PropTypes.string.isRequired,
    previewPath: PropTypes.string.isRequired,
    removeAttachment: PropTypes.func,
    removeInProgress: PropTypes.bool,
    type: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isConfirmDeleteOpen: false
    };
  }

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

  render() {
    const css = require('./AttachedImage.scss');

    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    const { fileName, path, previewPath, canEdit, open, index, lang } = this.props;

    return (
      <li
        className={css.attachment}
        onClick={() => {
          open(index);
        }}
      >
        <div className={css.actions}>
          <a target="_blank" href={`/${path}`} onClick={this.stopBubbling} download={fileName}>
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
        <div className={css.attachmentName}>{fileName}</div>

        {this.state.isConfirmDeleteOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            onRequestClose={this.handleCloseConfirmDelete}
            onConfirm={this.handleRemove}
            onCancel={this.handleCloseConfirmDelete}
            text={localize[lang].CONFIRM_DELETE}
          />
        ) : null}
      </li>
    );
  }
}
