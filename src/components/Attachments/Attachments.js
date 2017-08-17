import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AttachedDocument from '../AttachedDocument';
import AttachedImage from '../AttachedImage';
import FileUpload from '../FileUpload';

export default class Attachments extends Component {
  static defaultProps = {
    attachments: []
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.props.uploadAttachments(acceptedFiles);
  };

  render () {
    const css = require('./Attachments.scss');

    return (
      <div className={css.attachments}>
        <ul className={css.attachmentsContainer}>

          {this.props.attachments.map((file, index) => {
            return file.type === 'image'
              ? <AttachedImage key={`attached-document-${index}`} {...file} removeAttachment={this.props.removeAttachment} />
              : <AttachedDocument
                  key={`attached-picture-${index}`}
                  {...file}
                  removeAttachment={this.props.removeAttachment}
              />;
          })}

          <FileUpload onDrop={this.onDrop} />
        </ul>
      </div>
    );
  }
}

Attachments.propTypes = {
  attachments: PropTypes.array,
  removeAttachment: PropTypes.func.isRequired,
  uploadAttachments: PropTypes.func.isRequired
};
