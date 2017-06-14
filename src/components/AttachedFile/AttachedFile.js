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
import FileViewer from "react-file-viewer";
import ReactModal from "react-modal";

ReactModal.defaultStyles.content.left = "260px";

export default class AttachedFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };

    this.handleModal = this.handleModal.bind(this);
  }

  handleModal() {
    console.log("setting modal state");
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  render() {
    const css = require("./AttachedFile.scss");

    const iconStyles = {
      width: 24,
      height: 24,
      color: "inherit",
      fill: "currentColor"
    };

    const { fileName, filePath, fileType } = this.props;

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
        </Link>
        <div className={css.attachmentName} onClick={this.handleModal}>
          {fileName}
        </div>

        <ReactModal
          isOpen={this.state.isModalOpen}
          contentLabel="Minimal Modal Example"
        >
          <button onClick={this.handleModal}>Close Modal</button>
        </ReactModal>
      </li>
    );
  }
}
