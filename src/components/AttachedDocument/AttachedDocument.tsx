import React from 'react';
import PropTypes from 'prop-types';
import { IconFileDocument, IconFilePdf, IconDelete, IconDownload } from '../Icons';
import localize from './AttachedDocument.json';

export default class AttachedDocument extends React.Component<any, any> {
  static propTypes = {
    canEdit: PropTypes.bool,
    fileName: PropTypes.string.isRequired,
    handleCloseConfirmDelete: PropTypes.func,
    handleOpenConfirmDelete: PropTypes.func,
    id: PropTypes.number,
    lang: PropTypes.string,
    path: PropTypes.string.isRequired,
    removeAttachment: PropTypes.func.isRequired,
    removeInProgress: PropTypes.bool,
    type: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  stopBubbling(event) {
    event.stopPropagation();
  }

  handleOpenConfirmDelete = event => {
    event.stopPropagation();
    const { id, lang } = this.props;
    this.props.handleOpenConfirmDelete(id, localize[lang].CONFIRM_DELETE);
  };

  handleCloseConfirmDelete = () => {
    this.props.handleCloseConfirmDelete();
  };

  handleRemove = () => {
    const { id, removeAttachment } = this.props;
    this.handleCloseConfirmDelete();
    removeAttachment(id);
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
          <a href={`/${path}`} onClick={this.stopBubbling} download={fileName}>
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
      </li>
    );
  }
}
