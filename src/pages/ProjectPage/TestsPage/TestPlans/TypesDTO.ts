export type TestsPlanDTO = {
  id: number;
  title: string;
  description: string;
  runtime: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  testRunTestCases: Array<TestRunTestCasesDTO>;
  testRunEnvironments: Array<{
    id: number;
    title: string;
    description?: string;
  }>;
};


export type TestRunTestCasesDTO = {
  id: number;
  testRunId: number;
  testCaseId: number;
  assignedTo: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deleted_at: string | null;
  testCaseInfo: TestCaseInfoDTO;
  assignedUser: {
    fullNameRu: string | null;
    fullNameEn: string | null;
  };
}

export type TestCaseInfoDTO = {
  id: number;
  title: string;
  description?: string;
  statusId?: number;
  severityId: null;
  priority: number;
  preConditions?: string;
  postConditions?: string;
  projectId: number;
  duration: string;
  testSuiteId: number | null;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  authorInfo: {
    fullNameRu: string | null;
    fullNameEn: string | null;
  };
  testCaseSteps: Array<{
    id: number;
    testCaseId: number;
    action: string;
    expectedResult: string;
  }>;
  testCaseStatus: {
    id: number;
    name: string;
    nameEn: string;
  };
  testCaseSeverity: {
    id: number,
    name: string,
    nameEn: string,
  }
}

export type TestSuiteInfoDTO = {
  id: number,
  title: string,
  description?: string,
  createdAt: string,
  updatedAt: string | null,
  deletedAt: string | null,
  testCases: TestCaseInfoDTO[]
}