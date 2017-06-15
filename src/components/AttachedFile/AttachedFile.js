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
      <li className={css.attachment} onClick={this.handleModal}>
        <div className={css.attachmentIcon}>
          <IconFilePdf style={iconStyles} />
          <div className={css.actions}>
            <Link to="#">
              <button>
                <IconDownload style={iconStyles} />
              </button>
            </Link>
            <Link to="#">
              <button>
                <IconDelete style={iconStyles} />
              </button>
            </Link>
          </div>
        </div>
        <div className={css.attachmentName}>
          {fileName}
        </div>

        <ReactModal
          isOpen={this.state.isModalOpen}
          contentLabel="Minimal Modal Example"
        >
          <button onClick={this.handleModal}>Close Modal</button>
          <FileViewer fileType={fileType} filePath={filePath} />
        </ReactModal>
      </li>
    );
  }
}

AttachedFile.PropTypes = {
  fileType: PropTypes.string,
  filePath: PropTypes.string,
  fileName: PropTypes.string
};
