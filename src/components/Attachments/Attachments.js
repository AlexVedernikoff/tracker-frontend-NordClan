import React, { PropTypes } from "react";
import { Link } from "react-router";
import AttachedFile from "../AttachedFile";
import {
  IconFileDocument,
  IconFilePdf,
  IconDelete,
  IconDownload,
  IconPlus,
  IconEye
} from "../Icons";
import { files } from "../../../mocks/Files";

export default class Attachments extends React.Component {
  render() {
    const css = require("./Attachments.scss");

    const iconStyles = {
      width: 24,
      height: 24,
      color: "inherit",
      fill: "currentColor"
    };

    return (
      <div className={css.attachments}>
        <ul className={css.attachmentsContainer}>

          {files.map((file, index) => {
            return (
              <AttachedFile
                key={index}
                fileType={file.fileType}
                fileName={file.fileName}
                filePath={file.filePath}
              />
            );
          })}

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
