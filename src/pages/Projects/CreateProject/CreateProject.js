import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_URL } from '../../../constants/Settings';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import ValidatedInput from '../../../components/ValidatedInput';
import Validator from '../../../components/ValidatedInput/Validator';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './CreateProject.scss';
import Checkbox from '../../../components/Checkbox';
import ErrorText from '../../../components/ErrorText';
import Select from 'react-select';

class CreateProject extends Component {
  constructor (props) {
    super(props);

    this.validator = new Validator();
  }

  getPortfolios (name = '') {
    return axios
      .get(
        `${API_URL}/portfolio`,
        { params: { name } },
        { withCredentials: true }
      )
      .then(response => response.data.data)
      .then(portfolios => ({
        options: portfolios.map((portfolio) => ({
          label: portfolio.name,
          value: portfolio.id
        }))
      }));
  }

  render () {
    const { isOpen, onRequestClose, projectError } = this.props;

    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };

    const SelectAsync = Select.AsyncCreatable;

    const errorMessage = projectError ? <ErrorText message={projectError.message}/> : null;

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Modal"
      >
        <form className={css.createProjectForm} onSubmit={this.props.onSubmit}>
          <h3 className={css.header}>Создать проект</h3>
          <hr/>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Название проекта:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedInput
                      autoFocus
                      onChange={this.props.onChange}
                      name="projectName"
                      placeholder="Название проекта"
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText="Длина менее 4 символов"
                    />
                  ),
                  'projectName',
                  !this.props.validateProjectName
                )}
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Префикс проекта:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedInput
                      onChange={this.props.onChange}
                      name="projectPrefix"
                      placeholder="Префикс проекта"
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText="Длина менее 2 символов"
                    />
                  ),
                  'projectPrefix',
                  !this.props.validateProjectPrefix
                )}
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Добавить проект в портфель</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <SelectAsync
                  promptTextCreator={label => `Создать портфель '${label}'`}
                  searchPromptText={'Введите название портфеля'}
                  multi={false}
                  ignoreCase={false}
                  placeholder="Выберите портфель"
                  loadOptions={this.getPortfolios}
                  filterOption={el=>el}
                  onChange={this.props.onPortfolioSelect}
                  value={this.props.selectedPortfolio}
                  className={css.selectPortfolio}
                />
              </Col>
            </Row>
          </label>
          {/* <label className={css.formField}>
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
          </label> */}
          <div className={css.buttonsContainer}>
            {errorMessage}
            <Button
              text="Создать проект"
              htmlType="submit"
              type="green"
              onClick={this.props.onSubmit}
              disabled = {!(this.props.validateProjectName && this.props.validateProjectPrefix)}
            />
            <Button
              text="Создать и открыть"
              htmlType="button"
              type="green-lighten"
              onClick={this.props.onSubmitAndOpen}
              disabled = {!(this.props.validateProjectName && this.props.validateProjectPrefix)}              
            />
          </div>
        </form>
      </Modal>
    );
  }
}

CreateProject.propTypes = {
  handleCheckBox: PropTypes.func,
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onPortfolioSelect: PropTypes.func,
  onRequestClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitAndOpen: PropTypes.func,
  projectError: PropTypes.object,
  selectedPortfolio: PropTypes.object
};

export default CreateProject;
