import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import css from './CreateTestPlan.scss';
import propTypes from 'prop-types';

import TestCaseTypeSelector from './TestCaseTypeSelector';
import ActiveTestCaseTypeList from './ActiveTestCaseTypeList';
import Button from '../../../components/Button';
import ValidatedAutosizeInput from '../../../components/ValidatedAutosizeInput';
import ValidatedTextEditor from '../../../components/ValidatedTextEditor';
import Validator from '../../../components/ValidatedInput/Validator';
import TimePicker from 'rc-time-picker';

import localize from './CreateTestPlan.json';
import RULES from './rules';
class CreateTestPlan extends Component<any, any> {
  constructor(props) {
    super(props);
    this.validator = new Validator();
  }

  getActiveTestCaseTypeData = (testCaseList, activeTestCaseType) => {
    if (activeTestCaseType === null) return null;
    if (activeTestCaseType === 0) return testCaseList.withoutTestSuite;
    return testCaseList.withTestSuite[activeTestCaseType].testCasesData;
  };

  getFieldError = fieldName => {
    const { lang, title } = this.props;
    switch (fieldName) {
      case 'title':
        return title > RULES.MIN_TITLE_LENGTH
          ? localize[lang].TITLE_ERROR.TOO_LONG
          : localize[lang].TITLE_ERROR.TOO_SHORT;
      case 'text':
        return localize[lang].TEXT_ERROR_TOO_LONG;
      default:
        return '';
    }
  };

  render() {
    const {
      testCaseList,
      setActiveTestCaseType,
      activeTestCaseType,
      testCasesData,
      selectTestCases,
      lang,
      removeTestCases,
      users,
      updateTestCases,
      handleCreateTestPlan,
      title,
      description,
      runtime,
      handleChangeInput,
      handleChangeTextarea,
      handleRuntimeChange,
      textareaKey
    } = this.props;
    const selectedLangUsername = lang === 'en' ? 'fullNameEn' : 'fullNameRu';
    const optionsSelector = users ? users.map(item => ({ label: item[selectedLangUsername], value: item.id })) : [];
    optionsSelector.unshift({ label: 'Unassigned', value: null });
    const activeTestCaseTypeData = this.getActiveTestCaseTypeData(testCaseList, activeTestCaseType);
    const testCasesDataCount = testCasesData.length;
    const titleValidation = title.length < RULES.MIN_TITLE_LENGTH || title.length > RULES.MAX_TITLE_LENGTH;
    return (
      <div>
        <div className={css.testPlanCreateContainer}>
          <div className={css.createTestPlanTitle}>{localize[lang].PLAN_DETAILS}</div>
          <Button
            type="primary"
            text={localize[lang].CREATE}
            disabled={!testCasesDataCount || !title || !runtime}
            onClick={handleCreateTestPlan}
          />
          <div className={css.testPlanDetailsLabel}>{localize[lang].TITLE}</div>
          <Row>
            <Col xs={12} sm={6}>
              {this.validator.validate(
                (handleBlur, shouldMarkError) => (
                  <ValidatedAutosizeInput
                    maxRows={5}
                    name="title"
                    placeholder={localize[lang].TITLE_PLACEHOLDER}
                    value={title}
                    shouldMarkError={shouldMarkError}
                    onChange={handleChangeInput}
                    errorText={this.getFieldError('title')}
                  />
                ),
                'title',
                titleValidation
              )}
            </Col>
          </Row>
          <div className={css.testPlanDetailsLabel}>{localize[lang].DESCRIPTION}</div>
          <Row>
            <Col xs={12} sm={6}>
              {this.validator.validate(
                (handleBlur, shouldMarkError) => (
                  <ValidatedTextEditor
                    toolbarHidden
                    key={textareaKey}
                    onEditorStateChange={handleChangeTextarea}
                    placeholder={localize[lang].DESCRIPTION_PLACEHOLDER}
                    errorText={this.getFieldError('text')}
                    onBlur={handleBlur}
                    shouldMarkError={shouldMarkError}
                    content={description}
                  />
                ),
                'description',
                description.length > RULES.MAX_TEXT_LENGTH
              )}
            </Col>
          </Row>
          <div className={css.testPlanDetailsLabel}>{localize[lang].RUNTIME}</div>
          <Row>
            <Col xs={12} sm={6}>
              <TimePicker value={runtime} allowEmpty={false} onChange={handleRuntimeChange} />
            </Col>
          </Row>
        </div>

        <div className={css.testPlanCreateContainer}>
          <div className={css.createTestPlanTitle}>
            {localize[lang].CHOOSE_CASES} ({testCasesDataCount} {localize[lang].SELECTED})
          </div>
        </div>
        <Row>
          <Col xs={12} sm={3} className={css.typesColumn}>
            <TestCaseTypeSelector
              activeTestCaseType={activeTestCaseType}
              testCaseList={testCaseList}
              setActiveTestCaseType={setActiveTestCaseType}
              selectTestCases={selectTestCases}
              testCasesData={testCasesData}
            />
          </Col>
          <Col sm={9} xs={12} className={css.contentColumn}>
            <ActiveTestCaseTypeList
              activeTestCaseTypeData={activeTestCaseTypeData}
              activeTestCaseType={activeTestCaseType}
              selectTestCases={selectTestCases}
              testCasesData={testCasesData}
              lang={lang}
              removeTestCases={removeTestCases}
              optionsSelector={optionsSelector}
              updateTestCases={updateTestCases}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

(CreateTestPlan as any).propTypes = {
  activeTestCaseType: propTypes.number,
  description: propTypes.string,
  handleChangeInput: propTypes.func,
  handleChangeTextarea: propTypes.func,
  handleCreateTestPlan: propTypes.func,
  handleRuntimeChange: propTypes.func,
  lang: propTypes.string,
  removeTestCases: propTypes.func,
  runtime: propTypes.object,
  selectTestCases: propTypes.func,
  setActiveTestCaseType: propTypes.func,
  testCaseList: propTypes.object,
  testCasesData: propTypes.array,
  textareaKey: propTypes.string,
  title: propTypes.string,
  updateTestCases: propTypes.func,
  users: propTypes.array
};

export default CreateTestPlan;
