import React, { Component } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './CreateProject.scss';
import { CreateProjectRequest } from '../../../actions/Project';
import Checkbox from '../../../components/Checkbox';
import Select from 'react-select';

class CreateProject extends Component {
  constructor (props) {
    super(props);
  }

  closeModal = event => {
    event.preventDefault();
    const { onRequestClose } = this.props;
    onRequestClose();
  };

  getPortfolios (portfolioName = '') {
    return axios
      .get(
        'api/portfolio/autocompleter',
        { params: { portfolioName } },
        { withCredentials: true }
      )
      .then(response => response.data)
      .then(portfolios => ({
        options: portfolios.map((portfolio, i) => ({
          label: portfolio.name,
          value: portfolio.id
        }))
      }));
  }

  render () {
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
        height: 350,
        maxHeight: '100%'
      }
    };

    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };

    const SelectAsync = Select.AsyncCreatable;

    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Modal"
        closeTimeoutMS={200}
        style={ReactModalStyles}
      >
        <form className={css.createProjectForm} onSubmit={this.props.onSubmit}>
          <label className={css.formField}>
            <Row>
              <Col xs={formLayout.firstCol} className={css.leftColumn}>
                <p>Название проекта:</p>
              </Col>
              <Col xs={formLayout.secondCol} className={css.rightColumn}>
                <Input
                  onChange={this.props.onChange}
                  name="projectName"
                  placeholder="Название проекта"
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={formLayout.firstCol} className={css.leftColumn}>
                <p>Префикс проекта:</p>
              </Col>
              <Col xs={formLayout.secondCol} className={css.rightColumn}>
                <Input
                  onChange={this.props.onChange}
                  name="projectPrefix"
                  placeholder="Префикс проекта"
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={formLayout.firstCol} className={css.leftColumn}>
                <p>Открыть страницу проекта</p>
              </Col>
              <Col xs={formLayout.secondCol} className={css.rightColumn}>
                <Checkbox
                  name="openProjectPage"
                  onChange={this.props.handleCheckBox}
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={formLayout.firstCol} className={css.leftColumn}>
                <p>Добавить проект в портфель</p>
              </Col>
              <Col xs={formLayout.secondCol} className={css.rightColumn}>
                <SelectAsync
                  promptTextCreator={label => `Создать портфель '${label}'`}
                  searchPromptText={'Введите название портфеля'}
                  multi={false}
                  ignoreCase
                  placeholder="Выберите портфель"
                  loadOptions={this.getPortfolios}
                  onChange={this.props.onPortfolioSelect}
                  value={this.props.selectedPortfolio}
                  className={css.selectPortfolio}
                />
              </Col>
            </Row>
          </label>
          <div className={css.buttonsContainer}>
            <Button
              text="Создать проект"
              type="green"
              style={{ width: '50%' }}
              onClick={this.props.onSubmit}
            />
            <Button
              text="Назад"
              type="primary"
              style={{ width: '50%' }}
              onClick={this.closeModal}
            />
          </div>
        </form>
      </ReactModal>
    );
  }
}

export default CreateProject;
