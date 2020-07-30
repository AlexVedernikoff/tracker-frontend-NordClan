import React, { FC, useState, useEffect } from 'react'
import { observable, action, toJS } from 'mobx'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import moment from 'moment'
import Select from 'react-select'
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

import css from './TestingCase.scss'
import localize from './TestingCase.json'
import { RULES } from './constants'

interface TestCaseStep {
  id?: number
  testCaseId?: number
  action: string
  expectedResult: string
  key?: number
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
}

interface Props {
  lang: string
  params: { id: string }
  updateTestCase: Function
  createTestCase: Function
  getAllTestCases: Function
  isLoading: boolean
  statuses: any[]
  severities: any[]
  testSuites: any[]
  authorId: number
  testCases: { withoutTestSuite: TestCase[], withTestSuite: TestCase[] }
}

class Store {
  @observable test: TestCase = {} as any

  @action private setup(test: TestCase) {
    for (const step of test.testCaseSteps) {
      if (step.key === undefined) step.key = Math.random()
    }
    this.test = observable(test)
  }

  constructor(testCases: TestCase[], id: number) {
    const test = testCases.find(test => test.id === id)
    if (test !== undefined) this.setup(test)
  }
}

const TestingCase: FC<Props> = (props: Props) => {
  // Props
  const { lang, getAllTestCases, testCases, isLoading, statuses, severities, testSuites, authorId, updateTestCase } = props
  const id = parseInt(props.params.id)

  // States
  const [validator] = useState(new Validator())
  const [status] = useState(statuses[2])
  const [isStepsOpen, setIsStepsOpen] = useState(true)
  const [isCreatingSuite, setIsCreatingSuite] = useState(false)
  const [newTestSuiteTitle, setNewTestSuiteTitle] = useState('')
  const [store] = useState(new Store([...testCases.withTestSuite, ...testCases.withoutTestSuite], id))
  const {
    title,
    postConditions,
    preConditions,
    description,
    priority,
  } = store.test

  const shouldButtonsBeEnabled = !isLoading
  //const severity = props.severities[0]
  const steps = store.test.testCaseSteps
  const duration = moment(store.test.duration, 'HH:mm:ss')

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

  const getTitleIsValid = () => title.length < RULES.MIN_TITLE_LENGTH || title.length > RULES.MAX_TITLE_LENGTH

  const handleChange = field => event => {
    const value = Number.isInteger(event.target.value) ? +event.target.value : event.target.value.trim()
    {
      (store.test as any)[field] = value
    }
  }

  const handleTextEditorChange = field => editorState => {
    (store.test as any)[field] = editorState.getCurrentContent().getPlainText()
  }

  const handleStepsCollapse = () => {
    setIsStepsOpen(!isStepsOpen)
  }

  const handleStepChange = (i, field) => editorState => {
    (store.test.testCaseSteps[i] as any)[field] = editorState.getCurrentContent().getPlainText()
  }

  const handlePriorityChange = priorityId => store.test.priority = +priorityId

  const handleDurationChange = duration => {
    duration = duration.format('HH:mm:ss')
    //console.log({ duration })
    store.test.duration = duration
  }

  const handleSelect = field => value => {
    (store.test as any)[field] = Number.isInteger(value.value) ? value.value : null
  }

  const submitTestCase = () => {
    console.log(toJS(store.test))
    const json = toJS(store.test) as any
    json.steps = toJS(store.test.testCaseSteps) // IDK why front and back API is not the same
    updateTestCase(id, json)
  }

  const onAddStep = () => {
    store.test.testCaseSteps.push({ action: '', expectedResult: '', key: Math.random() })
    setIsStepsOpen(true)
  }

  const onCreatingTestSuite = option => {
    setNewTestSuiteTitle(option.label)
    setIsCreatingSuite(true)
  }

  const handleTestSuiteForm = () => {
    setIsCreatingSuite(false)
  }

  const onDeleteStep = (i: number) => () => {
    store.test.testCaseSteps.splice(i, 1)
  }

  // Effects
  useEffect(() => {
    //getAllTestCases()
  }, [])

  if (testCases.withTestSuite.length === 0 && testCases.withoutTestSuite.length === 0) {
    return <span>No test cases found</span>
  }

  if (isCreatingSuite) {
    return <TestSuiteFormModal title={newTestSuiteTitle} onClose={handleTestSuiteForm} />
  }

  return (
    <form className={css.container}>
      <Title render={"[Epic] - " + localize[lang].FORM_TITLE + ' #' + id} />
      <h3>{localize[lang].FORM_TITLE}</h3>
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
      <Row>
        <Col xs={8} sm={8}>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={12} className={css.label}>
                <p>{localize[lang].PRE_CONDITIONS_LABEL}</p>
              </Col>
              <Col xs={12} sm={12} className={css.fieldInput}>
                {validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedTextEditor
                      toolbarHidden
                      onEditorStateChange={handleTextEditorChange('preConditions')}
                      placeholder={localize[lang].PRE_CONDITIONS_PLACEHOLDER}
                      wrapperClassName={css.textEditorWrapper}
                      editorClassName={css.text}
                      onBlur={handleBlur}
                      content={preConditions}
                      shouldMarkError={shouldMarkError}
                      errorText={getFieldError('text')}
                    />
                  ),
                  'preConditions',
                  preConditions.length > RULES.MAX_TEXT_LENGTH
                )}
              </Col>
            </Row>
          </label>
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
              {isStepsOpen && steps.map((step: TestCaseStep, i: number) => (
                <Col xs={12} sm={12} key={step.key} className={css.step}>
                  <Row>
                    <Col xs={1} sm={1} className={css.stepLabel}>
                      <p>#{i}</p>
                    </Col>
                    <Col xs={5} sm={5} className={css.fieldInput}>
                      {validator.validate(
                        (handleBlur, shouldMarkError) => (
                          <ValidatedTextEditor
                            toolbarHidden
                            onEditorStateChange={handleStepChange(i, 'action')}
                            placeholder={localize[lang].STEPS_ACTION_PLACEHOLDER}
                            wrapperClassName={css.textEditorWrapper}
                            editorClassName={classnames(css.text, css.textStep)}
                            onBlur={handleBlur}
                            content={step.action}
                            shouldMarkError={shouldMarkError}
                            errorText={getFieldError('text')}
                          />
                        ),
                        'stepAction' + i,
                        step.action.length > RULES.MAX_TEXT_LENGTH
                      )}
                    </Col>
                    <Col xs={5} sm={5} className={css.fieldInput}>
                      {validator.validate(
                        (handleBlur, shouldMarkError) => (
                          <ValidatedTextEditor
                            toolbarHidden
                            onEditorStateChange={handleStepChange(i, 'expectedResult')}
                            placeholder={localize[lang].STEPS_EXPECTED_RESULT_PLACEHOLDER}
                            wrapperClassName={css.textEditorWrapper}
                            editorClassName={classnames(css.text, css.textStep)}
                            onBlur={handleBlur}
                            content={step.expectedResult}
                            shouldMarkError={shouldMarkError}
                            errorText={getFieldError('text')}
                          />
                        ),
                        'stepExpectedResult' + moment().toISOString,
                        step.expectedResult.length > RULES.MAX_TEXT_LENGTH
                      )}
                    </Col>
                    <Col xs={1} sm={1} className={classnames(css.fieldInput, css.stepDeleteContainer)}>
                      {steps.length > 1 && (
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
            <Row>
              <Col xs={12} sm={12} className={css.label}>
                <p>{localize[lang].POST_CONDITIONS_LABEL}</p>
              </Col>
              <Col xs={12} sm={12} className={css.fieldInput}>
                {validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedTextEditor
                      toolbarHidden
                      onEditorStateChange={handleTextEditorChange('postConditions')}
                      placeholder={localize[lang].POST_CONDITIONS_PLACEHOLDER}
                      wrapperClassName={css.textEditorWrapper}
                      editorClassName={css.text}
                      onBlur={handleBlur}
                      content={postConditions}
                      shouldMarkError={shouldMarkError}
                      errorText={getFieldError('postConditions')}
                    />
                  ),
                  'postConditions',
                  postConditions.length > RULES.MAX_TEXT_LENGTH
                )}
              </Col>
            </Row>
          </label>
        </Col>
        <Col xs={4} sm={4}>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={12} className={css.label}>
                <p>{localize[lang].DESCRIPTION_LABEL}</p>
              </Col>
              <Col xs={12} sm={12} className={css.fieldInput}>
                {validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedTextEditor
                      toolbarHidden
                      onEditorStateChange={handleTextEditorChange('description')}
                      placeholder={localize[lang].DESCRIPTION_PLACEHOLDER}
                      wrapperClassName={css.textEditorWrapper}
                      editorClassName={css.text}
                      onBlur={handleBlur}
                      content={description}
                      shouldMarkError={shouldMarkError}
                      errorText={getFieldError('text')}
                    />
                  ),
                  'description',
                  description.length > RULES.MAX_TEXT_LENGTH
                )}
              </Col>
            </Row>
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
                <SelectCreatable
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
                />
              </Col>
            </Row>
          </label>
        </Col>
      </Row>
      <Row className={css.buttons}>
        <Button
          text={localize[lang].CREATE_OPEN_TEST_CASE}
          type="green"
          htmlType="submit"
          disabled={!shouldButtonsBeEnabled}
          onClick={submitTestCase}
          loading={isLoading}
        />
      </Row>
    </form>
  )
}

export default observer(TestingCase)
