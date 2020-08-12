import React, { FC, useState, Component } from 'react';
import { observable, action, toJS, computed } from 'mobx'
import { observer } from 'mobx-react'

import localize from './testCases.json'

interface Props {

}

const TestCases: FC<Props> = (props: Props) => {
  return <div>TestCases!</div>;
}

export default observer(TestCases)
