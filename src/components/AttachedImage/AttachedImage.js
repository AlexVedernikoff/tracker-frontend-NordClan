import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { IconDelete, IconDownload, IconClose } from "../Icons";
import ReactModal from "react-modal";
import ConfirmDelete from "react-modal";

const ReactModalStyles = {
  content: {
    left: "260px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  overlay: {
    zIndex: 5
  }
};

export default class AttachedImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isConfirmDeleteOpen: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ isModalOpen: true });
  }

  handleCloseModal() {
    this.setState({ isModalOpen: false });
  }

  stopBubbling(e) {
    e.stopPropagation();
  }

  render() {
    const css = require("./AttachedImage.scss");

    const iconStyles = {
      width: 24,
      height: 24,
      color: "inherit",
      fill: "currentColor"
    };

    const imageStyles = {
      maxHeight: 830
    };

    const { fileName, filePath, fileType } = this.props;

    return (
      <li className={css.attachment} onClick={this.handleOpenModal}>
        <div className={css.actions}>
          <a
            target="_blank"
            href={filePath}
            onClick={this.stopBubbling}
            download
          >
            <button>
              <IconDownload style={iconStyles} />
            </button>
          </a>
          <Link to={filePath}>
            <button>
              <IconDelete style={iconStyles} />
            </button>
          </Link>
        </div>
        <div className={css.attachmentIcon}>
          <img src={filePath} alt="" className={css.screen} />
        </div>
        <div className={css.attachmentName}>
          {fileName}
        </div>

        <ReactModal
          isOpen={this.state.isModalOpen}
          contentLabel="Minimal Modal Example"
          style={ReactModalStyles}
          onRequestClose={this.handleCloseModal}
        >
          <IconClose
            style={iconStyles}
            className={css.iconClose}
            onClick={this.handleCloseModal}
          />
          <img src={filePath} alt="" style={imageStyles} />
        </ReactModal>

      </li>
    );
  }
}

AttachedImage.PropTypes = {
  fileType: PropTypes.string,
  filePath: PropTypes.string,
  fileName: PropTypes.string
};
