import React from 'react';
import PropTypes from 'prop-types';
import { IconDelete, IconDownload } from '../Icons';
import localize from './AttachedImage.json';
import { isBlob } from '../../utils/isBlob';
import css from './AttachedImage.scss';

export default class AttachedImage extends React.Component<any, any> {
  static propTypes = {
    canEdit: PropTypes.bool,
    fileName: PropTypes.string.isRequired,
    handleCloseConfirmDelete: PropTypes.func,
    handleOpenConfirmDelete: PropTypes.func,
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

  stopBubbling = event => {
    event.stopPropagation();
  };

  render() {
    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    const { fileName, path, previewPath, canEdit, open, index } = this.props;

    let href = `/${path}`;
    let src = `/${previewPath}`
    
    if(isBlob(path) && isBlob(previewPath)) {
      href= path;
      src = previewPath;
    }

    return (
      <li
        className={css.attachment}
        data-attachment-id={this.props.id}
        onClick={() => {
          open(index);
        }}
      >
        <div className={css.actions}>
          <a target="_blank" href={href} onClick={this.stopBubbling} download={fileName}>
            <div className={css.actionsButton}>
              <IconDownload style={iconStyles} />
            </div>
          </a>
          <div className={css.actionsButton} onClick={this.handleOpenConfirmDelete} hidden={!canEdit}>
            <IconDelete style={iconStyles} />
          </div>
        </div>

        <div className={css.imagePreview}>
          <img src={src} alt="" className={css.screen} />
        </div>
        <div className={css.attachmentName}>{fileName}</div>
      </li>
    );
  }
}
