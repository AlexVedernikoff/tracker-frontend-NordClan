import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { IconDelete, IconDownload, IconPlus, IconEye } from "../Icons";
import ReactModal from "react-modal";

ReactModal.defaultStyles.content.left = "260px";

export default class AttachedImage extends React.Component {
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
      width: "80%",
      height: "80%"
    };

    const { fileName, filePath, fileType } = this.props;

    return (
      <li className={css.attachment} onClick={this.handleModal}>
        <div className={css.actions}>
          <a
            target="_blank"
            href={`${filePath}`}
            onClick={this.stopBubbling}
            download
          >
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
        <div className={css.attachmentIcon}>
          <img src={`${filePath}`} alt="" className={css.screen} />
        </div>
        <div className={css.attachmentName}>
          {fileName}
        </div>
        <ReactModal
          isOpen={this.state.isModalOpen}
          contentLabel="Minimal Modal Example"
        >
          <button onClick={this.handleModal}>Close Modal</button>
          <img src={`${filePath}`} alt="" style={imageStyles} />
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
