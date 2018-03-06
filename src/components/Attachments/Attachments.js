import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AttachedDocument from '../AttachedDocument';
import AttachedImage from '../AttachedImage';
import AttachDeletion from '../AttachDeletion';
import AttachUploading from '../AttachUploading';
import FileUpload from '../FileUpload';

export default class Attachments extends Component {
  static defaultProps = {
    attachments: []
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.props.uploadAttachments(acceptedFiles);
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
          {...file}
          canEdit={this.props.canEdit}
          removeAttachment={this.props.removeAttachment}
        />
      );
    }

    return (
      <AttachedDocument key={`attached-document-${index}`} {...file} removeAttachment={this.props.removeAttachment} />
    );
  };

  render() {
    const css = require('./Attachments.scss');

    return (
      <div className={css.attachments}>
        <ul className={css.attachmentsContainer}>
          {this.props.attachments.map((file, index) => this.getAttachment(file, index))}
          {this.props.canEdit ? <FileUpload onDrop={this.onDrop} /> : null}
        </ul>
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
