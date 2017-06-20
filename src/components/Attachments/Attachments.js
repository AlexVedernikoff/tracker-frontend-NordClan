import React from "react";
import PropTypes from "prop-types";
import AttachedDocument from "../AttachedDocument";
import AttachedImage from "../AttachedImage";
import FileUpload from "../FileUpload";
import { files } from "../../../mocks/Files";
import _ from "lodash";

export default class Attachments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: files
    };
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log(acceptedFiles);
  }

  isPicture(fileType) {
    const regexp = /(gif|jpe?g|tiff|png)/i;
    return regexp.test(fileType);
  }

  render() {
    const css = require("./Attachments.scss");
    const filesShuffled = _.shuffle(files);

    const iconStyles = {
      width: 24,
      height: 24,
      color: "inherit",
      fill: "currentColor"
    };

    return (
      <div className={css.attachments}>
        <ul className={css.attachmentsContainer}>

          {this.state.files.map((file, index) => {
            return this.isPicture(file.fileType)
              ? <AttachedImage key={`attached-document-${index}`} {...file} />
              : <AttachedDocument key={`attached-picture-${index}`} {...file} />;
          })}

          <FileUpload onDrop={this.onDrop} />
        </ul>
      </div>
    );
  }
}

Attachments.propTypes = {
  // task: PropTypes.object
};
