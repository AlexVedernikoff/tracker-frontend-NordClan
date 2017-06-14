import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { IconFileDocument, IconFilePdf, IconDelete, IconDownload, IconPlus, IconEye } from '../Icons';
import FileViewer from "react-file-viewer";

export default class AttachedFile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  render() {

    const css = require('./AttachedFile.scss');

    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    const {
      fileName,
      filePath,
      fileType
    } = this.props;

    return (
      <li className={css.attachment}>
        <Link to="#">
          <div className={css.attachmentIcon}>
            <IconFilePdf style={iconStyles} />
            <div className={css.actions}>
              <button>
                <IconDownload style={iconStyles} />
              </button>
              <button>
                <IconDelete style={iconStyles} />
              </button>
            </div>
          </div>
          <div className={css.attachmentName}>{fileName}</div>
        </Link>
      </li>
    )
  }

}
