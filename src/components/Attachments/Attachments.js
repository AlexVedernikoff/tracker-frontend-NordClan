import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import AttachedDocument from "../AttachedDocument";
import AttachedImage from "../AttachedImage";
import {
  IconFileDocument,
  IconFilePdf,
  IconDelete,
  IconDownload,
  IconPlus,
  IconEye
} from "../Icons";
import { files } from "../../../mocks/Files";
import _ from "lodash";

export default class Attachments extends React.Component {
  isPicture(fileType) {
    const regexp = /(gif|jpe?g|tiff|png)/i;
    return regexp.test(fileType);
  }

  render() {
    const css = require("./Attachments.scss");
    const files_shuffled = _.shuffle(files);

    const iconStyles = {
      width: 24,
      height: 24,
      color: "inherit",
      fill: "currentColor"
    };

    return (
      <div className={css.attachments}>
        <ul className={css.attachmentsContainer}>

          {files_shuffled.map((file, index) => {
            return this.isPicture(file.fileType)
              ? <AttachedImage key={`attached-document-${index}`} {...file} />
              : <AttachedDocument key={`attached-picture-${index}`} {...file} />;
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
