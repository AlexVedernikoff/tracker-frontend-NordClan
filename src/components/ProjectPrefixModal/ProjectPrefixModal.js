import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import classnames from 'classnames';
import Input from '../../components/Input';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Button from '../Button';
import * as css from './ProjectPrefixModal.scss';
import cssVariables from '!!sass-variable-loader!../../styles/variables.scss';
import { getErrorMessageByType } from '../../utils/ErrorMessages';

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
    maxWidth: 400,
    maxHeight: '100%'
  }
};

const iconStyles = {
  width: 24,
  height: 24,
  color: 'inherit',
  fill: 'currentColor'
};

class ProjectPrefixModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prefix: ''
    };
  }
  getFieldError = fieldName => {
    const errorsArr = this.props.error
      ? this.props.error.message.errors.filter(error => error.param === fieldName)
      : [];

    if (errorsArr.length) {
      return getErrorMessageByType(errorsArr[0].type);
    }

    return null;
  };
  onPrefixInputChange = e => this.setState({ prefix: e.target.value });

  render() {
    const { style, onRequestClose, closeTimeoutMS, text, onConfirm, onCancel, ...other } = this.props;
    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };
    return (
      <ReactModal
        {...other}
        onRequestClose={onCancel}
        style={style || ReactModalStyles}
        closeTimeoutMS={200 || closeTimeoutMS}
      >
        <div className={css.container}>
          <h3 style={{ margin: 0 }}>{text}</h3>
          <hr />
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Префикс проекта:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input placeholder="Префикс проекта" onChange={this.onPrefixInputChange} />
              </Col>
            </Row>
          </label>
          <p style={{ color: 'red' }}>{this.getFieldError('prefix')}</p>
        </div>
        <Button
          text="ОК"
          type="green"
          style={{ width: '50%' }}
          onClick={onConfirm(this.state.prefix)}
          disabled={this.state.prefix.length < 2}
        />
        <Button text="Вернуться в &quot;Мои проекты&quot;" type="primary" style={{ width: '50%' }} onClick={onCancel} />
      </ReactModal>
    );
  }
}

ProjectPrefixModal.propTypes = {
  closeTimeoutMS: PropTypes.number,
  error: PropTypes.object,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onRequestClose: PropTypes.func,
  style: PropTypes.object,
  text: PropTypes.string
};

export default ProjectPrefixModal;
