import React, { Component } from 'react';
import ReactModal from 'react-modal';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

class CreateProject extends Component {
  constructor (props) {
    super(props);
    this.state = {
      projectName: ''
    };
  }

  handleChange = event => {
    const { target } = event;
    const { name } = event.target;
    this.setState({
      [name]: target.value
    });
  };

  closeModal = event => {
    event.preventDefault();
    const { onRequestClose } = this.props;
    this.setState({projectName: ''});
    onRequestClose();
  };

  render () {
    const css = require('./CreateProject.scss');

    const { isOpen, onRequestClose } = this.props;
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
        width: 500,
        height: 800,
        maxHeight: '100%'
      }
    };

    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Modal"
        closeTimeoutMS={200}
        style={ReactModalStyles}
      >
        <form className={css.createProjectForm}>
          <label>
            <Row>
              <Col xs={4} className={css['col-xs-4']}>
                <p>Название проекта:</p>
              </Col>
              <Col xs={8}>
                <Input
                  onChange={this.handleChange}
                  name="projectName"
                  placeholder="Название проекта"
                />
              </Col>
            </Row>
          </label>
          <Button text="Создать проект" type="green" style={{ width: '50%' }} />
          <Button
            text="Назад"
            type="primary"
            style={{ width: '50%' }}
            onClick={this.closeModal}
          />
        </form>
      </ReactModal>
    );
  }
}

export default CreateProject;
