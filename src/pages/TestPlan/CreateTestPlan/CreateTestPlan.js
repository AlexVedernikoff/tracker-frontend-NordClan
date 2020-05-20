import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import css from './CreateTestPlan.scss';
import propTypes from 'prop-types';

import TestCaseTypeSelector from './TestCaseTypeSelector';
import ActiveTestCaseTypeList from './ActiveTestCaseTypeList';

class CreateTestPlan extends Component {
  getActiveTestCaseTypeData = (testCaseList, activeTestCaseType) => {
    if (activeTestCaseType === null) return null;
    if (activeTestCaseType === 0) return testCaseList.withoutTestSuite;
    return testCaseList.withTestSuite[activeTestCaseType].testCasesData;
  };

  render() {
    const {
      testCaseList,
      setActiveTestCaseType,
      activeTestCaseType,
      selectedTestCases,
      selectTestCases,
      lang,
      removeTestCases,
      users
    } = this.props;
    const selectedLangUsername = lang === 'en' ? 'fullNameEn' : 'fullNameRu';
    const optionsSelector = users && users.map(item => ({ label: item[selectedLangUsername], vaule: item.id }));
    const activeTestCaseTypeData = this.getActiveTestCaseTypeData(testCaseList, activeTestCaseType);
    return (
      <div>
        <span>Choose cases (3 selected)</span>
        <Row>
          <Col xs={3}>
            <TestCaseTypeSelector
              activeTestCaseType={activeTestCaseType}
              testCaseList={testCaseList}
              setActiveTestCaseType={setActiveTestCaseType}
            />
          </Col>
          <Col xs={9} className={css.contentColumn}>
            <ActiveTestCaseTypeList
              activeTestCaseTypeData={activeTestCaseTypeData}
              selectTestCases={selectTestCases}
              selectedTestCases={selectedTestCases}
              lang={lang}
              removeTestCases={removeTestCases}
              optionsSelector={optionsSelector}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

CreateTestPlan.propTypes = {
  activeTestCaseType: propTypes.number,
  lang: propTypes.string,
  removeTestCases: propTypes.func,
  selectTestCases: propTypes.func,
  selectedTestCases: propTypes.array,
  setActiveTestCaseType: propTypes.func,
  testCaseList: propTypes.object,
  users: propTypes.array
};

export default CreateTestPlan;
