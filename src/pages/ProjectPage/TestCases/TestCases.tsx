import React, { FC, useState, Component } from 'react';
import { observable, action, toJS, computed } from 'mobx'
import { observer } from 'mobx-react'

import localize from './testCases.json'
import { Store } from './store'
import { Props } from './types'
import TestingCaseReference from '../../TestingCaseReference';
import Modal from '../../../components/Modal';

const TestCases: FC<Props> = (props: Props) => {
  const [store] = useState(() => new Store(props))
  const {
    updateTestCase,
    testCases,
    css
  } = props

  const selectToProject = () => {
    store.isOpen = true
  }

  const updateTestCaseProject = (id: number, projectId: number | null) => {
    const cases = [...testCases.withTestSuite, ...testCases.withoutTestSuite]
    for (const test of cases) {
      if (test.id == id) {
        console.log({ updateTestCase: test, id })
        test.projectId = projectId
        updateTestCase(id, test).then(() => {
          props.getAllTestCases()
        })
      }
    }
  }

  const removeFromProject = (id: number) => {
    updateTestCaseProject(id, null)
  }

  const addToProject = (id: number) => {
    store.isOpen = false
    console.log({ testCases })
    updateTestCaseProject(id, parseInt(props.params.projectId))
  }

  const onClose = () => {
    store.isOpen = false
  }

  return <>
    <TestingCaseReference
      removeFromProject={removeFromProject}
      projectId={parseInt(props.params.projectId)}
      selectToProject={selectToProject}
    />
    <Modal isOpen={store.isOpen} contentLabel="modal" className={css.modalWrapper} onRequestClose={onClose}>
      <TestingCaseReference
        addToProject={addToProject}
      />
    </Modal>
  </>;
}

export default observer(TestCases)
