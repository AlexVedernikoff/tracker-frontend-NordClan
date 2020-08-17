export interface TestCaseStep {
  id?: number
  testCaseId?: number
  action: string
  expectedResult: string
  key?: string
  attachments: number[]
}

export interface TestSuite {
  label: string
  value: number | string
}

export interface Attachment {
  deletedAt: null
  fileName: string
  id: number
  path: string
  previewPath: string
  size: number
  type: string
}

export interface TestCase {
  id: number
  title: string,
  description: string,
  statusId: number | null,
  severityId: number | null,
  priority: number,
  preConditions: string,
  postConditions: string,
  projectId: null | number,
  duration: string,
  testSuiteId: number | null,
  authorId: number,
  createdAt: string,
  updatedAt: string,
  deletedAt: null,
  testCaseSteps: TestCaseStep[]
  testCaseAttachments: Attachment[]
}

export interface Props {
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
  projectId: null | number
}

export interface Suite {
  title: string
  id: number
}
