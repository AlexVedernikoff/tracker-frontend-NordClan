import React, { FC, useState, Component, useContext } from 'react';
import { observer } from 'mobx-react'
import _ from 'lodash';

import { Col, Row } from 'react-flexbox-grid/lib/index';
import localize from './testRuns.json'
import Title from '~/components/Title';
import testRunsStore from './store';
import Input from '~/components/Input';
import Button from '~/components/Button';
import TestRunsTable from './TestRunsTable';

type TestRunsProps = {
  openTestRun: (testExecutionId: number) => void;
  startTestRun: () => void;
};

const TestRuns: FC<TestRunsProps> = ({openTestRun, startTestRun}) => {

  // const
  const { storeInit, lang, changeRunsFilterText } = useContext(testRunsStore);

  const dbounce_changeRunsFilterText = _.debounce(changeRunsFilterText, 500);

  const changeFilter = (e) => {
    dbounce_changeRunsFilterText(e.currentTarget.value);
  };

  let filterRef: HTMLInputElement | null = null;
  const clearFilter = () => {
    if (filterRef) filterRef.value = '';
    dbounce_changeRunsFilterText('');
  }

  if (!storeInit) return <div />;

  return (
    <div>
      <Title render={localize[lang].TITLE} />
      <Row>
        <Col xs={2}>
          <Button
            type="primary"
            text={localize[lang].START_NEW_TEST_RUN}
            icon="IconPlay"
            name="right"
            onClick={startTestRun}
          />
          &nbsp;
        </Col>
        <Col xs={10}>
          <Input
            inputRef={ref => (filterRef = ref)}
            onChange={changeFilter}
            canClear
            onClear={clearFilter}
          />
        </Col>
      </Row>
      <TestRunsTable openTestRun={openTestRun} />
    </div>
  );
}

export default observer(TestRuns)
