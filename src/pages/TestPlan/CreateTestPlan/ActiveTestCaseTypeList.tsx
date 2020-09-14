import React, { Component } from 'react';
import propTypes from 'prop-types';
import Checkbox from '../../../components/Checkbox';
import {
  IconBlock,
  IconArrowWithTailUp,
  IconMinus,
  IconExclamation,
  IconCircle,
  IconArrowWithTailDown,
  IconWater
} from '../../../components/Icons';
import css from './CreateTestPlan.scss';
import localize from './CreateTestPlan.json';

import SelectDropdown from '../../../components/SelectDropdown';
import getPriorityById from '../../../utils/TaskPriority';

const TestCaseSeverity = ({ testCaseSeverity, selectedLang }) => {
  const iconsArray = [
    <IconMinus className={css.testCaseInfoIconGrey} />,
    <IconBlock className={css.testCaseInfoIconRed} />,
    <IconExclamation className={css.testCaseInfoIconRed} />,
    <IconCircle className={css.testCaseInfoIconGrey} />,
    <IconArrowWithTailDown className={css.testCaseInfoIconYellow} />,
    <IconWater className={css.testCaseInfoIconYellow} />
  ];
  const Icon = iconsArray[testCaseSeverity.id - 1];
  return (
    <div>
      {Icon}
      {testCaseSeverity[selectedLang]}
    </div>
  );
};

const TestCasePriority = ({ priority, lang }) => {
  const iconsArray = [
    <IconArrowWithTailUp className={css.testCaseInfoIconRed} />,
    <IconArrowWithTailUp className={css.testCaseInfoIconRed} />,
    <IconCircle className={css.testCaseInfoIconGrey} />,
    <IconArrowWithTailDown className={css.testCaseInfoIconYellow} />,
    <IconArrowWithTailDown className={css.testCaseInfoIconYellow} />
  ];
  const Icon = iconsArray[priority - 1];
  const testCasePriority = getPriorityById(priority);
  return (
    <div>
      {Icon}
      {localize[lang][testCasePriority]}
    </div>
  );
};

const ActiveTestCaseTypeItem = props => {
  const {
    data,
    lang,
    selectTestCases,
    testCasesData,
    removeTestCases,
    optionsSelector,
    updateTestCases,
    activeTestCaseType,
    selectedGlobalUser,
    handleChangeGlobalUser
  } = props;

  const { testCaseSeverity, testCaseStatus, priority, id } = data;
  const selectedLang = lang === 'en' ? 'nameEn' : 'name';
  const selectedCurrentTestCase = testCasesData.find(item => item.testCaseId === id);
  const isSelected = typeof selectedCurrentTestCase === 'object';
  const selectedUser =
    selectedCurrentTestCase && optionsSelector.find(item => item.value === selectedCurrentTestCase.assignedTo);
  const onChangeHandler = isSelected ? removeTestCases : selectTestCases;
  const onChangeSelector = item => {
    updateTestCases([
      {
        testCaseId: id,
        assignedTo: item.value,
        activeTestCaseType
      }
    ]);
    if (selectedGlobalUser && item.value !== selectedGlobalUser.value) {
      handleChangeGlobalUser();
    }
  };

  return (
    <div className={css.testCaseItemWrapper}>
      <div className={css.testCaseSelectorWrapper}>
        <Checkbox
          checked={isSelected}
          onChange={() =>
            onChangeHandler([
              {
                testCaseId: id,
                activeTestCaseType,
                assignedTo: null
              }
            ])
          }
        />
        <div className={css.testCaseContent}>
          <div className={css.testCaseTitle}>{data.title}</div>
          <div className={css.testCaseInfoRow}>
            <TestCaseSeverity selectedLang={selectedLang} testCaseSeverity={testCaseSeverity} />
            <TestCasePriority priority={priority} lang={lang} />
            <div>{testCaseStatus[selectedLang]}</div>
          </div>
        </div>
      </div>
      {isSelected && (
        <SelectDropdown
          options={optionsSelector}
          onChange={onChangeSelector}
          value={selectedUser || optionsSelector[0]}
          customWrapperClasses={css.selectorClass}
        />
      )}
    </div>
  );
};

class ActiveTestCaseTypeList extends Component<any, any> {
  state = {
    selectedGlobalUser: null
  };

  assignAllTestCases = userItem => {
    const { updateTestCases, activeTestCaseTypeData, activeTestCaseType } = this.props;
    const selectedItems = activeTestCaseTypeData.map(testCaseItem => ({
      testCaseId: testCaseItem.id,
      assignedTo: userItem.value,
      activeTestCaseType
    }));
    updateTestCases(selectedItems);
    this.setState({
      selectedGlobalUser: userItem
    });
  };

  render() {
    const {
      activeTestCaseTypeData,
      activeTestCaseType,
      selectTestCases,
      testCasesData,
      lang,
      removeTestCases,
      optionsSelector,
      updateTestCases
    } = this.props;
    const { selectedGlobalUser } = this.state;
    if (!activeTestCaseTypeData || !optionsSelector) return null;
    return (
      <div>
        <div className={`${css.testCaseItemWrapper} ${css.assignAllWrapper}`}>
          <div className={css.testCaseSelectorWrapper}>
            <div className={css.testCaseContent}>
              <div className={css.testCaseTitle}>{localize[lang].ASSIGN_ALL_TO}</div>
            </div>
          </div>
          <SelectDropdown
            options={optionsSelector}
            onChange={item => this.assignAllTestCases(item)}
            value={selectedGlobalUser}
            customWrapperClasses={css.selectorClass}
          />
        </div>
        {activeTestCaseTypeData.map((item, index) => {
          return (
            <ActiveTestCaseTypeItem
              key={`active_test_case_type_item_${index}`}
              activeTestCaseType={activeTestCaseType}
              data={item}
              lang={lang}
              selectTestCases={selectTestCases}
              testCasesData={testCasesData}
              removeTestCases={removeTestCases}
              optionsSelector={optionsSelector}
              updateTestCases={updateTestCases}
              selectedGlobalUser={selectedGlobalUser}
              handleChangeGlobalUser={() =>
                this.setState({
                  selectedGlobalUser: { label: 'Various' }
                })
              }
            />
          );
        })}
      </div>
    );
  }
}

ActiveTestCaseTypeList.propTypes = {
  activeTestCaseType: propTypes.number,
  activeTestCaseTypeData: propTypes.array,
  lang: propTypes.string,
  optionsSelector: propTypes.array,
  removeTestCases: propTypes.func,
  selectTestCases: propTypes.func,
  testCasesData: propTypes.array,
  updateTestCases: propTypes.func
};

ActiveTestCaseTypeItem.propTypes = {
  activeTestCaseType: propTypes.number,
  data: propTypes.object,
  handleChangeGlobalUser: propTypes.func,
  lang: propTypes.string,
  optionsSelector: propTypes.array,
  removeTestCases: propTypes.func,
  selectTestCases: propTypes.func,
  selectedGlobalUser: propTypes.object,
  testCasesData: propTypes.array,
  updateTestCases: propTypes.func
};

TestCaseSeverity.propTypes = {
  selectedLang: propTypes.string,
  testCaseSeverity: propTypes.object
};

TestCasePriority.propTypes = {
  lang: propTypes.string,
  priority: propTypes.number
};

export default ActiveTestCaseTypeList;
