import React from "react";
import { IconPlus } from "../Icons";
import Dropzone from "react-dropzone";

export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    }

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(acceptedFiles, rejectedFiles) {
    console.log(acceptedFiles);
  }

  render() {
    const css = require("./FileUpload.scss");

    const iconStyles = {
      width: 24,
      height: 24,
      color: "inherit",
      fill: "currentColor"
    };

    return (
      <Dropzone onDrop={this.onDrop} style={{}}>
        <li className={css.attachment}>
          <div className={css.attachmentIcon}>
            <IconPlus style={iconStyles} />
          </div>
          <div className={css.attachmentName}>Добавить файл</div>
        </li>
      </Dropzone>
    );
  }
}
