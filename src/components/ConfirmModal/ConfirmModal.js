import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Button from '../Button';
import { ENTER } from '../../constants/KeyCodes';
import * as css from './ConfirmModal.scss';
import cssVariables from '!!sass-variable-loader!../../styles/variables.scss';
import localize from './ConfirmModal.json';

const ReactModalStyles = {
  overlay: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    padding: '1rem',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(43, 62, 80, 0.8)',
    zIndex: cssVariables.zModalLayer,
    overflow: 'auto'
  },
  content: {
    position: 'relative',
    top: 'initial',
    bottom: 'initial',
    left: 'initial',
    right: 'initial',
    boxSizing: 'border-box',
    border: 'none',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: 0,
    outline: 'none',
    padding: 0,
    width: '100%',
    maxWidth: 320,
    maxHeight: '100%'
  }
};

class ConfirmModal extends Component {
  componentDidMount() {
    // There are 2 ways of using Modal component.
    // Whether it's shown or not can be controlled by isOpen prop or via
    // conditional rendering of the whole component.
    // That's why key press event listener is added depending on condition
    // either in cdm or cdu.
    if (this.props.isOpen) {
      this.addKeyPressListener();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpen !== this.props.isOpen) {
      if (this.props.isOpen) {
        this.addKeyPressListener();
      } else {
        this.removeKeyPressListener();
      }
    }
  }

  componentWillUnmount() {
    this.removeKeyPressListener();
  }

  addKeyPressListener = () => {
    document.addEventListener('keypress', this.handleKeyPress);
  };

  removeKeyPressListener = () => {
    document.removeEventListener('keypress', this.handleKeyPress);
  };

  handleKeyPress = event => {
    if (event.keyCode === ENTER) {
      const { notification, onConfirm, onCancel } = this.props;

      if (notification) {
        onCancel();
      } else {
        onConfirm();
      }
    }
  };

  render() {
    const { style, closeTimeoutMS, text, onConfirm, onCancel, notification, lang, ...other } = this.props;

    return (
      <ReactModal
        {...other}
        onRequestClose={onCancel}
        style={style || ReactModalStyles}
        closeTimeoutMS={200 || closeTimeoutMS}
      >
        <div className={css.container}>
          <h3 style={{ margin: 0 }}>{text}</h3>
        </div>
        {notification ? (
          <div>
            <Button text={localize[lang].CANCEL} type="primary" style={{ width: '100%' }} onClick={onCancel} />
          </div>
        ) : (
          <div>
            <Button text={localize[lang].OK} type="green" style={{ width: '50%' }} onClick={onConfirm} />
            <Button text={localize[lang].CANCEL} type="primary" style={{ width: '50%' }} onClick={onCancel} />
          </div>
        )}
      </ReactModal>
    );
  }
}

ConfirmModal.propTypes = {
  closeTimeoutMS: PropTypes.number,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  style: PropTypes.object,
  text: PropTypes.string
};

export default ConfirmModal;
