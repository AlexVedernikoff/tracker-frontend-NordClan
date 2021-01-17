export interface Props {
  params: { projectId: string }
  testCasesByProject: any;
  testSuitesByProject: any;
  css: any
  testSuitesReference: any[]
  lang: 'ru' | 'en'
  testCasesReference: { withTestSuite: any[], withoutTestSuite: any[] }
  getAllTestCases: Function
  getAllTestSuites: Function
  getTestSuitesReference: Function
  getTestCasesReference: Function
  updateTestSuite: Function
  copyTestCase: Function
  copyTestSuite: Function
  deleteTestCase: Function;
  showNotification: Function;
  router: any;
  userRoles: any;
}
