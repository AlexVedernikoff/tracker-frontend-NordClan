import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import ValidatedInput from '../../../components/ValidatedInput';
import Validator from '../../../components/ValidatedInput/Validator';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './CreateProject.scss';
import Select from 'react-select';
import getPortfolios from '../../../utils/getPortfolios';

class CreateProject extends Component {
  constructor(props) {
    super(props);

    this.validator = new Validator();
  }

  render() {
    const { isOpen, onRequestClose, prefixErrorText } = this.props;

    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };

    const SelectAsync = Select.AsyncCreatable;

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          this.validator.resetTouched();
          onRequestClose();
        }}
        contentLabel="Modal"
      >
        <div className={css.createProjectForm}>
          <h3 className={css.header}>Создать проект</h3>
          <hr />
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
                      backendErrorText={prefixErrorText}
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
                  loadOptions={getPortfolios}
                  filterOption={el => el}
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
              onClick={this.props.onSubmit}
              disabled={!(this.props.validateProjectName && this.props.validateProjectPrefix)}
            />
            <Button
              text="Создать и открыть"
              type="green-lighten"
              onClick={this.props.onSubmitAndOpen}
              disabled={!(this.props.validateProjectName && this.props.validateProjectPrefix)}
            />
          </div>
        </div>
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
  prefixErrorText: PropTypes.string,
  selectedPortfolio: PropTypes.object,
  validateProjectName: PropTypes.bool,
  validateProjectPrefix: PropTypes.bool
};

export default CreateProject;
