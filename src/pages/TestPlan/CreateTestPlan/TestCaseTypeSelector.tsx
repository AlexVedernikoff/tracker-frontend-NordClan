import React, { Component, PureComponent } from 'react';
import propTypes from 'prop-types';
import Checkbox from '../../../components/Checkbox';
import _ from 'lodash';
import css from './CreateTestPlan.scss';
import classnames from 'classnames';

class TestCaseTypeSelectorItem extends PureComponent<any, any> {
  render() {
    const {
      testSuiteName,
      allCount,
      handleSelectAll,
      setActiveTestCaseType,
      isActive,
      id,
      activeTestCaseType,
      testCasesData
    } = this.props;

    const testCasesDataCount = testCasesData.filter(testCaseItem => testCaseItem.activeTestCaseType === id).length;

    return (
      <div
        className={classnames(css.typeSelectorWrapper, {
          [css.active]: isActive
        })}
        onClick={() => setActiveTestCaseType(id === activeTestCaseType ? null : id)}
      >
        <Checkbox checked={testCasesDataCount === allCount} onChange={handleSelectAll} />
        <div className={css.nameBlock}>{testSuiteName}</div>
        <div>
          ({testCasesDataCount}/{allCount})
        </div>
      </div>
    );
  }
}

class TestCaseTypeSelector extends Component<any, any> {
  render() {
    const {
      testCaseList: { withTestSuite, withoutTestSuite },
      setActiveTestCaseType,
      activeTestCaseType,
      testCasesData
    } = this.props;

    return (
      <div>
        {withoutTestSuite.length ? (
          <TestCaseTypeSelectorItem
            setActiveTestCaseType={setActiveTestCaseType}
            testSuiteName="Test cases without suite"
            allCount={withoutTestSuite.length}
            isActive={activeTestCaseType === 0}
            id={0}
            activeTestCaseType={activeTestCaseType}
            testCasesData={testCasesData}
          />
        ) : null}
        {_.map(withTestSuite, (item, index) => (
          <TestCaseTypeSelectorItem
            key={`test_case_type_selector_item_${index}`}
            setActiveTestCaseType={setActiveTestCaseType}
            testSuiteName={item.title}
            allCount={item.testCasesData.length}
            isActive={activeTestCaseType === item.id}
            id={item.id}
            activeTestCaseType={activeTestCaseType}
            testCasesData={testCasesData}
          />
        ))}
      </div>
    );
  }
}

TestCaseTypeSelector.propTypes = {
  activeTestCaseType: propTypes.number,
  id: propTypes.number,
  setActiveTestCaseType: propTypes.func,
  testCaseList: propTypes.object,
  testCasesData: propTypes.array
};

TestCaseTypeSelectorItem.propTypes = {
  activeTestCaseType: propTypes.number,
  allCount: propTypes.number,
  handleSelectAll: propTypes.func,
  id: propTypes.number,
  isActive: propTypes.bool,
  setActiveTestCaseType: propTypes.func,
  testCasesData: propTypes.array,
  testSuiteName: propTypes.string
};

export default TestCaseTypeSelector;
