import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import * as timesheetsActions from '../../../actions/Timesheets';

import i18n from './i18n.json';
import * as css from './index.scss';

class ForceSubmitConfirmationModal extends Component {
  static propTypes = {
    cancelSubmitTimesheetsConfirmation: PropTypes.func,
    dateBegin: PropTypes.string,
    fetching: PropTypes.bool,
    lang: PropTypes.string,
    submitTimesheets: PropTypes.func,
    visible: PropTypes.bool
  };

  onCancel = () => this.props.cancelSubmitTimesheetsConfirmation();
  onSubmit = () => !this.props.fetching && this.props.submitTimesheets(this.props.dateBegin, true);

  render() {
    const locale = i18n[this.props.lang];

    return (
      <Modal isOpen={this.props.visible} onRequestClose={this.onCancel} contentLabel="Modal">
        <div className={css.ForceSubmitConfirmationModal}>
          <h3>{locale.TEXT}</h3>
          <div className={css.ForceSubmitConfirmationModal__footer}>
            <Button text={locale.YES} onClick={this.onSubmit} loading={this.props.fetching} />
            <Button text={locale.NO} type="green" onClick={this.onCancel} />
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  fetching: !!state.Timesheets.submittingTimesheets.fetching,
  visible: state.Timesheets.submittingTimesheets.needForceConfirmation,
  dateBegin: state.Timesheets.dateBegin,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  submitTimesheets: timesheetsActions.submitTimesheets,
  cancelSubmitTimesheetsConfirmation: timesheetsActions.cancelSubmitTimesheetsConfirmation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForceSubmitConfirmationModal);
