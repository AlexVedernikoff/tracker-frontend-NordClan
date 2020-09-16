export interface Props {
  params: { projectId: string }
  css: any
  testSuites: any[]
  testCases: { withTestSuite: any[], withoutTestSuite: any[] }
  updateTestCase: Function
  getAllTestCases: Function
}
