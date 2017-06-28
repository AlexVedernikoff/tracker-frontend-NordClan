import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import classnames from 'classnames';
import * as css from './Modal.scss';
import { IconClose } from '../Icons';

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
    zIndex: 2,
    overflow: 'visible'
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
    overflow: 'visible',
    WebkitOverflowScrolling: 'touch',
    borderRadius: 0,
    outline: 'none',
    padding: 0,
    maxWidth: '100%',
    maxHeight: '100%'
  }
};

const iconStyles = {
  width: 24,
  height: 24,
  color: 'inherit',
  fill: 'currentColor'
};

const Modal = (props) => {

  const {
    children,
    style,
    onRequestClose,
    closeTimeoutMS,
    ...other
  } = props;

  return (
    <ReactModal {...other} onRequestClose={onRequestClose} style={style || ReactModalStyles} closeTimeoutMS={200 || closeTimeoutMS}>
      <IconClose
        style={iconStyles}
        className={css.iconClose}
        onClick={onRequestClose}
      />
      <div className={css.container}>
        {children}
      </div>
    </ReactModal>
  );
};

Modal.propTypes = {
  children: PropTypes.object,
  closeTimeoutMS: PropTypes.number,
  onRequestClose: PropTypes.func,
  style: PropTypes.object
};

export default Modal;
