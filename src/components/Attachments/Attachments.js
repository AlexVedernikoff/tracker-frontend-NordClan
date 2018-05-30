import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AttachedDocument from '../AttachedDocument';
import AttachedImage from '../AttachedImage';
import AttachDeletion from '../AttachDeletion';
import AttachUploading from '../AttachUploading';
import FileUpload from '../FileUpload';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export default class Attachments extends Component {
  static defaultProps = {
    attachments: []
  };

  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
      isOpen: false
    };
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.props.uploadAttachments(acceptedFiles);
  };

  getAttachmentsNextImageIndex = index => {
    for (let i = index; i < this.props.attachments.length; i++) {
      const file = this.props.attachments[i];
      if (file && file.type === 'image') {
        return i;
      }
    }

    return this.getAttachmentsNextImageIndex(0) ? this.getAttachmentsPrevImageIndex(0) : 0;
  };

  getAttachmentsPrevImageIndex = index => {
    for (let i = index; i >= 0; i--) {
      const file = this.props.attachments[i];
      if (file && file.type === 'image') {
        return i;
      }
    }

    return this.getAttachmentsPrevImageIndex(this.props.attachments.length - 1)
      ? this.getAttachmentsPrevImageIndex(this.props.attachments.length - 1)
      : 0;
  };

  openImage = index => {
    this.setState({ isOpen: true, photoIndex: index });
  };

  getAttachment = (file, index) => {
    if (file.deleting) {
      return <AttachDeletion key={`attached-deletion-${index}`} filename={file.fileName} />;
    }

    if (file.uploading) {
      return <AttachUploading key={`attached-uploading-${index}`} {...file} />;
    }

    if (file.type === 'image') {
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

  render() {
    const css = require('./Attachments.scss');
    const { photoIndex, isOpen } = this.state;
    const { attachments } = this.props;
    const nextImageIndex = this.getAttachmentsNextImageIndex;
    const prevImageIndex = this.getAttachmentsPrevImageIndex;

    return (
      <div className={css.attachments}>
        <ul className={css.attachmentsContainer}>
          {attachments.map((file, index) => this.getAttachment(file, index))}
          {this.props.canEdit ? <FileUpload onDrop={this.onDrop} /> : null}
        </ul>
        {isOpen && (
          <Lightbox
            mainSrc={'/' + attachments[photoIndex].path}
            nextSrc={'/' + attachments[nextImageIndex((photoIndex + 1) % attachments.length)].path}
            prevSrc={'/' + attachments[prevImageIndex((photoIndex + attachments.length - 1) % attachments.length)].path}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: prevImageIndex((photoIndex + attachments.length - 1) % attachments.length)
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: nextImageIndex((photoIndex + 1) % attachments.length)
              })
            }
          />
        )}
      </div>
    );
  }
}

Attachments.propTypes = {
  attachments: PropTypes.array,
  canEdit: PropTypes.bool,
  removeAttachment: PropTypes.func.isRequired,
  uploadAttachments: PropTypes.func.isRequired
};
