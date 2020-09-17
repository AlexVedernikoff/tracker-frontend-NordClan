import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AttachedDocument from '../AttachedDocument';
import AttachedImage from '../AttachedImage';
import AttachDeletion from '../AttachDeletion';
import AttachUploading from '../AttachUploading';
import FileUpload from '../FileUpload';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import ConfirmModal from '../ConfirmModal';

const imageTypes = ['image' /*fallback for old attachments*/, 'image/jpeg', 'image/png', 'image/pjpeg'];
export const isImage = t => imageTypes.indexOf(t) !== -1;

export default class Attachments extends Component<any, any> {
  static defaultProps = {
    attachments: []
  };

  state = {
    photoIndex: 0,
    id: null,
    modalText: '',
    isConfirmDeleteOpen: false,
    isOpen: false
  };

  handleOpenConfirmDelete = (id, modalText) => {
    this.setState({
      isConfirmDeleteOpen: true,
      modalText,
      id
    });
  };

  handleCloseConfirmDelete = () => {
    this.setState({ isConfirmDeleteOpen: false });
  };

  handleRemove = () => {
    const { id } = this.state;
    this.handleCloseConfirmDelete();
    this.props.removeAttachment(id);
  };

  onDrop = acceptedFiles => {
    this.props.uploadAttachments(acceptedFiles);
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
      return <AttachDeletion key={`attached-deletion-${file.id}`} filename={file.fileName} />;
    }

    if (file.uploading) {
      return <AttachUploading key={`attached-uploading-${file.id}`} {...file} />;
    }

    if (isImage(file.type)) {
      return (
        <AttachedImage
          key={`attached-picture-${file.id}`}
          open={this.openImage}
          index={index}
          {...file}
          canEdit={this.props.canEdit}
          removeAttachment={this.props.removeAttachment}
          handleOpenConfirmDelete={this.handleOpenConfirmDelete}
          handleCloseConfirmDelete={this.handleCloseConfirmDelete}
        />
      );
    }

    return (
      <AttachedDocument
        key={`attached-document-${file.id}`}
        {...file}
        canEdit={this.props.canEdit}
        removeAttachment={this.props.removeAttachment}
        handleOpenConfirmDelete={this.handleOpenConfirmDelete}
        handleCloseConfirmDelete={this.handleCloseConfirmDelete}
      />
    );
  };

  handleImageLoad = () => {
    setTimeout(() => {
      try {
        const buttonIn = document.querySelector('.ril-zoom-in') as HTMLElement;
        const buttonOut = document.querySelector('.ril-zoom-out') as HTMLElement;
        buttonIn.click();
        buttonOut.click();
        const image = document.querySelector('.ril-image-current') as HTMLElement;
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
        <ConfirmModal
          key={this.props.id}
          isOpen={this.state.isConfirmDeleteOpen}
          contentLabel="modal"
          onRequestClose={this.handleCloseConfirmDelete}
          onConfirm={this.handleRemove}
          onCancel={this.handleCloseConfirmDelete}
          text={this.state.modalText}
        />
      </div>
    );
  }
}

(Attachments as any).propTypes = {
  attachments: PropTypes.array,
  canEdit: PropTypes.bool,
  removeAttachment: PropTypes.func,
  uploadAttachments: PropTypes.func
};
