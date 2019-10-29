import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { API_URL } from '../../constants/Settings';
import Modal from '../../components/Modal';
import * as css from './UserPhotoModal.scss';
import localize from './UserPhotoModal.json';
import Button from '../../components/Button';

class UserPhotoModal extends Component {
  static propTypes = {
    changePhoto: PropTypes.func,
    closeModal: PropTypes.func,
    lang: PropTypes.string,
    user: PropTypes.shape({
      photo: PropTypes.string,
      id: PropTypes.number
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      currentPath: props.user.photo || '',
      wasUploaded: false
    };
  }

  handleDrop = acceptedFiles => {
    const [file] = acceptedFiles;
    if (file) {
      this.uploadAvatar(file);
    }
  };

  submitHandler = () => {
    this.props.changePhoto(this.state.currentPath);
    this.props.closeModal();
  };

  uploadAvatar = file => {
    const { id } = this.props.user;
    if (!this.state.isLoading) {
      this.setState({ isLoading: true, currentPath: '' });
      const data = new FormData();
      data.append('image', file);
      axios
        .post(`${API_URL}/user/${id}/avatar`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(res => {
          const { photo } = res.data;
          this.setState({ isLoading: false, currentPath: `${photo}?${new Date().getTime()}`, wasUploaded: true });
        })
        .catch(() => {
          this.setState({ isLoading: false });
        });
    }
  };

  deleteAvatar = () => {
    const { id, photo } = this.props.user;
    const canDelete = photo || this.state.currentPath;

    this.setState({ isLoading: false, currentPath: '', wasUploaded: false });
    this.props.changePhoto('');
    this.props.closeModal();
  };

  render() {
    const { lang, closeModal, user } = this.props;
    const { currentPath, isLoading, wasUploaded } = this.state;

    const canSubmit = !!currentPath && wasUploaded;
    const canDelete = !!(user && user.photo) || !!currentPath;

    const dropzoneStyle = {};
    if (currentPath) {
      dropzoneStyle.backgroundImage = `url(${currentPath})`;
      dropzoneStyle.outline = 'none';
      dropzoneStyle.borderRadius = '50%';
    }

    return (
      <Modal isOpen contentLabel="modal" onRequestClose={closeModal}>
        <div className={css.wrapper}>
          <h3>{localize[lang].HEADER}</h3>
          <Dropzone
            onDrop={this.handleDrop.bind(this)}
            style={{ width: 'auto', height: 'auto', border: 'none' }}
            multiple={false}
            accept="image/jpeg"
          >
            <div className={css.dropzone} style={dropzoneStyle}>
              {!currentPath && <span className={css.dropzoneText}>{localize[lang].DOWNLOAD_TEXT}</span>}
            </div>
          </Dropzone>
          <div className={css.footer}>
            {canSubmit && (
              <Button
                onClick={this.submitHandler}
                text={localize[lang].SUBMIT_TEXT}
                type="primary"
                loading={isLoading}
              />
            )}
            {canSubmit && canDelete && <div className={css.separator}>{localize[lang].OR_TEXT}</div>}
            {canDelete && (
              <Button
                onClick={this.deleteAvatar}
                text={localize[lang].DELETE_TEXT}
                type="red-bordered"
                loading={isLoading}
              />
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(UserPhotoModal);
