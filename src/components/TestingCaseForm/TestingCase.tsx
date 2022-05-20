import React, {FC, useState, useEffect, useCallback, useRef} from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import moment from 'moment'
import _ from "lodash";
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import { Col, Row } from 'react-flexbox-grid/lib'

import Select from '../Select'
import Button from '../Button'
import MediumEditor from '../MediumEditor'
import { IconDelete, IconPlus, IconClose, IconFileImage, IconPreloader } from '../Icons'
import Priority from '../Priority'
import ValidatedAutosizeInput from '../ValidatedAutosizeInput'
import Title from '../Title'
import TestSuiteFormModal from '../TestSuiteEditModal'
import Description from '../Description'
import Attachments from '../Attachments'
import TestSuiteSelectModal from '../TestSuiteSelectModal';
import StatusSelectModal from '../StatusSelectModal';
import SeveritySelectModal from '../SeveritySelectModal';
import ConfirmModal, { useConfirmModal } from '~/components/ConfirmModal'

import localize from './TestingCase.json'
import css from './TestingCase.scss';
import { RULES } from './constants'
import EditableRow from './EditableRow';
import { TestCaseStep, Attachment, Props, TestCase, TempSuite } from './types'
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
    updateTestCase,
    createTestCase,
    deleteTestCase,
    successRedirect,
    editRedirect,
    backAction,
  } = props

  const testCasesList = [...testCases.withTestSuite, ...testCases.withoutTestSuite];
  // States
  const [store] = useState(() => new Store(testCasesList, parseInt(props.params.id), authorId, props))
  const initialValues = useRef({...store.test})
  const id = store.test.id
  const creating = props.params.id === 'new';
  const validator = store.validator
  const duration = moment(store.test.duration, 'HH:mm:ss')
  const {
    title,
    postConditions,
    preConditions,
    description,
    priority,
  } = store.test

  const [tempSuite, setTempSuite] = useState<TempSuite | null>(null);

  const {
    testSuites
  } = store

  useEffect(() => {
    if (props.testSuites.length > store.testSuites.length)
      store.testSuites = props.testSuites
  }, [props.testSuites])

  const [currentSelectModal, changeCurrentSelectModal] = useState('');

  const deleteCurrentTestCase = async () => {
    await deleteTestCase(id);
    successRedirect();
  }

  const [ deleteConfirmComponent, confirmDeleteTestCase ] = useConfirmModal(localize[lang].DELETE_CONFIRMATION, deleteCurrentTestCase);
  const [ leaveConfirmComponent, confirmLeave ] = useConfirmModal(localize[lang].LEAVE_CONFIRMATION, () => backAction && backAction())


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

  const handleCreateOptionDone = async (name: string, description: string) => {
    const labeled = name.trim()
    const item = { id: -1, title: labeled, description: description };
    setTempSuite(item);
    store.addTempTestSuite(item);
    store.setTestSuiteID({ value: item.id, label: item.title });
    store.isCreatingSuite = false;
  }

  const fixStepAttachments = (json: TestCase) => {
    for (const step of json.testCaseSteps) {
      step.action = JSON.stringify({
        action: step.action,
        attachments: step.attachments
      })
    }
  }

  const submitTestCase = async () => {
    const json = toJS(store.test)
    fixStepAttachments(json)
    if (json.testSuiteId === -1 && tempSuite) {
      const suite = await props.createTestSuite({ title: tempSuite.title, description: tempSuite.description });
      json.testSuiteId = suite.data.id;
      store.removeTempSuites();
      setTempSuite(null);
    }
    const args = creating ? [json] : [id, json];
    return (creating ? createTestCase : updateTestCase)(...args);
  }

  const onAddStep = () => {
    store.test.testCaseSteps.push({ action: '', expectedResult: '', key: 'step-' + Math.random(), attachments: [] })
    store.isStepsOpen = true
  }

  const onDeleteStep = (i: number) => () => {
    store.test.testCaseSteps.splice(i, 1)
  }

  const onAddStepAttachment = (i: number) => () => {
    if (creating && canSave) {
      submitTestCase().then((response) => {
        store.test.id = response.data.id
        editRedirect(response.data.id)
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
      const newAttachment = store.setAttachments(data);
      if ((newAttachment != -1) && (store.stepIndexForUpload != -1)) {
        store.test.testCaseSteps[store.stepIndexForUpload].attachments.push(newAttachment)
        if (files.length > 0) {
          uploadAttachments(files)
          return
        }
      }
      store.stepIndexForUpload = -1
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
    imageDragging: !creating || canSave,
  }

  const trim = (html: string) => {
    return (
      html
        .replace(/<[/]*(p|br)>/g, '')
        .replace(/&nbsp;/g, '')
        .trim()
    )
  }

  const formHeader = creating ? localize[lang].FORM_TITLE_CREATE : localize[lang].FORM_TITLE_EDIT

  const onBackClick = () => {
    const needsConfirm = !_.isEqual({...store.test}, initialValues.current)
    if (needsConfirm) {
      confirmLeave()
    } else if (backAction) {
      backAction()
    }
  }

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
      {!!backAction && (
        <div className={css.submitRow}>
          <Button
            text={localize[lang].BACK}
            type="primary"
            onClick={onBackClick}
          />
        </div>
      )}
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
                <React.Fragment key={step.key}>
                  <hr />
                  <Row className={css.stepRow}>
                    <p>Case {i + 1}</p>
                    {step.attachments.length === 0 && (canSave || !creating) &&  (
                      <IconFileImage data-tip={localize[lang].ADD_IMAGE} className={css.stepDeleteIcon} onClick={onAddStepAttachment(i)} />
                    )}
                    <IconDelete data-tip={localize[lang].DELETE} className={css.stepDeleteIcon} onClick={onDeleteStep(i)} />
                    {store.stepIndexForUpload === i && <IconPreloader />}
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
                                    if (creating && canSave) {
                                      submitTestCase().then((response) => {
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
                  value={store.testSuite?.label ?? localize[lang].SELECT_NOT_SELECTED}
                  haveValue={!!store.testSuite || false}
                  editHandler={() => changeCurrentSelectModal('testSuite')}
                  deleteHandler={() => {
                    store.testSuite = null;
                    store.test.testSuiteId = null;
                    store.removeTempSuites();
                    setTempSuite(null);
                  }}
                  {...(!tempSuite && {
                    createHandler: () => {
                      store.isCreatingSuite = true;
                      store.newTestSuiteTitle = '';
                    }
                  })}
                />
                <EditableRow
                  title={localize[lang].STATUS_LABEL}
                  value={statuses.find(item => item.value === store.test.statusId)?.label ?? localize[lang].SELECT_NOT_SELECTED}
                  haveValue={!!statuses.find(item => item.value === store.test.statusId) || false}
                  editHandler={() => changeCurrentSelectModal('status')}
                />

                <tr>
                  <td>{localize[lang].DURATION_LABEL}</td>
                  <td><TimePicker defaultValue={duration} allowEmpty={false} onChange={handleDurationChange} /></td>
                </tr>

                <EditableRow
                  title={localize[lang].SEVERITY_LABEL}
                  value={severities.find(item => item.value === store.test.severityId)?.label ?? localize[lang].SELECT_NOT_SELECTED}
                  haveValue={!!severities.find(item => item.value === store.test.severityId) || false}
                  deleteHandler={() => store.test.severityId = null}
                  editHandler={() => changeCurrentSelectModal('severity')}
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

      <Row className={css.buttons}>
        <Button
          text={creating ? localize[lang].CREATE_TEST_CASE : localize[lang].SAVE}
          type="green"
          htmlType="submit"
          disabled={!canSave}
          onClick={() => submitTestCase().then(() => successRedirect())}
          loading={isLoading}
        />
        {!creating && <Button
          text={localize[lang].DELETE}
          type="red"
          htmlType="submit"
          disabled={isLoading}
          onClick={ confirmDeleteTestCase }
          loading={isLoading}
        />}
      </Row>

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
        onClose={() => { store.isCreatingSuite = false; }}
        onFinish={handleCreateOptionDone}
        isOpen={store.isCreatingSuite}
        isCreating={true}
      />
      { deleteConfirmComponent }
      { leaveConfirmComponent }
    </form>
  )
}

export default observer(TestingCase)
