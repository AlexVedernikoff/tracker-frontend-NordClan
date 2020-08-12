import React, { FC, useState, useEffect } from 'react'
import { observable, action, toJS, computed } from 'mobx'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import moment from 'moment'
import Select from '../../components/Select'
import TimePicker from 'rc-time-picker'
import { Col, Row } from 'react-flexbox-grid/lib'
import Lightbox from 'react-image-lightbox';

import Button from '../../components/Button'
import { IconDelete, IconPlus, IconClose } from '../../components/Icons'
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
import FileUpload from '../../components/FileUpload';

import localize from './TestingCase.json'
import { RULES } from './constants'
import { setCommentForEdit } from 'actions/Task'
import Dropzone from 'react-dropzone'

interface TestCaseStep {
  id?: number
  testCaseId?: number
  action: string
  expectedResult: string
  key?: string
  attachments: number[]
}

interface TestSuite {
  label: string
  value: number | string
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
  createTestSuite: Function
  updateTestSuite: Function
  getAllTestSuites: Function
  isLoading: boolean
  statuses: any[]
  severities: any[]
  testSuites: TestSuite[]
  authorId: number
  testCases: { withoutTestSuite: TestCase[], withTestSuite: TestCase[] }
  css: any
}

interface Suite {
  title: string
  id: number
}

class Store {
  @observable test: TestCase = {} as any
  @observable testSuite: TestSuite | null | undefined = null
  @observable testSuites: TestSuite[] = []
  @observable isStepsOpen = true
  @observable isCreatingSuite = false
  @observable newTestSuiteTitle = ''
  @observable isEditing: string[] = []
  upload!: HTMLInputElement
  stepIndexForUpload: number = -1
  @observable uploadInputReset: number = Math.random()

  // Lightbox
  @observable photoIndex: number = 0
  @observable isOpen: boolean = false

  validator = new Validator()

  @action private setup(test: TestCase, props: Props) {
    for (const step of test.testCaseSteps) {
      if (step.key === undefined) step.key = 'step-' + Math.random()
    }
    test.testCaseAttachments = test.testCaseAttachments ?? []
    test.testCaseSteps = test.testCaseSteps ?? []
    this.testSuite = props.testSuites.find(suite => suite.value == test.testSuiteId)
    this.testSuites = props.testSuites

    for (const step of test.testCaseSteps) {
      try {
        console.log({action:step.action})
        const json: { action: string, attachments: number[] } = JSON.parse(step.action)
        step.action = json.action
        step.attachments = json.attachments
      } catch (e) {
        step.attachments = []
      }
    }

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
    this.test.testCaseSteps = [{ action: '', expectedResult: '', key: 'step-' + Math.random(), attachments: [] }]
  }

  @computed get isStepsFilled(): boolean {
    return this.test.testCaseSteps.every(stepItem => stepItem.action && stepItem.expectedResult)
  }

  @computed get getTitleIsValid(): boolean {
    const title = this.test.title
    return title.length < RULES.MIN_TITLE_LENGTH || title.length > RULES.MAX_TITLE_LENGTH
  }

  @action setAttachments(attachments: Attachment[]): number {
    let newAttachment = -1

    for (const at of attachments) {
      let found = false
      for (const old of this.test.testCaseAttachments) {
        if (old.id == at.id) found = true
      }
      if (!found) newAttachment = at.id
    }

    this.test.testCaseAttachments = []
    for (const at of attachments) {
      this.test.testCaseAttachments.push(at)
    }

    return newAttachment
  }

  @action removeAttachment(id: number) {
    this.test.testCaseAttachments = this.test.testCaseAttachments.filter(at => at.id != id)

    for (const step of this.test.testCaseSteps) {
      if (step.attachments.includes(id)) step.attachments.splice(step.attachments.indexOf(id), 1)
    }
  }

  @action setTestSuiteID(suite: TestSuite | null | undefined) {
    if (suite == null) {
      this.test.testSuiteId = null
      this.testSuite = null
    } else {
      this.test.testSuiteId = (typeof suite.value == 'string') ? null : suite.value
      this.testSuite = {...suite}
    }
  }

  @action setTestSuites(suite: Suite[]) {
    this.testSuites = suite.map((el: Suite) => {
      return { label: el.title, value: el.id };
    });
  }

  constructor(testCases: TestCase[], id: number, authorId: number, props: Props) {
    const test = testCases.find(test => test.id === id)
    if (test !== undefined) this.setup(test, props)
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
  const [store] = useState(() => new Store([...testCases.withTestSuite, ...testCases.withoutTestSuite], id, authorId, props))
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
    const labeled = name.trim()

    const params = {
      title: labeled,
      description: labeled
    }

    props.createTestSuite(params).then((response) => {
      props.getAllTestSuites().then((response) => {
        store.setTestSuites(response.data)
        store.setTestSuiteID(store.testSuites.find(el => el.label == labeled));
      })
    });
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
    updateTestCase(id, json)
  }

  const deleteCurrentTestCase = () => {
    if (confirm(localize[lang].DELETE)) {
      deleteTestCase(id).then(() => history.push('/testing-case-reference'))
    }
  }

  const submitTestCaseCreate = () => {
    const json = toJS(store.test)
    fixStepAttachments(json)
    return createTestCase(json).then(() => {
      if (onClose) onClose()
    })
  }

  const submitTestCaseCreateAndOpen = () => {
    const json = toJS(store.test)
    fixStepAttachments(json)
    createTestCase(json).then(response => {
      getAllTestCases().then(() => history.push('/test-case/' + response.data.id))
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

  const handleTestSuiteForm = () => {
    store.isCreatingSuite = false
  }

  const onDeleteStep = (i: number) => () => {
    store.test.testCaseSteps.splice(i, 1)
  }

  const onAddStepAttachment = (i: number) => () => {
    if (creating) {
      alert(localize[lang].SAVE_TO_ADD_PIC)
      return
    }
    store.stepIndexForUpload = i
    store.upload.click()
  }

  const uploadAttachments = (files: File[]) => {
    props.uploadAttachments(store.test.id, files, (data: Attachment[]) => {
      const newAttachment = store.setAttachments(data)
      if (
        (newAttachment != -1)
        &&
        (store.stepIndexForUpload != -1)
      ) {
        store.test.testCaseSteps[store.stepIndexForUpload].attachments.push(newAttachment)
        store.stepIndexForUpload = -1
        store.uploadInputReset = Math.random()
      }
    });
  };

  const onChangeFile = event => {
    event.stopPropagation()
    event.preventDefault()
    const file: File = event.target.files[0]
    uploadAttachments([file])
  }

  const removeAttachment = attachmentId => {
    store.removeAttachment(attachmentId)
    props.removeAttachment(id, attachmentId)
  };

  const onDeleteStepAttachment = (i: number, at: number) => () => {
    removeAttachment(at)
  }

  // Lightbox ++

  let nextSrc: string | undefined = ''
  let prevSrc: string | undefined = ''
  let mainSrc: string = ''
  
  const imageTypes = ['image' /*fallback for old attachments*/, 'image/jpeg', 'image/png', 'image/pjpeg'];
  const isImage = (t: string) => imageTypes.indexOf(t) !== -1;
  const attachments = store.test.testCaseAttachments

  const getAttachmentsNextImageIndex = index => {
    for (let i = index; i < attachments.length; i++) {
      const file = attachments[i];
      if (file && isImage(file.type)) {
        return i;
      }
    }

    return index ? getAttachmentsNextImageIndex(0) : 0;
  };

  const getAttachmentsPrevImageIndex = index => {
    const lastIndex = attachments.length - 1;
    for (let i = index; i >= 0; i--) {
      const file = attachments[i];
      if (file && isImage(file.type)) {
        return i;
      }
    }

    return index < lastIndex ? getAttachmentsPrevImageIndex(lastIndex) : 0;
  };

  const photoIndex = store.photoIndex

  const nextImageIndex = getAttachmentsNextImageIndex
  const prevImageIndex = getAttachmentsPrevImageIndex

  if (attachments.length) {
    mainSrc = attachments[photoIndex].path;
    nextSrc =
      attachments[nextImageIndex((photoIndex + 1) % attachments.length)].path !== mainSrc
        ? attachments[nextImageIndex((photoIndex + 1) % attachments.length)].path
        : undefined;
    prevSrc =
      attachments[prevImageIndex((photoIndex + attachments.length - 1) % attachments.length)].path !== mainSrc
        ? attachments[prevImageIndex((photoIndex + attachments.length - 1) % attachments.length)].path
        : undefined;
  }
  
  const openImage = (id: number) => () => {
    let index = 0
    let i = 0

    for (const at of store.test.testCaseAttachments) {
      if (at.id == id) index = i
      i++
    }

    store.photoIndex = index
    store.isOpen = true
  }

  const closeImage = () => {
    store.isOpen = false
  }

  const prevImage = () => {
    store.photoIndex = getAttachmentsPrevImageIndex(
      (store.photoIndex + attachments.length - 1) % attachments.length
    )
  };

  const nextImage = () => {
    store.photoIndex = getAttachmentsNextImageIndex((store.photoIndex + 1) % attachments.length)
  };

  const handleImageLoad = () => {
    setTimeout(() => {
      try {
        const buttonIn: any = document.querySelector('.ril-zoom-in');
        const buttonOut: any = document.querySelector('.ril-zoom-out');
        buttonIn.click();
        buttonOut.click();
        const image: any = document.querySelector('.ril-image-current');
        image.classList.add('in');
      } catch (e) {
        const image = document.querySelector('.ril-image-current');
        if (image && image.classList) {
          image.classList.add('in');
        }
        return;
      }
    }, 150);
  };

  // Lightbox --

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
                  <Row>
                    {step.attachments.map((id: number) => {
                      const name = store.test.testCaseAttachments.find(at => at.id == id)?.fileName
                      if (name == null) return null
                      return <span key={id} className={css.attachmentName}><span onClick={openImage(id)}>{name}</span> <IconClose title={localize[lang].DELETE} className={css.attachmentRemove} onClick={onDeleteStepAttachment(i, id)}/></span>
                    })}
                    {step.attachments.length == 0 && <span className={css.noImages}>{localize[lang].NO_IMAGES}</span>}
                    <IconPlus className={css.stepDeleteIcon} onClick={onAddStepAttachment(i)} />
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
                  value={store.testSuite}
                  isDisabled={isLoading}
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
      <input id="myInput"
          type="file"
          key={store.uploadInputReset}
          ref={(ref) => store.upload = ref as HTMLInputElement}
          style={{display: 'none'}}
          onChange={onChangeFile}
      />
      {store.isOpen && (
        <Lightbox
          mainSrc={`/${mainSrc}`}
          nextSrc={nextSrc}
          prevSrc={prevSrc}
          onCloseRequest={closeImage}
          onMovePrevRequest={prevImage}
          onMoveNextRequest={nextImage}
          onImageLoad={handleImageLoad}
        />
      )}
    </form>
  )
}

export default observer(TestingCase)
