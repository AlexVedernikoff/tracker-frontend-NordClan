import { observable, action, computed } from 'mobx'
import { Attachment, Props, Suite, TestCase, TestSuite, TempSuite } from './types'
import Validator from '../../components/ValidatedInput/Validator'
import { RULES } from './constants'

export class Store {
  @observable test: TestCase = {} as any
  @observable testSuite: TestSuite | null | undefined = null
  @observable testSuites: Array<TestSuite> = []
  @observable isStepsOpen = true
  @observable isCreatingSuite = false
  @observable newTestSuiteTitle = ''
  @observable newTestSuiteKey = 0
  @observable isEditing: string[] = []
  upload!: HTMLInputElement
  @observable stepIndexForUpload: number = -1
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
        const json: { action: string, attachments: number[] } = JSON.parse(step.action)
        if (json.action === undefined && json.attachments === undefined) throw null
        step.action = json.action
        step.attachments = json.attachments
      } catch (e) {
        step.attachments = []
      }

      step.expectedResult = step.expectedResult || ''
      step.action = step.action || ''

      if (step.expectedResult.indexOf('<') == -1) step.expectedResult = `${step.expectedResult}`
      if (step.action.indexOf('<') == -1) step.action = `${step.action}`
    }

    if (test.description.indexOf('<') == -1) test.description = `${test.description}`
    if (test.preConditions.indexOf('<') == -1) test.preConditions = `${test.preConditions}`
    if (test.postConditions.indexOf('<') == -1) test.postConditions = `${test.postConditions}`

    this.test = observable(test)
  }

  @action private default(authorId: number, projectId: null | number) {
    this.test.id = -1
    this.test.title = ''
    this.test.description = ''
    this.test.statusId = 3
    this.test.severityId = null
    this.test.priority = 3
    this.test.preConditions = ''
    this.test.postConditions = ''
    this.test.projectId = ((typeof projectId) == 'number') ? projectId : null
    this.test.duration = "00:10:00"
    this.test.testSuiteId = null
    this.test.authorId = authorId
    this.test.createdAt = '2020-07-29T14:15:40.670Z'
    this.test.updatedAt = '2020-07-29T14:15:40.670Z'
    this.test.deletedAt = null
    this.test.testCaseAttachments = []
    this.test.testCaseSteps = []
  }

  @computed get isStepsFilled(): boolean {
    return this.test.testCaseSteps.every(stepItem => stepItem.action && stepItem.expectedResult)
  }

  @computed get getTitleIsValid(): boolean {
    const title = this.test.title
    return title.length < RULES.MIN_TITLE_LENGTH || title.length > RULES.MAX_TITLE_LENGTH
  }

  @computed get testCaseAttachmentsObject(): Record<string, Attachment> {
    return this.test.testCaseAttachments.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
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
      this.testSuite = { ...suite }
    }
  }

  @action setTestSuites(suite: Suite[]) {
    this.testSuites = suite.map((el: Suite) => {
      return { label: el.title, value: el.id }
    })
  }

  @action addTempTestSuite(suite: TempSuite) {
    this.testSuites = this.testSuites.concat({ label: suite.title, value: suite.id });
  }

  @action removeTempSuites() {
    this.testSuites = this.testSuites.filter(item => item.value !== -1);
  }

  constructor(testCases: TestCase[], id: number, authorId: number, props: Props) {
    const test = testCases.find(test => test.id === id)
    if (test !== undefined) this.setup(test, props)
    if (test === undefined) this.default(authorId, props.projectId)
  }
}
