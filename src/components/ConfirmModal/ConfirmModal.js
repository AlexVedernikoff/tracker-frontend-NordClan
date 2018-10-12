import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Button from '../Button';
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

const ConfirmModal = props => {
  const { style, onRequestClose, closeTimeoutMS, text, onConfirm, onCancel, notification, lang, ...other } = props;
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
};

ConfirmModal.propTypes = {
  closeTimeoutMS: PropTypes.number,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onRequestClose: PropTypes.func,
  style: PropTypes.object,
  text: PropTypes.string
};

export default ConfirmModal;
