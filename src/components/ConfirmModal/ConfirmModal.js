import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import classnames from 'classnames';
import Button from '../Button';
import * as css from './ConfirmModal.scss';
import cssVariables from '!!sass-variable-loader!../../styles/variables.scss';

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

const iconStyles = {
  width: 24,
  height: 24,
  color: 'inherit',
  fill: 'currentColor'
};

const ConfirmModal = props => {
  const {
    style,
    onRequestClose,
    closeTimeoutMS,
    text,
    onConfirm,
    onCancel,
    ...other
  } = props;

  return (
    <ReactModal
      {...other}
      onRequestClose={onRequestClose}
      style={style || ReactModalStyles}
      closeTimeoutMS={200 || closeTimeoutMS}
    >
      <div className={css.container}>
        <h3 style={{ margin: 0 }}>
          {text}
        </h3>
      </div>
      <Button
        text="ОК"
        type="green"
        style={{ width: '50%' }}
        onClick={onConfirm}
      />
      <Button
        text="Отмена"
        type="primary"
        style={{ width: '50%' }}
        onClick={onCancel}
      />
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
