import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AttachedDocument from '../AttachedDocument';
import AttachedImage from '../AttachedImage';
import AttachDeletion from '../AttachDeletion';
import AttachUploading from '../AttachUploading';
import FileUpload from '../FileUpload';
import Lightbox from 'react-image-lightbox';
import localize from './Attachments.json';
import 'react-image-lightbox/style.css';

const imageTypes = ['image' /*fallback for old attachments*/, 'image/jpeg', 'image/png', 'image/pjpeg'];
export const isImage = t => imageTypes.indexOf(t) !== -1;

export default class Attachments extends Component {
  static defaultProps = {
    attachments: []
  };

  static maxFileSize = 1024 * 1024 * 1024; // 1gb

  state = {
    photoIndex: 0,
    isOpen: false
  };

  onDrop = acceptedFiles => {
    if (!this.filesMaxSizeValid(acceptedFiles)) {
      return this.showError(localize[this.props.lang].FILE_SIZE_ERROR);
    }

    this.props.uploadAttachments(acceptedFiles);
  };

  filesMaxSizeValid = files => {
    for (const file of files) {
      if (file.size > Attachments.maxFileSize) {
        return false;
      }
    }

    return true;
  };

  showError = message => {
    this.props.showNotification({ message, type: 'error' }, 3000);
  };

  getAttachmentsNextImageIndex = index => {
    for (let i = index; i < this.props.attachments.length; i++) {
      const file = this.props.attachments[i];
      if (file && isImage(file.type)) {
        return i;
      }
    }

    return index ? this.getAttachmentsNextImageIndex(0) : 0;
  };

  getAttachmentsPrevImageIndex = index => {
    const lastIndex = this.props.attachments.length - 1;
    for (let i = index; i >= 0; i--) {
      const file = this.props.attachments[i];
      if (file && isImage(file.type)) {
        return i;
      }
    }

    return index < lastIndex ? this.getAttachmentsPrevImageIndex(lastIndex) : 0;
  };

  openImage = index => {
    this.setState({ isOpen: true, photoIndex: index });
  };

  closeImage = () => {
    this.setState({ isOpen: false });
  };

  prevImage = () => {
    const attachments = this.props.attachments;
    this.setState({
      photoIndex: this.getAttachmentsPrevImageIndex(
        (this.state.photoIndex + attachments.length - 1) % attachments.length
      )
    });
  };

  nextImage = () => {
    const attachments = this.props.attachments;
    this.setState({
      photoIndex: this.getAttachmentsNextImageIndex((this.state.photoIndex + 1) % attachments.length)
    });
  };

  getAttachment = (file, index) => {
    if (file.deleting) {
      return <AttachDeletion key={`attached-deletion-${index}`} filename={file.fileName} />;
    }

    if (file.uploading) {
      return <AttachUploading key={`attached-uploading-${index}`} {...file} />;
    }

    if (isImage(file.type)) {
      return (
        <AttachedImage
          key={`attached-picture-${index}`}
          open={this.openImage}
          index={index}
          {...file}
          canEdit={this.props.canEdit}
          removeAttachment={this.props.removeAttachment}
        />
      );
    }

    return (
      <AttachedDocument
        key={`attached-document-${index}`}
        {...file}
        canEdit={this.props.canEdit}
        removeAttachment={this.props.removeAttachment}
      />
    );
  };

  handleImageLoad = () => {
    setTimeout(() => {
      try {
        const buttonIn = document.querySelector('.ril-zoom-in');
        const buttonOut = document.querySelector('.ril-zoom-out');
        buttonIn.click();
        buttonOut.click();
        const image = document.querySelector('.ril-image-current');
        image.classList.add('in');
      } catch (e) {
        const image = document.querySelector('.ril-image-current');
        if (image && image.classList) {
          image.classList.add('in');
        }
        return;
      }
    }, 150);
  };

  render() {
    const css = require('./Attachments.scss');
    const { photoIndex, isOpen } = this.state;
    const { attachments } = this.props;
    const nextImageIndex = this.getAttachmentsNextImageIndex;
    const prevImageIndex = this.getAttachmentsPrevImageIndex;
    let nextSrc = '';
    let prevSrc = '';
    let mainSrc = '';

    if (attachments.length) {
      mainSrc = attachments[photoIndex].path;
      nextSrc =
        attachments[nextImageIndex((photoIndex + 1) % attachments.length)].path !== mainSrc
          ? attachments[nextImageIndex((photoIndex + 1) % attachments.length)].path
          : undefined;
      prevSrc =
        attachments[prevImageIndex((photoIndex + attachments.length - 1) % attachments.length)].path !== mainSrc
          ? attachments[prevImageIndex((photoIndex + attachments.length - 1) % attachments.length)].path
          : undefined;
    }

    return (
      <div className={css.attachments}>
        <ul className={css.attachmentsContainer}>
          {attachments.map((file, index) => this.getAttachment(file, index))}
          {this.props.canEdit ? <FileUpload onDrop={this.onDrop} /> : null}
        </ul>
        {isOpen && (
          <Lightbox
            mainSrc={`/${mainSrc}`}
            nextSrc={nextSrc}
            prevSrc={prevSrc}
            onCloseRequest={this.closeImage}
            onMovePrevRequest={this.prevImage}
            onMoveNextRequest={this.nextImage}
            onImageLoad={this.handleImageLoad}
          />
        )}
      </div>
    );
  }
}

Attachments.propTypes = {
  attachments: PropTypes.array,
  canEdit: PropTypes.bool,
  lang: PropTypes.string,
  removeAttachment: PropTypes.func,
  showNotification: PropTypes.func,
  uploadAttachments: PropTypes.func
};
