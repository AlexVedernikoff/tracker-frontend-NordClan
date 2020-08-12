import React, { FC, useState, Component } from 'react';
import { observable, action, toJS, computed } from 'mobx'
import { observer } from 'mobx-react'

import localize from './testRuns.json'

interface Props {

}

const TestRuns: FC<Props> = (props: Props) => {
  return <div>TestRuns!</div>;
}

export default observer(TestRuns)
