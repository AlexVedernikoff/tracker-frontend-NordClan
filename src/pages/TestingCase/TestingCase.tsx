import React, { FC, useState, useEffect } from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import moment from 'moment'
import Select from '../../components/Select'
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import { Col, Row } from 'react-flexbox-grid/lib'

import Button from '../../components/Button'
import MediumEditor from '../../components/MediumEditor'
import { IconDelete, IconPlus, IconClose, IconFileImage } from '../../components/Icons'
import Priority from '../../components/Priority'
import ValidatedAutosizeInput from '../../components/ValidatedAutosizeInput'
import Title from '../../components/Title'
import TestSuiteFormModal from '../../components/TestSuiteEditModal'
import Description from '../../components/Description'
import Attachments from '../../components/Attachments'
import TestSuiteSelectModal from '../../components/TestSuiteSelectModal';
import StatusSelectModal from '../../components/StatusSelectModal';
import SeveritySelectModal from '../../components/SeveritySelectModal';
import Modal from '../../components/Modal';
import { history } from '../../History'

import localize from './TestingCase.json'
import { RULES } from './constants'
import EditableRow from './EditableRow';
import { TestCaseStep, Attachment, Props, TestCase } from './types'
import { Store } from './store'

const TestingCase: FC<Props> = (props: Props) => {
  // Props
  const {
    lang,
    testCases,
    isLoading,
    statuses,
    severities,
    authorId,
    onClose,
    css,
    getAllTestCases,
    updateTestCase,
    createTestCase,
    deleteTestCase,
    params,
    router,
  } = props
  const propId = parseInt(props.params.id)
  const replaceRoute = (id) => router?.replace(`/test-case/${id}`);

  // States
  const [store] = useState(() => new Store([...testCases.withTestSuite, ...testCases.withoutTestSuite], propId, authorId, props))
  const id = store.test.id
  const creating = params.id === 'new';
  const validator = store.validator
  const duration = moment(store.test.duration, 'HH:mm:ss')
  const {
    title,
    postConditions,
    preConditions,
    description,
    priority,
  } = store.test


  const {
    testSuites
  } = store

  useEffect(() => {
    if (props.testSuites.length > store.testSuites.length)
      store.testSuites = props.testSuites
  }, [props.testSuites])

  const [currentSelectModal, changeCurrentSelectModal] = useState('');

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
    const value = Number.isInteger(event.target.value) ? +event.target.value : event.target.value
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

  const handleCreatableChange = (value: any | null) => {
    if (value != null) {
      store.setTestSuiteID(value)
    } else {
      store.setTestSuiteID(null)
    }
  }

  const handleCreatableInputChange = (value: any) => {
  }

  const handleCreateOption = (name: string) => {
    store.newTestSuiteTitle = name
    store.newTestSuiteKey = Math.random()
    store.isCreatingSuite = true
  }

  const handleCreateOptionDone = (name: string, description: string) => {
    const labeled = name.trim()

    const params = {
      title: labeled,
      description: description
    }

    props.createTestSuite(params).then((response) => {
      props.getAllTestSuites().then((response) => {
        store.setTestSuites(response.data)
        store.setTestSuiteID(store.testSuites.find(el => el.label == labeled))
      })
    })
  }

  const fixStepAttachments = (json: TestCase) => {
    for (const step of json.testCaseSteps) {
      step.action = JSON.stringify({
        action: step.action,
        attachments: step.attachments
      })
    }
  }

  const submitTestCase = () => {
    const json = toJS(store.test)
    fixStepAttachments(json)
    updateTestCase(id, json).then(() => {
      if (onClose) {
        onClose()
      } else {
        history.push('/testing-case-reference?' + Math.random())
      }
    })
  }

  const deleteCurrentTestCase = () => {
    if (confirm(localize[lang].DELETE)) {
      deleteTestCase(id).then(() => {
        if (onClose) {
          onClose()
        } else {
          history.push('/testing-case-reference?' + Math.random())
        }
      })
    }
  }

  const submitTestCaseCreate = (noClose: boolean) => {
    const json = toJS(store.test)
    json.title = json.title || 'Unnamed test-case'
    fixStepAttachments(json)
    return createTestCase(json).then((response) => {
      if (noClose) return response
      if (onClose) onClose()
    })
  }

  const submitTestCaseCreateAndOpen = () => {
    const json = toJS(store.test)
    fixStepAttachments(json)
    createTestCase(json).then(response => {
      getAllTestCases().then(() => replaceRoute(response.data.id))
    })
  }

  const onAddStep = () => {
    store.test.testCaseSteps.push({ action: '', expectedResult: '', key: 'step-' + Math.random(), attachments: [] })
    store.isStepsOpen = true
  }

  const onCreatingTestSuite = option => {
    store.isCreatingSuite = true
    store.newTestSuiteTitle = option.label
  }

  const handleTestSuiteFormClose = () => {
    store.isCreatingSuite = false
  }

  const handleTestSuiteFormFinish = (title: string, description: string) => {
    store.isCreatingSuite = false
    handleCreateOptionDone(title, description)
  }

  const onDeleteStep = (i: number) => () => {
    store.test.testCaseSteps.splice(i, 1)
  }

  const onAddStepAttachment = (i: number) => () => {
    if (creating) {
      submitTestCaseCreate(true).then((response) => {
        store.test.id = response.data.id
        replaceRoute(response.data.id)
        store.stepIndexForUpload = i
        store.upload.click()
      })
      return
    }
    store.stepIndexForUpload = i
    store.upload.click()
  }

  const uploadAttachments = (files: File[]) => {
    const file = files.pop()
    props.uploadAttachments(store.test.id, [file], (data: Attachment[]) => {
      const newAttachment = store.setAttachments(data)
      if (
        (newAttachment != -1)
        &&
        (store.stepIndexForUpload != -1)
      ) {
        store.test.testCaseSteps[store.stepIndexForUpload].attachments.push(newAttachment)
        if (files.length > 0) {
          uploadAttachments(files)
          return
        }
        store.stepIndexForUpload = -1
        // store.uploadInputReset = Math.random()
      }
    })
  }

  const onChangeFile = event => {
    event.stopPropagation()
    event.preventDefault()
    const files: File[] = [...event.target.files]
    if (files.length == 0) return
    uploadAttachments(files)
  }

  const removeAttachment = attachmentId => {
    store.removeAttachment(attachmentId)
    props.removeAttachment(id, attachmentId)
  }

  const mediumOptions = {
    toolbar: {
      buttons: ['bold', 'italic', 'underline', 'strikethrough', 'pre', 'anchor', 'orderedlist', 'unorderedlist']
    },
  }

  const trim = (html: string) => {
    return (
      html
        .replace(/<[/]*(p|br)>/g, '')
        .replace(/&nbsp;/g, '')
        .trim()
    )
  }

  if (testCases.withTestSuite.length === 0 && testCases.withoutTestSuite.length === 0) {
    return <span>No test cases found</span>
  }

  const formHeader = creating ? localize[lang].FORM_TITLE_CREATE : localize[lang].FORM_TITLE_EDIT

  return (
    <form className={css.container}>
      <Title render={"[Epic] - " + formHeader + ' #' + id} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            div[tag] > p {
              margin-top: 0;
              margin-bottom: 0;
            }
            `
        }}
      />
      <h3>{formHeader}</h3>
      <hr />
      <Row className={css.formBody}>

        <Col xs={12} sm={8}>
          <Row className={css.formField}>
            <Col xs={12} sm={2} className={css.label}>
              <p>{localize[lang].TITLE_LABEL}</p>
            </Col>
            <Col xs={12} sm={10} className={classnames(css.rightColumn)}>
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
          <Row className={css.formField}>
            <Col xs={12} sm={2} className={css.label}>
              <p>{localize[lang].DESCRIPTION_LABEL}</p>
            </Col>
            <Col xs={12} sm={10}>
                {validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedAutosizeInput
                      rows={3}
                      maxRows={5}
                      autoFocus
                      name="description"
                      placeholder={localize[lang].DESCRIPTION_PLACEHOLDER}
                      onChange={handleChange('description')}
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText={getFieldError('text')}
                      value={description}
                    />
                  ),
                  'description',
                  description.length > RULES.MAX_TEXT_LENGTH
                )}
            </Col>
          </Row>
          <Row className={css.formField}>
            <Col xs={12} sm={2} className={css.label}>
              <p>{localize[lang].PRE_CONDITIONS_LABEL}</p>
            </Col>
            <Col xs={12} sm={10}>
                {validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedAutosizeInput
                      rows={1}
                      maxRows={5}
                      autoFocus
                      name="preConditions"
                      placeholder={localize[lang].PRE_CONDITIONS_PLACEHOLDER}
                      onChange={handleChange('preConditions')}
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText={getFieldError('text')}
                      value={preConditions}
                    />
                  ),
                  'preConditions',
                  preConditions.length > RULES.MAX_TEXT_LENGTH
                )}
            </Col>
          </Row>
          <Row className={css.formField}>
            <Col xs={12} sm={2} className={css.label}>
              <p>{localize[lang].POST_CONDITIONS_LABEL}</p>
            </Col>
            <Col xs={12} sm={10}>
                {validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedAutosizeInput
                      rows={1}
                      maxRows={5}
                      autoFocus
                      name="postConditions"
                      placeholder={localize[lang].POST_CONDITIONS_PLACEHOLDER}
                      onChange={handleChange('postConditions')}
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText={getFieldError('text')}
                      value={postConditions}
                    />
                  ),
                  'postConditions',
                  postConditions.length > RULES.MAX_TEXT_LENGTH
                )}
            </Col>
          </Row>
          <div>
            {store.isStepsOpen && store.test.testCaseSteps.map((step: TestCaseStep, i: number) => {
              return (
                <React.Fragment key={step.id}>
                  <hr />
                  <Row className={css.stepRow}>
                    <p>Case {i + 1}</p>
                    {step.attachments.length === 0 && (
                      <IconFileImage data-tip={localize[lang].ADD_IMAGE} className={css.stepDeleteIcon} onClick={onAddStepAttachment(i)} />
                    )}
                    {store.test.testCaseSteps.length > 1 && (
                      <IconDelete data-tip={localize[lang].DELETE} className={css.stepDeleteIcon} onClick={onDeleteStep(i)} />
                    )}
                  </Row>
                  <Row className={css.formField}>
                    <Col xs={12} sm={2} className={css.label}>
                      <p>{localize[lang].STEPS_ACTION_LABEL}</p>
                    </Col>
                    <Col xs={12} sm={10}>
                        {validator.validate(
                          (handleBlur, shouldMarkError) => (
                           <MediumEditor
                              tag='div'
                              style={{ cursor: 'text' }}
                              flushEditorDOM={false}
                              text={step.action}
                              options={mediumOptions}
                              placeholder={localize[lang].STEPS_ACTION_PLACEHOLDER}
                              className={css.stepsFillHeight}
                              shouldMarkError={step.action.length === 0 || shouldMarkError}
                              onChange={text => {
                                step.action = trim(text)
                                handleBlur()
                                //if (text.trim())
                                //  if (i + 1 === store.test.testCaseSteps.length) onAddStep()
                              }}
                              onPaste={event => {
                                if (event instanceof ClipboardEvent) {
                                  const clipboardData = event.clipboardData || (window as any).clipboardData
                                  const file: File = clipboardData && clipboardData.files && clipboardData.files[0]
                                  if (file && !creating) {
                                    if (creating) {
                                      submitTestCaseCreate(true).then((response) => {
                                        store.test.id = response.data.id
                                        store.stepIndexForUpload = i
                                        uploadAttachments([file])
                                      })
                                      return
                                    }
                                    store.stepIndexForUpload = i
                                    uploadAttachments([file])
                                  }
                                }
                              }}
                            />
                          ),
                          'action' + step.key,
                          step.action.length > RULES.MAX_TEXT_LENGTH
                        )}
                    </Col>
                  </Row>
                  <Row className={css.formField}>
                    <Col xs={12} sm={2} className={css.label}>
                      <p>{localize[lang].STEPS_EXPECTED_RESULT_LABEL}</p>
                    </Col>
                    <Col xs={12} sm={10}>
                        {validator.validate(
                          (handleBlur, shouldMarkError) => (
                            <MediumEditor
                              tag='div'
                              style={{ cursor: 'text' }}
                              flushEditorDOM={false}
                              text={step.expectedResult}
                              options={mediumOptions}
                              placeholder={localize[lang].STEPS_EXPECTED_RESULT_PLACEHOLDER}
                              className={css.stepsFillHeight}
                              shouldMarkError={step.expectedResult.length === 0 || shouldMarkError}
                              onChange={text => {
                                step.expectedResult = trim(text)
                                handleBlur()
                                //if (text.trim())
                                //  if (i + 1 === store.test.testCaseSteps.length) onAddStep()
                              }}
                              onPaste={event => {
                                if (event instanceof ClipboardEvent) {
                                  const clipboardData = event.clipboardData || (window as any).clipboardData
                                  const file: File = clipboardData && clipboardData.files && clipboardData.files[0]
                                  if (file && !creating) {
                                    store.stepIndexForUpload = i
                                    uploadAttachments([file])
                                  }
                                }
                              }}
                            />
                          ),
                          'result' + step.key,
                          step.expectedResult.length > RULES.MAX_TEXT_LENGTH
                        )}
                    </Col>
                  </Row>
                  <label className={css.field}>
                    <Row className={css.attachmentsRow}>
                    {!creating && step.attachments.length > 0 && <Attachments
                      attachments={step.attachments.map(item => store.testCaseAttachmentsObject[item])}
                      removeAttachment={removeAttachment}
                      uploadAttachments={files => {
                        store.stepIndexForUpload = i
                        uploadAttachments(files)
                      }}
                      canEdit={true}
                    />}
                    </Row>
                  </label>
                </React.Fragment>
              );
          })}
          </div>
          <Row className={css.addStepRow}>
            <Col xs={6} sm={2} xsOffset={3} smOffset={5} className={css.addStepContainer} onClick={onAddStep}>
              <IconPlus className={css.addStepIcon} icon="IconPlus" />
            </Col>
          </Row>
        </Col>

        <Col xs={12} sm={4}>
          <div className={css.detailsBlock}>
            <table className={css.detailTable}>
              <tbody>
                <EditableRow
                  title={localize[lang].TEST_SUITE_LABEL}
                  value={store.testSuite?.label ?? 'Not selected'}
                  handler={() => changeCurrentSelectModal('testSuite')}
                  canEdit
                />
                <EditableRow
                  title={localize[lang].STATUS_LABEL}
                  value={statuses.find(item => item.value === store.test.statusId)?.label ?? 'Not selected'}
                  handler={() => changeCurrentSelectModal('status')}
                  canEdit
                />

                <tr>
                  <td>{localize[lang].DURATION_LABEL}</td>
                  <td><TimePicker defaultValue={duration} allowEmpty={false} onChange={handleDurationChange} /></td>
                </tr>

                <EditableRow
                  title={localize[lang].SEVERITY_LABEL}
                  value={severities.find(item => item.value === store.test.severityId)?.label ?? 'Not selected'}
                  handler={() => changeCurrentSelectModal('severity')}
                  canEdit
                />
                <tr>
                  <td>{localize[lang].PRIORITY_LABEL}</td>
                  <td><Priority priority={priority} onPrioritySet={handlePriorityChange} text={''} /></td>
                </tr>
              </tbody>
            </table>
          </div>
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
        {props.projectId == null && <Button
          text={localize[lang].CREATE_OPEN_TEST_CASE}
          type="green-lighten"
          htmlType="submit"
          disabled={!canSave}
          onClick={submitTestCaseCreateAndOpen}
          loading={isLoading}
        />}
      </Row>}
      <input id="myInput"
        type="file"
        multiple
        key={store.uploadInputReset}
        ref={(ref) => store.upload = ref as HTMLInputElement}
        style={{ display: 'none' }}
        onChange={onChangeFile}
        accept="image/x-png,image/jpeg,image/png,.jpg,.png"
      />

      {currentSelectModal === 'testSuite' && <TestSuiteSelectModal
        defaultValue={store.testSuite?.value ?? null}
        onChoose={id => {
          store.setTestSuiteID(testSuites.find(item => item.value == id));
          changeCurrentSelectModal('');
        }}
        onClose={() => changeCurrentSelectModal('')}
        options={testSuites}
      />}
      {currentSelectModal === 'status' && <StatusSelectModal
        defaultValue={store.test.statusId ?? null}
        onChoose={id => {
          store.test.statusId = id;
          changeCurrentSelectModal('');
        }}
        onClose={() => changeCurrentSelectModal('')}
        options={statuses}
      />}
      {currentSelectModal === 'severity' && <SeveritySelectModal
        defaultValue={store.test.severityId ?? null}
        onChoose={id => {
          store.test.severityId = id;
          changeCurrentSelectModal('');
        }}
        onClose={() => changeCurrentSelectModal('')}
        options={severities}
      />}
      <TestSuiteFormModal
        key={store.newTestSuiteKey}
        title={store.newTestSuiteTitle}
        onClose={handleTestSuiteFormClose}
        isCreating={true}
        onFinish={handleTestSuiteFormFinish}
        isOpen={store.isCreatingSuite}
      />
    </form>
  )
}

export default observer(TestingCase)
