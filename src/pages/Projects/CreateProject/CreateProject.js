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
import { connect } from 'react-redux';
import localize from './CreateProject.json';

class CreateProject extends Component {
  constructor(props) {
    super(props);

    this.validator = new Validator();
  }

  render() {
    const { isOpen, onRequestClose, prefixErrorText, projectTypes = [], lang } = this.props;

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
          <h3 className={css.header}>{localize[lang].CREATE}</h3>
          <hr />
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].NAME}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedInput
                      autoFocus
                      onChange={this.props.onChange}
                      name="projectName"
                      placeholder={localize[lang].NAME_PLACEHOLDER}
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText={localize[lang].ERROR_NAME_TEXT}
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
                <p>{localize[lang].PREFIX}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedInput
                      onChange={this.props.onChange}
                      name="projectPrefix"
                      placeholder={localize[lang].PREFIX_PLACEHOLDER}
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText={localize[lang].ERROR_PREFIX_TEXT}
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
                <p>{localize[lang].TYPE}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Select
                  name="projectType"
                  placeholder={localize[lang].TYPE_PLACEHOLDER}
                  multi={false}
                  noResultsText={localize[lang].NO_RESULTS}
                  backspaceRemoves={false}
                  options={projectTypes.map(type => ({ value: type.id, label: type.name }))}
                  className={css.selectType}
                  onChange={this.props.onTypeSelect}
                  value={this.props.selectedType}
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].ADD_TO_PORTFOLIO}</p>
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
              text={localize[lang].ADD}
              type="green"
              onClick={this.props.onSubmit}
              disabled={!(this.props.validateProjectName && this.props.validateProjectPrefix)}
            />
            <Button
              text={localize[lang].CREATE_AND_OPEN}
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
  onTypeSelect: PropTypes.func,
  prefixErrorText: PropTypes.string,
  projectTypes: PropTypes.array,
  selectedPortfolio: PropTypes.object,
  selectedType: PropTypes.number,
  validateProjectName: PropTypes.bool,
  validateProjectPrefix: PropTypes.bool
};

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  projectTypes: state.Dictionaries.projectTypes || []
});

export default connect(
  mapStateToProps,
  null
)(CreateProject);
