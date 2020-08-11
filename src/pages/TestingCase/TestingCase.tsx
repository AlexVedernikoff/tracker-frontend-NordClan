import React, { FC, useState, useEffect } from 'react'
import { observable, action, toJS, computed } from 'mobx'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import moment from 'moment'
import Select from '../../components/Select'
import TimePicker from 'rc-time-picker'
import { Col, Row } from 'react-flexbox-grid/lib'

import Button from '../../components/Button'
import { IconDelete, IconPlus } from '../../components/Icons'
import Modal from '../../components/Modal'
import Priority from '../../components/Priority'
import SelectCreatable from '../../components/SelectCreatable'
import ValidatedAutosizeInput from '../../components/ValidatedAutosizeInput'
import Validator from '../../components/ValidatedInput/Validator'
import ValidatedTextEditor from '../../components/ValidatedTextEditor'
import Title from '../../components/Title'
import TestSuiteFormModal from '../../components/TestSuiteEditModal'
import Description from '../../components/Description'
import Attachments from '../../components/Attachments'
import { history } from '../../History'
import Creatable, { makeCreatableSelect } from 'react-select/creatable'

import localize from './TestingCase.json'
import { RULES } from './constants'

interface TestCaseStep {
  id?: number
  testCaseId?: number
  action: string
  expectedResult: string
  key?: string
}

interface Attachment {
  deletedAt: null
  fileName: string
  id: number
  path: string
  previewPath: string
  size: number
  type: string
}

interface TestCase {
  id: number
  title: string,
  description: string,
  statusId: number | null,
  severityId: number | null,
  priority: number,
  preConditions: string,
  postConditions: string,
  projectId: null,
  duration: string,
  testSuiteId: number | null,
  authorId: number,
  createdAt: string,
  updatedAt: string,
  deletedAt: null,
  testCaseSteps: TestCaseStep[]
  testCaseAttachments: Attachment[]
}

interface Props {
  lang: string
  params: { id: string }
  updateTestCase: Function
  createTestCase: Function
  getAllTestCases: Function
  deleteTestCase: Function
  uploadAttachments: Function
  removeAttachment: Function
  onClose: Function
  isLoading: boolean
  statuses: any[]
  severities: any[]
  testSuites: any[]
  authorId: number
  testCases: { withoutTestSuite: TestCase[], withTestSuite: TestCase[] }
  css: any
}

class Store {
  @observable test: TestCase = {} as any
  @observable isStepsOpen = true
  @observable isCreatingSuite = false
  @observable newTestSuiteTitle = ''
  @observable isEditing: string[] = []

  validator = new Validator()

  @action private setup(test: TestCase) {
    for (const step of test.testCaseSteps) {
      if (step.key === undefined) step.key = 'step-' + Math.random()
    }
    test.testCaseAttachments = test.testCaseAttachments ?? []
    this.test = observable(test)
  }

  @action private default(authorId: number) {
    this.test.id = -1
    this.test.title = ''
    this.test.description = ''
    this.test.statusId = 3
    this.test.severityId = null
    this.test.priority = 3
    this.test.preConditions = ''
    this.test.postConditions = ''
    this.test.projectId = null
    this.test.duration = "00:10:00"
    this.test.testSuiteId = null
    this.test.authorId = authorId
    this.test.createdAt = '2020-07-29T14:15:40.670Z'
    this.test.updatedAt = '2020-07-29T14:15:40.670Z'
    this.test.deletedAt = null
    this.test.testCaseAttachments = []
    this.test.testCaseSteps = [{ action: '', expectedResult: '', key: 'step-' + Math.random() }]
  }

  @computed get isStepsFilled(): boolean {
    return this.test.testCaseSteps.every(stepItem => stepItem.action && stepItem.expectedResult)
  }

  @computed get getTitleIsValid(): boolean {
    const title = this.test.title
    return title.length < RULES.MIN_TITLE_LENGTH || title.length > RULES.MAX_TITLE_LENGTH
  }

  @action setAttachments(attachments: Attachment[]) {
    this.test.testCaseAttachments = []
    for (const at of attachments) {
      this.test.testCaseAttachments.push(at)
    }
  }

  @action removeAttachment(id: number) {
    this.test.testCaseAttachments = this.test.testCaseAttachments.filter(at => at.id != id)
  }

  @action setTestSuiteID(id: number) {
    this.test.testSuiteId = id
  }

  constructor(testCases: TestCase[], id: number, authorId: number) {
    const test = testCases.find(test => test.id === id)
    if (test !== undefined) this.setup(test)
    if (test === undefined) this.default(authorId)
  }
}

const TestingCase: FC<Props> = (props: Props) => {
  // Props
  const {
    lang,
    testCases,
    isLoading,
    statuses,
    severities,
    testSuites,
    authorId,
    onClose,
    css,
    getAllTestCases,
    updateTestCase,
    createTestCase,
    deleteTestCase
  } = props
  const id = parseInt(props.params.id)
  const creating = id == -1

  // States
  const [store] = useState(() => new Store([...testCases.withTestSuite, ...testCases.withoutTestSuite], id, authorId))
  const validator = store.validator
  const duration = moment(store.test.duration, 'HH:mm:ss')
  const {
    title,
    postConditions,
    preConditions,
    description,
    priority,
  } = store.test

  const canSave = !isLoading && !store.getTitleIsValid && store.isStepsFilled
  const invalidStyle = { color: 'red' }
  // Callbacks
  const getFieldError = fieldName => {
    switch (fieldName) {
      case 'title': {
        return title.length > RULES.MIN_TITLE_LENGTH
          ? localize[lang].TITLE_ERROR.TOO_LONG
          : localize[lang].TITLE_ERROR.TOO_SHORT
      }

      case 'text':
        return localize[lang].TEXT_ERROR_TOO_LONG

      default:
        return ''
    }
  }

  const onEditStart = (field: string) => () => {
    store.isEditing.push(field)
  }

  const onEditFinish = (field: string) => (editorState) => {
    const index = store.isEditing.indexOf(field)
    store.isEditing.splice(index, 1)
    {
      (store.test as any)[field] = editorState.description
    }
  }

  const onEditFinishCustom = (field: string) => {
    const index = store.isEditing.indexOf(field)
    store.isEditing.splice(index, 1)
  }

  const isEditing = (field: string) => {
    const index = store.isEditing.indexOf(field)
    return index != -1
  }

  const isEditingErrorStyle = (shouldMarkError: boolean, field: string) => {
    const style: any = (shouldMarkError && !isEditing(field)) && { color: 'red' } || {}
    style.width = '100%'
    return style
  }

  const getTitleIsValid = () => title.length < RULES.MIN_TITLE_LENGTH || title.length > RULES.MAX_TITLE_LENGTH

  const handleChange = field => event => {
    const value = Number.isInteger(event.target.value) ? +event.target.value : event.target.value.trim()
    {
      (store.test as any)[field] = value
    }
  }

  const handleTextEditorChange = (field: string) => editorState => {
    (store.test as any)[field] = editorState.getCurrentContent().getPlainText()
  }

  const handleStepsCollapse = () => {
    store.isStepsOpen = !store.isStepsOpen
  }

  const handleStepChange = (i, field) => editorState => {
    (store.test.testCaseSteps[i] as any)[field] = editorState.getCurrentContent().getPlainText()
  }

  const handlePriorityChange = priorityId => store.test.priority = +priorityId

  const handleDurationChange = duration => {
    duration = duration.format('HH:mm:ss')
    store.test.duration = duration
  }

  const handleSelect = field => value => {
    (store.test as any)[field] = Number.isInteger(value.value) ? value.value : null
  }

  const handleCreatableChange = (value: any) => {
    store.setTestSuiteID(value.value)
  }

  const handleCreatableInputChange = (value: any) => {
  }

  const handleCreateOption = (name: string) => {
    const label = name.trim()
    const suite = {
      label,
      value: Math.random()
    }
    props.testSuites.push(suite)
    store.setTestSuiteID(suite.value)
  }

  const submitTestCase = () => {
    const json = toJS(store.test)
    updateTestCase(id, json)
  }

  const deleteCurrentTestCase = () => {
    if (confirm(localize[lang].DELETE)) {
      deleteTestCase(id).then(() => history.push('/testing-case-reference'))
    }
  }

  const submitTestCaseCreate = () => {
    const json = toJS(store.test)
    return createTestCase(json).then(() => {
      if (onClose) onClose()
    })
  }

  const submitTestCaseCreateAndOpen = () => {
    const json = toJS(store.test)
    createTestCase(json).then(response => {
      getAllTestCases().then(() => history.push('/test-case/' + response.data.id))
    })
  }

  const onAddStep = () => {
    store.test.testCaseSteps.push({ action: '', expectedResult: '', key: 'step-' + Math.random() })
    store.isStepsOpen = true
  }

  const onCreatingTestSuite = option => {
    store.isCreatingSuite = true
    store.newTestSuiteTitle = option.label
  }

  const handleTestSuiteForm = () => {
    store.isCreatingSuite = false
  }

  const onDeleteStep = (i: number) => () => {
    store.test.testCaseSteps.splice(i, 1)
  }

  const uploadAttachments = files => {
    props.uploadAttachments(store.test.id, files, (data: Attachment[]) => {
      store.setAttachments(data)
    });
  };

  const removeAttachment = attachmentId => {
    store.removeAttachment(attachmentId)
    props.removeAttachment(id, attachmentId)
  };

  if (testCases.withTestSuite.length === 0 && testCases.withoutTestSuite.length === 0) {
    return <span>No test cases found</span>
  }

  if (store.isCreatingSuite) {
    return <TestSuiteFormModal title={store.newTestSuiteTitle} onClose={handleTestSuiteForm} />
  }

  const formHeader = creating ? localize[lang].FORM_TITLE_CREATE : localize[lang].FORM_TITLE_EDIT

  return (
    <form className={css.container}>
      <Title render={"[Epic] - " + formHeader + ' #' + id} />
      <h3>{formHeader}</h3>
      <hr />
      <label className={classnames(css.field, css.titleField)}>
        <Row>
          <Col xs={12} sm={12} className={css.label}>
            <p>{localize[lang].TITLE_LABEL} </p>
          </Col>
          <Col xs={12} sm={12} className={css.fieldInput}>
            {validator.validate(
              (handleBlur, shouldMarkError) => (
                <ValidatedAutosizeInput
                  maxRows={5}
                  autoFocus
                  name="title"
                  placeholder={localize[lang].TITLE_PLACEHOLDER}
                  onChange={handleChange('title')}
                  onBlur={handleBlur}
                  shouldMarkError={shouldMarkError}
                  errorText={getFieldError('title')}
                  value={title}
                />
              ),
              'title',
              getTitleIsValid()
            )}
          </Col>
        </Row>
      </label>
      <Row style={{marginBottom: '32px'}}>
        <Col xs={6} sm={6}>
          <label className={css.field}>
          {validator.validate((handleBlur, shouldMarkError) => (
            <div style={(shouldMarkError && !isEditing('preConditions')) && invalidStyle || undefined}>
              <Description
                text={{ __html: preConditions }}
                headerType="h4"
                id={id}
                headerText={localize[lang].PRE_CONDITIONS_LABEL}
                onEditStart={onEditStart('preConditions')}
                onEditFinish={() => { }}
                onEditSubmit={editorState => {
                  onEditFinish('preConditions')(editorState)
                  handleBlur()
                }}
                isEditing={isEditing('preConditions')}
                canEdit={true}
                clickAnywhereToEdit={true}
                placeholder={localize[lang].PRE_CONDITIONS_PLACEHOLDER}
              />
            </div>
          ),
            'preConditions',
            preConditions.length > RULES.MAX_TEXT_LENGTH
          )}
        </label>
        </Col>
        <Col xs={6} sm={6}>
          <label className={css.field}>
          {validator.validate((handleBlur, shouldMarkError) => (
            <div style={(shouldMarkError && !isEditing('postConditions')) && invalidStyle || undefined}>
              <Description
                text={{ __html: postConditions }}
                headerType="h4"
                id={id}
                headerText={localize[lang].POST_CONDITIONS_LABEL}
                onEditStart={onEditStart('postConditions')}
                onEditFinish={() => { }}
                onEditSubmit={editorState => {
                  onEditFinish('postConditions')(editorState)
                  handleBlur()
                }}
                isEditing={isEditing('postConditions')}
                canEdit={true}
                clickAnywhereToEdit={true}
                placeholder={localize[lang].POST_CONDITIONS_PLACEHOLDER}
              />
            </div>
          ),
            'postConditions',
            postConditions.length > RULES.MAX_TEXT_LENGTH
          )}
        </label>
        </Col>
      </Row>
      <Row>
        <Col xs={8} sm={8}>
          <label className={classnames(css.field)}>
            <Row>
              <Col
                xs={12}
                sm={12}
                className={classnames(css.label, css.stepsLabel)}
                onClick={handleStepsCollapse}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <p>{localize[lang].STEPS_LABEL}</p>
              </Col>
              {store.isStepsOpen && store.test.testCaseSteps.map((step: TestCaseStep, i: number) => (
                <Col xs={12} sm={12} key={step.key} className={css.step}>
                  <Row>
                    <Col xs={1} sm={1} className={css.stepLabel}>
                      <p>#{i + 1}</p>
                    </Col>
                    <Col xs={5} sm={5} className={css.fieldInput}>
                      {validator.validate((handleBlur, shouldMarkError) => (
                        <div style={isEditingErrorStyle(shouldMarkError, 'action' + step.key)}>
                          <Description
                            text={{ __html: step.action }}
                            headerType="h4"
                            id={id}
                            headerText={null}
                            onEditStart={onEditStart('action' + step.key)}
                            onEditFinish={() => { }}
                            onEditSubmit={editorState => {
                              onEditFinishCustom('action' + step.key)
                              console.log(editorState)
                              step.action = editorState.trimmed
                              handleBlur()
                              if (editorState.trimmed)
                                if (i + 1 === store.test.testCaseSteps.length) onAddStep()
                            }}
                            isEditing={isEditing('action' + step.key)}
                            canEdit={true}
                            clickAnywhereToEdit={true}
                            placeholder={localize[lang].STEPS_ACTION_PLACEHOLDER}
                          />
                        </div>
                      ),
                        'action' + step.key,
                        step.action.length > RULES.MAX_TEXT_LENGTH
                      )}
                    </Col>
                    <Col xs={5} sm={5} className={css.fieldInput}>
                      {validator.validate((handleBlur, shouldMarkError) => (
                        <div style={isEditingErrorStyle(shouldMarkError, 'result' + step.key)}>
                          <Description
                            text={{ __html: step.expectedResult }}
                            headerType="h4"
                            id={id}
                            headerText={null}
                            onEditStart={onEditStart('result' + step.key)}
                            onEditFinish={() => { }}
                            onEditSubmit={editorState => {
                              onEditFinishCustom('result' + step.key)
                              console.log(editorState)
                              step.expectedResult = editorState.trimmed
                              handleBlur()
                              if (editorState.trimmed)
                                if (i + 1 === store.test.testCaseSteps.length) onAddStep()
                            }}
                            isEditing={isEditing('result' + step.key)}
                            canEdit={true}
                            clickAnywhereToEdit={true}
                            placeholder={localize[lang].STEPS_EXPECTED_RESULT_PLACEHOLDER}
                          />
                        </div>
                      ),
                        'result' + step.key,
                        step.expectedResult.length > RULES.MAX_TEXT_LENGTH
                      )}
                    </Col>
                    <Col xs={1} sm={1} className={classnames(css.fieldInput, css.stepDeleteContainer)}>
                      {store.test.testCaseSteps.length > 1 && (
                        <IconDelete className={css.stepDeleteIcon} onClick={onDeleteStep(i)} />
                      )}
                    </Col>
                  </Row>
                </Col>
              ))}
              <Col xs={12} sm={12}>
                <Row center="xs" className={css.addStepRow}>
                  <Col xs={12} sm={12} className={css.addStepContainer} onClick={onAddStep}>
                    <IconPlus className={css.addStepIcon} icon="IconPlus" />
                  </Col>
                </Row>
              </Col>
            </Row>
          </label>
          <label className={css.field}>
          {!creating && <Attachments
            attachments={store.test.testCaseAttachments.slice().sort((a, b) => a.id - b.id)}
            removeAttachment={removeAttachment}
            uploadAttachments={uploadAttachments}
            canEdit={true}
          />}
          {creating && <span>{localize[lang].SAVE_TO_ADD_PIC}</span>}
          </label>
        </Col>
        <Col xs={4} sm={4}>
          <label className={css.field}>
            {validator.validate((handleBlur, shouldMarkError) => (
              <div style={(shouldMarkError && !isEditing('description')) && invalidStyle || undefined}>
                <Description
                  text={{ __html: description }}
                  headerType="h4"
                  id={id}
                  headerText={localize[lang].DESCRIPTION_LABEL}
                  onEditStart={onEditStart('description')}
                  onEditFinish={() => { }}
                  onEditSubmit={editorState => {
                    onEditFinish('description')(editorState)
                    handleBlur()
                  }}
                  isEditing={isEditing('description')}
                  canEdit={true}
                  clickAnywhereToEdit={true}
                  placeholder={localize[lang].DESCRIPTION_PLACEHOLDER}
                />
              </div>
            ),
              'description',
              description.length > RULES.MAX_TEXT_LENGTH
            )}
          </label>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={12} className={css.label}>
                <p>{localize[lang].STATUS_LABEL}</p>
              </Col>
              <Col xs={12} sm={12} className={css.fieldInput}>
                <Select
                  isSearchable={false}
                  options={statuses}
                  className={css.select}
                  value={store.test.statusId}
                  onChange={handleSelect('statusId')}
                  isClearable={false}
                  isRtl={false}
                />
              </Col>
            </Row>
          </label>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={12} className={css.label}>
                <p>{localize[lang].SEVERITY_LABEL}</p>
              </Col>
              <Col xs={12} sm={12} className={css.fieldInput}>
                <Select
                  isSearchable={false}
                  options={severities}
                  className={css.select}
                  value={store.test.severityId}
                  onChange={handleSelect('severityId')}
                  isClearable={false}
                  isRtl={false}
                />
              </Col>
            </Row>
          </label>
          <Row className={css.twoFields}>
            <Col xs={6} sm={6}>
              <label className={css.field}>
                <Row>
                  <Col xs={12} sm={12} className={css.label}>
                    <p>{localize[lang].PRIORITY_LABEL}</p>
                  </Col>
                  <Col xs={12} sm={12} className={classnames(css.rightColumn)}>
                    <Priority priority={priority} onPrioritySet={handlePriorityChange} text={''} />
                  </Col>
                </Row>
              </label>
            </Col>
            <Col xs={6} sm={6}>
              <label className={css.field}>
                <Row>
                  <Col xs={12} sm={12} className={css.label}>
                    <p>{localize[lang].DURATION_LABEL}</p>
                  </Col>
                  <Col xs={12} sm={12} className={css.fieldInput}>
                    <TimePicker defaultValue={duration} allowEmpty={false} onChange={handleDurationChange} />
                  </Col>
                </Row>
              </label>
            </Col>
          </Row>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={12} className={css.label}>
                <p>{localize[lang].TEST_SUITE_LABEL}</p>
              </Col>
              <Col xs={12} sm={12} className={css.fieldInput}>
                {false && <SelectCreatable
                  promptTextCreator={(label: string) => `${localize[lang].TEST_SUITE_CREATE} '${label}'`}
                  multi={false}
                  ignoreCase={false}
                  placeholder={localize[lang].TEST_SUITE_PLACEHOLDER}
                  options={testSuites}
                  lang={lang}
                  filterOption={(el: any) => el}
                  onChange={handleSelect('testSuiteId')}
                  onCreateClick={onCreatingTestSuite}
                  name="test-suite"
                  value={store.test.testSuiteId}
                  className={css.select}
                />}
                <Creatable
                  isClearable
                  onChange={handleCreatableChange}
                  onInputChange={handleCreatableInputChange}
                  onCreateOption={handleCreateOption}
                  options={testSuites}
                  name="test-suite"
                  promptTextCreator={(label: string) => `${localize[lang].TEST_SUITE_CREATE} '${label}'`}
                  multi={false}
                  ignoreCase={false}
                  placeholder={localize[lang].TEST_SUITE_PLACEHOLDER}
                  className={css.select}
                  value={store.test.testSuiteId}
                />
              </Col>
            </Row>
          </label>
        </Col>
      </Row>
      {!creating && <Row className={css.buttons}>
        <Button
          text={localize[lang].SAVE}
          type="green"
          htmlType="submit"
          disabled={!canSave}
          onClick={submitTestCase}
          loading={isLoading}
        />
        <Button
          text={localize[lang].DELETE}
          type="red"
          htmlType="submit"
          disabled={isLoading}
          onClick={deleteCurrentTestCase}
          loading={isLoading}
        />
      </Row>}

      {creating && <Row className={css.buttons}>
        <Button
          text={localize[lang].CREATE_TEST_CASE}
          type="green"
          htmlType="submit"
          disabled={!canSave}
          onClick={submitTestCaseCreate}
          loading={isLoading}
        />
        <Button
          text={localize[lang].CREATE_OPEN_TEST_CASE}
          type="green-lighten"
          htmlType="submit"
          disabled={!canSave}
          onClick={submitTestCaseCreateAndOpen}
          loading={isLoading}
        />
      </Row>}
    </form>
  )
}

export default observer(TestingCase)
