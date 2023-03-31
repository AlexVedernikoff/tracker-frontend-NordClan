import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { API_URL } from '../../constants/Settings';
import Modal from '../../components/Modal';
import css from './UserPhotoModal.scss';
import localize from './UserPhotoModal.json';
import Button from '../../components/Button';

class UserPhotoModal extends Component<any, any> {
  static propTypes = {
    changePhoto: Promise<void>,
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
      currentPath: props.user.photo || ''
    };
  }

  handleDrop = acceptedFiles => {
    const [file] = acceptedFiles;
    if (file) {
      this.uploadAvatar(file);
    }
  };

  uploadAvatar = async file => {
    const { id } = this.props.user;
    if (!this.state.isLoading) {
      this.setState({ isLoading: true, currentPath: '' });
      const data = new FormData();
      data.append('image', file);
      try {
        const res = await axios.post(`${API_URL}/user/${id}/avatar`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

        const photo = `${res.data.photo}?${new Date().getTime()}`;
        await this.props.changePhoto(photo);
        this.setState({ isLoading: false, currentPath: photo });
        this.props.closeModal();
      } catch {
        this.setState({ isLoading: false });
      }
    }
  };

  deleteAvatar = async () => {
    await this.props.changePhoto('');
    this.setState({ isLoading: false, currentPath: '' });
    this.props.closeModal();
  };

  render() {
    const { lang, closeModal, user } = this.props;
    const { currentPath, isLoading } = this.state;
    const canDelete = !!(user && user.photo) || !!currentPath;

    const dropzoneStyle: any = {};
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
