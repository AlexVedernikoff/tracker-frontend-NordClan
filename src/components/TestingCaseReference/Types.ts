export type TestCaseInfo = {
    id: number,
    title: string,
    priority?: number,
    authorId: number,
    authorInfo: { fullNameEn: string | null, fullNameRu: string | null },
    severityId: number | null,
    testCaseSeverity: { id?: number | null, name: string, nameEn: string, } | null,
    testSuiteId: null | number,
    testSuiteInfo?: TestSuiteInfo,
}

export type TestSuiteInfo = {
    id?: number | null,
    title: string,
    description?: string | null
}