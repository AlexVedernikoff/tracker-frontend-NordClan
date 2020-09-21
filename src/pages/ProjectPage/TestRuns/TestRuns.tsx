import React, { FC, useState, Component, useContext } from 'react';
import { observer } from 'mobx-react'

import { Col, Row } from 'react-flexbox-grid/lib/index';
import localize from './testRuns.json'
import Title from '~/components/Title';
import testRunsStore from './store';
import Input from '~/components/Input';
import Button from '~/components/Button';
import TestRunsTable from './TestRunsTable';


const TestRuns: FC<{}> = () => {

  const { storeInit, lang, projectId } = useContext(testRunsStore);

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
          />
          &nbsp;
        </Col>
        <Col xs={10}>
          <Input
            defaultValue=''
            canClear
            onClear={() => {}}
          />
        </Col>
      </Row>
      <TestRunsTable />
    </div>
  );
}

export default observer(TestRuns)
