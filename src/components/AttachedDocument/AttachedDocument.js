import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import {
  IconFileDocument,
  IconFilePdf,
  IconDelete,
  IconDownload,
  IconPlus,
  IconEye
} from "../Icons";

export default class AttachedDocument extends React.Component {
  constructor(props) {
    super(props);
  }

  stopBubbling() {
    e.stopPropagation();
  }

  render() {
    const css = require("./AttachedDocument.scss");

    const iconStyles = {
      width: 24,
      height: 24,
      color: "inherit",
      fill: "currentColor"
    };

    const { fileName, filePath, fileType } = this.props;

    return (
      <li className={css.attachment}>
        <div className={css.actions}>
          <a href={`${filePath}`} onClick={this.stopBubbling} download>
            <button>
              <IconDownload style={iconStyles} />
            </button>
          </a>
          <Link to={`${filePath}`}>
            <button>
              <IconDelete style={iconStyles} />
            </button>
          </Link>
        </div>
        <a target="_blank" href={`${filePath}`}>
          <div className={css.attachmentIcon}>
            {fileType === "pdf"
              ? <IconFilePdf style={iconStyles} />
              : <IconFileDocument style={iconStyles} />}
          </div>
          <div className={css.attachmentName}>
            {fileName}
          </div>
        </a>
      </li>
    );
  }
}

AttachedDocument.PropTypes = {
  fileType: PropTypes.string,
  filePath: PropTypes.string,
  fileName: PropTypes.string
};
