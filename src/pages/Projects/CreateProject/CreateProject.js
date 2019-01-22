import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import ValidatedInput from '../../../components/ValidatedInput';
import Validator from '../../../components/ValidatedInput/Validator';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './CreateProject.scss';
import Select from 'react-select';
import { connect } from 'react-redux';
import localize from './CreateProject.json';
import { getProjectTypes } from '../../../selectors/dictionaries';

class CreateProject extends Component {
  constructor(props) {
    super(props);

    this.validator = new Validator();
  }

  getErrorText = () => {
    const { lang } = this.props;
    const projectNameMoreSymbol = this.props.projectName.length > 255;
    const projectNameLessSymbol = this.props.projectName.length < 4;
    const projectNameTextError = projectNameLessSymbol
      ? localize[lang].ERROR_NAME_LESS_SYMBOL_TEXT
      : projectNameMoreSymbol
        ? localize[lang].ERROR_NAME_MORE_SYMBOL_TEXT
        : null;
    const projectPrefixLessSymbols = this.props.projectPrefix.length < 2;
    const projectPrefixTextError = localize[lang].ERROR_PREFIX_TEXT;

    return {
      projectNameMoreSymbol,
      projectNameLessSymbol,
      projectNameTextError,
      projectPrefixLessSymbols,
      projectPrefixTextError
    };
  };

  render() {
    const { isOpen, onRequestClose, prefixErrorText, projectTypes = [], lang } = this.props;

    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };

    const portfoliosOptions = this.props.portfolios.map(portfolio => ({
      label: portfolio.name,
      value: portfolio.id
    }));

    const options = projectTypes.map(type => ({ value: type.id, label: localize[lang][type.codename] }));
    const {
      projectNameMoreSymbol,
      projectNameLessSymbol,
      projectNameTextError,
      projectPrefixLessSymbols,
      projectPrefixTextError
    } = this.getErrorText();
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          this.validator.resetTouched();
          onRequestClose();
        }}
        contentLabel="Modal"
      >
        <form className={css.createProjectForm}>
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
                      name="projectName"
                      placeholder={localize[lang].NAME_PLACEHOLDER}
                      onChange={this.props.onChange}
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText={projectNameTextError}
                    />
                  ),
                  'projectName',
                  projectNameMoreSymbol || projectNameLessSymbol
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
                      errorText={projectPrefixTextError}
                      backendErrorText={prefixErrorText}
                    />
                  ),
                  'projectPrefix',
                  projectPrefixLessSymbols
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
                  options={options}
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
                <Select
                  promptTextCreator={label => `${localize[lang].CREATE_PORTFOLIO} '${label}'`}
                  searchPromptText={localize[lang].ENTER_PORTFOLIO_NAME}
                  multi={false}
                  ignoreCase={false}
                  placeholder={localize[lang].CHOOSE_PORTFOLIO}
                  options={portfoliosOptions}
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
              htmlType="submit"
              onClick={this.props.onSubmit}
              disabled={projectNameMoreSymbol || projectNameLessSymbol || projectPrefixLessSymbols}
            />
            <Button
              text={localize[lang].CREATE_AND_OPEN}
              type="green-lighten"
              onClick={this.props.onSubmitAndOpen}
              disabled={projectNameMoreSymbol || projectNameLessSymbol || projectPrefixLessSymbols}
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
  lang: PropTypes.string,
  onChange: PropTypes.func,
  onPortfolioSelect: PropTypes.func,
  onRequestClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitAndOpen: PropTypes.func,
  onTypeSelect: PropTypes.func,
  portfolios: PropTypes.array,
  prefixErrorText: PropTypes.string,
  projectName: PropTypes.string,
  projectPrefix: PropTypes.string,
  projectTypes: PropTypes.array,
  selectedPortfolio: PropTypes.object,
  selectedType: PropTypes.number
};

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  portfolios: state.Portfolios.portfolios,
  projectTypes: getProjectTypes(state) || []
});

export default connect(
  mapStateToProps,
  null
)(CreateProject);
