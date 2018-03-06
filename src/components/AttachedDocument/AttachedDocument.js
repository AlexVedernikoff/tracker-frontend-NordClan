import React from 'react';
import PropTypes from 'prop-types';
import { IconFileDocument, IconFilePdf, IconDelete, IconDownload } from '../Icons';
import ConfirmModal from '../ConfirmModal';

export default class AttachedDocument extends React.Component {
  static propTypes = {
    fileName: PropTypes.string.isRequired,
    id: PropTypes.number,
    path: PropTypes.string.isRequired,
    removeAttachment: PropTypes.func.isRequired,
    removeInProgress: PropTypes.bool,
    type: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isConfirmDeleteOpen: false
    };
  }

  stopBubbling(event) {
    event.stopPropagation();
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

  render() {
    const css = require('./AttachedDocument.scss');

    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    const { fileName, path, canEdit } = this.props;

    return (
      <li className={css.attachment}>
        <div className={css.actions}>
          <a href={`/${path}`} onClick={this.stopBubbling} download>
            <button>
              <IconDownload style={iconStyles} />
            </button>
          </a>
          <button onClick={this.handleOpenConfirmDelete} hidden={!canEdit}>
            <IconDelete style={iconStyles} />
          </button>
        </div>
        <a target="_blank" href={`/${path}`} className={css.iconWrapper}>
          <div className={css.attachmentIcon}>
            {/\.pdf$/.test(fileName) ? <IconFilePdf style={iconStyles} /> : <IconFileDocument style={iconStyles} />}
          </div>
          <div className={css.attachmentName}>{fileName}</div>
        </a>

        {this.state.isConfirmDeleteOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text="Вы действительно хотите удалить этот файл?"
            onCancel={this.handleCloseConfirmDelete}
            onConfirm={this.handleRemove}
            onRequestClose={this.handleCloseConfirmDelete}
          />
        ) : null}
      </li>
    );
  }
}
AttachedDocument.propTypes = {
  canEdit: PropTypes.bool
};
