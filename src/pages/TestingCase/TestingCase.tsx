import React, { FC, useState, useEffect } from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import moment from 'moment'
import Select from '../../components/Select'
import TimePicker from 'rc-time-picker'
import { Col, Row } from 'react-flexbox-grid/lib'
import Lightbox from 'react-image-lightbox';

import Button from '../../components/Button'
import MediumEditor from '../../components/MediumEditor'
import { IconDelete, IconPlus, IconClose } from '../../components/Icons'
import Priority from '../../components/Priority'
import SelectCreatable from '../../components/SelectCreatable'
import ValidatedAutosizeInput from '../../components/ValidatedAutosizeInput'
import Title from '../../components/Title'
import TestSuiteFormModal from '../../components/TestSuiteEditModal'
import Description from '../../components/Description'
import Attachments from '../../components/Attachments'
import { history } from '../../History'
import Creatable from 'react-select/creatable'

import localize from './TestingCase.json'
import { RULES } from './constants'
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

  useEffect(() => {
    if (props.testSuites.length > store.testSuites.length)
      store.testSuites = props.testSuites
  }, [props.testSuites])

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

  const mediumOptions = {
    toolbar: {
      buttons: ['bold', 'italic', 'underline', 'strikethrough', 'pre', 'anchor', 'orderedlist', 'unorderedlist']
    }
}

  if (testCases.withTestSuite.length === 0 && testCases.withoutTestSuite.length === 0) {
    return <span>No test cases found</span>
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
              {false && <Description
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
              />}
              <h4>{localize[lang].PRE_CONDITIONS_LABEL}</h4>
              <MediumEditor
                tag='div'
                style={{cursor: 'text'}}
                flushEditorDOM={false}
                text={store.test.preConditions}
                options={mediumOptions}
                placeholder={localize[lang].PRE_CONDITIONS_PLACEHOLDER}
                onChange={text => {
                  console.log(text)
                  store.test.preConditions = text
                  handleBlur()
                }}
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
              {false && <Description
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
              />}
              <h4>{localize[lang].POST_CONDITIONS_LABEL}</h4>
              <MediumEditor
                tag='div'
                style={{cursor: 'text'}}
                flushEditorDOM={false}
                text={store.test.postConditions}
                options={mediumOptions}
                placeholder={localize[lang].POST_CONDITIONS_PLACEHOLDER}
                onChange={text => {
                  store.test.postConditions = text
                  handleBlur()
                }}
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
                          {false && <Description
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
                          />}
                          <MediumEditor
                            tag='div'
                            style={{cursor: 'text'}}
                            flushEditorDOM={false}
                            text={step.action}
                            options={mediumOptions}
                            placeholder={localize[lang].STEPS_ACTION_PLACEHOLDER}
                            onChange={text => {
                              step.action = text
                              handleBlur()
                              if (text.trim())
                                if (i + 1 === store.test.testCaseSteps.length) onAddStep()
                            }}
                            onPaste={event => {
                              if (event instanceof ClipboardEvent) {
                                const clipboardData = event.clipboardData || (window as any).clipboardData
                                const file: File = clipboardData && clipboardData.files && clipboardData.files[0]
                                if (file) {
                                  store.stepIndexForUpload = i
                                  uploadAttachments([file])
                                }
                              }
                            }}
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
                          {false && <Description
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
                          />}
                          <MediumEditor
                            tag='div'
                            style={{cursor: 'text'}}
                            flushEditorDOM={false}
                            text={step.expectedResult}
                            options={mediumOptions}
                            placeholder={localize[lang].STEPS_EXPECTED_RESULT_PLACEHOLDER}
                            onChange={text => {
                              step.expectedResult = text
                              handleBlur()
                              if (text.trim())
                                if (i + 1 === store.test.testCaseSteps.length) onAddStep()
                            }}
                            onPaste={event => {
                              if (event instanceof ClipboardEvent) {
                                const clipboardData = event.clipboardData || (window as any).clipboardData
                                const file: File = clipboardData && clipboardData.files && clipboardData.files[0]
                                if (file) {
                                  store.stepIndexForUpload = i
                                  uploadAttachments([file])
                                }
                              }
                            }}
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
                  <Row className={css.attachmentsRow}>
                    {step.attachments.map((id: number) => {
                      const attachment = store.test.testCaseAttachments.find(at => at.id == id)
                      const name = attachment?.fileName
                      const src = '/' + attachment?.path
                      if (name == null) return null
                      return <span key={id} className={css.attachmentName}><img
                        src={src}
                        data-tip={localize[lang].PREVIEW}
                        onClick={openImage(id)}
                      /><span data-tip={localize[lang].PREVIEW} onClick={openImage(id)}>{name}</span> <IconClose data-tip={localize[lang].DELETE} className={css.attachmentRemove} onClick={onDeleteStepAttachment(i, id)} /></span>
                    })}
                    {step.attachments.length == 0 ?
                      <>
                        <span className={css.noImages}>{localize[lang].NO_IMAGES}</span>
                        <IconPlus data-tip={localize[lang].ADD_IMAGE} className={css.stepDeleteIcon} onClick={onAddStepAttachment(i)} />
                      </>
                      :
                      <IconPlus data-tip={localize[lang].ADD_IMAGE} className={css.stepDeleteIcon + ' ' + css.svgMargin} onClick={onAddStepAttachment(i)} />
                    }
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
          <div style={{ display : "none" }}>
          {!creating && <Attachments
            attachments={store.test.testCaseAttachments.slice().sort((a, b) => a.id - b.id)}
            removeAttachment={removeAttachment}
            uploadAttachments={uploadAttachments}
            canEdit={true}
          />}
          </div>
          {creating && <span>{localize[lang].SAVE_TO_ADD_PIC}</span>}
          </label>
        </Col>
        <Col xs={4} sm={4}>
          <label className={css.field}>
            {validator.validate((handleBlur, shouldMarkError) => (
              <div style={(shouldMarkError && !isEditing('description')) && invalidStyle || undefined}>
                {false && <Description
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
                />}
                <h4>{localize[lang].DESCRIPTION_LABEL}</h4>
                <MediumEditor
                  tag='div'
                  style={{cursor: 'text'}}
                  flushEditorDOM={false}
                  text={store.test.description}
                  options={mediumOptions}
                  placeholder={localize[lang].DESCRIPTION_PLACEHOLDER}
                  onChange={text => {
                    store.test.description = text
                    handleBlur()
                  }}
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
          key={store.uploadInputReset}
          ref={(ref) => store.upload = ref as HTMLInputElement}
          style={{display: 'none'}}
          onChange={onChangeFile}
          accept="image/x-png,image/jpeg,image/png,.jpg,.png"
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
      {true && (
        <TestSuiteFormModal
          key={store.newTestSuiteKey}
          title={store.newTestSuiteTitle}
          onClose={handleTestSuiteFormClose}
          isCreating={true}
          onFinish={handleTestSuiteFormFinish}
          isOpen={store.isCreatingSuite}
        />
      )}
    </form>
  )
}

export default observer(TestingCase)
