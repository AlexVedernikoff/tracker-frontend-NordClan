import React, { Component } from 'react';
import { IconRefresh } from '../../../../../components/Icons';
import ConfirmModal from '../../../../../components/ConfirmModal';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import * as css from './ExternalUserRefreshLink.scss';

class ExternalUserRefreshLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  openConfirmModal = () => {
    this.setState({ isModalOpen: true });
  };
  closeConfirmModal = () => {
    this.setState({ isModalOpen: false });
  };
  confirmRefreshLink = () => {
    this.setState({ isModalOpen: false }, () => {
      this.props.onConfirm();
    });
  };
  render() {
    const { dataTip, text } = this.props;
    return (
      <div>
        <IconRefresh onClick={this.openConfirmModal} data-tip={dataTip} className={css.refreshIcon} />
        <ConfirmModal
          isOpen={this.state.isModalOpen}
          contentLabel="modal"
          text={`${text} ${this.props.username}?`}
          onCancel={this.closeConfirmModal}
          onConfirm={this.confirmRefreshLink}
          onRequestClose={this.closeConfirmModal}
        />
      </div>
    );
  }
}
ExternalUserRefreshLink.propTypes = {
  dataTip: PropTypes.string,
  onConfirm: PropTypes.func,
  text: PropTypes.string,
  username: PropTypes.string
};
export default ExternalUserRefreshLink;
