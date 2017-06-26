import React from 'react';
import PropTypes from 'prop-types';
import {
  IconFileDocument,
  IconFilePdf,
  IconDelete,
  IconDownload
} from '../Icons';
import ConfirmModal from '../ConfirmModal';

export default class AttachedDocument extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isConfirmDeleteOpen: false
    };
  }

  stopBubbling (event) {
    event.stopPropagation();
  }

  handleOpenConfirmDelete = event => {
    event.stopPropagation();
    this.setState({ isConfirmDeleteOpen: true });
  };

  handleCloseConfirmDelete = () => {
    this.setState({ isConfirmDeleteOpen: false });
  };

  render () {
    const css = require('./AttachedDocument.scss');

    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    const { fileName, filePath, fileType } = this.props;

    return (
      <li className={css.attachment}>
        <div className={css.actions}>
          <a href={filePath} onClick={this.stopBubbling} download>
            <button>
              <IconDownload style={iconStyles} />
            </button>
          </a>
          <button onClick={this.handleOpenConfirmDelete}>
            <IconDelete style={iconStyles} />
          </button>
        </div>
        <a target="_blank" href={filePath} className={css.iconWrapper}>
          <div className={css.attachmentIcon}>
            {fileType === 'pdf'
              ? <IconFilePdf style={iconStyles} />
              : <IconFileDocument style={iconStyles} />}
          </div>
          <div className={css.attachmentName}>
            {fileName}
          </div>
        </a>

        {this.state.isConfirmDeleteOpen
          ? <ConfirmModal
              isOpen
              contentLabel="modal"
              text="Вы действительно хотите удалить этот файл?"
              onCancel={this.handleCloseConfirmDelete}
              onRequestClose={this.handleCloseConfirmDelete}
            />
          : null}
      </li>
    );
  }
}

AttachedDocument.propTypes = {
  fileName: PropTypes.string.isRequired,
  filePath: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired
};
