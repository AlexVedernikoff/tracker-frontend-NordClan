import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import AttachedFile from "../AttachedFile"
import { IconFileDocument, IconFilePdf, IconDelete, IconDownload, IconPlus, IconEye } from '../Icons';
import FileViewer from "react-file-viewer";

export default class Attachments extends React.Component {

  render () {
    const css = require('./Attachments.scss');

    const iconStyles = {
      width: 24,
      height: 24,
      color: 'inherit',
      fill: 'currentColor'
    };

    // MOCKS

    const files = [
      {
        fileType: "pdf",
        fileName: "sample-file.pdf"
      },
      {
        fileType: "docx",
        fileName: "sample-file.docx"
      },
      {
        fileType: "jpg",
        fileName: "sample-file.jpg"
      }
    ]

    return (
      <div className={css.attachments}>
        <ul className={css.attachmentsContainer}>

          {
            files.map((file, index) => {
              return <AttachedFile key={index} fileName={file.fileName} />
            })
          }

          {/* TODO:: FILE UPLOAD Component */}

          <li className={css.attachment}>
            <Link to="#">
              <div className={css.attachmentIcon}>
                <IconPlus style={iconStyles} />
              </div>
              <div className={css.attachmentName}>Добавить файл</div>
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

Attachments.propTypes = {
  // task: PropTypes.object
};
