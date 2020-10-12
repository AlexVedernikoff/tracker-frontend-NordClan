import axios from 'axios';
import { action, observable, computed } from "mobx";
import moment from 'moment';
import { createContext } from "react";
import { API_URL } from "~/constants/Settings";

export enum TestCasesExecutionStatus {
    /* NOT_TESTED = null */
    FAIL = -1,
    SUCCESS = 1,
    BLOCKED = 2,
    SKIPED = 3,

    LOADING = 1000,
};

export class Store {
    @observable lang: 'ru' | 'en' = 'ru';
    @observable projectId: number | null = null;
    @observable testRunExecutionId: number | null = null;
    @observable userId: number = -1;
    @observable userName: string = '';

    @observable testRunExecution: {
        title: string;
        description: string;
        startTime: moment.Moment | null;
        environment: { id: number, title: string } | null;
        executor: { id: number, fullName: string } | null;
        startedBy: { id: number, fullName: string } | null;
        testPlan: { id: number, title: string } | null;
    } = { title: '', description: '', environment: null, executor: null, startedBy: null, testPlan: null, startTime: null };
    @observable storeInit: boolean = false;
    @observable testRunExecutionLoading: boolean = false;
    @observable testRunExecutionLoadingError: boolean = false;
    @observable dictionaryLoading: boolean = false;
    @observable dictionaryLoadingError: boolean = false;
    @observable testCasesExecution: any[] = [];
    @observable testCases: any[] = [];
    @observable testSuites: any[] = [];

    @action.bound
    async initStore(lang, projectId, testRunExecutionId, userId, userName) {
        this.lang = lang;
        this.projectId = projectId;
        this.testRunExecutionId = testRunExecutionId;
        this.userId = userId;
        this.userName = userName;
        this.testCases = [];
        this.testCasesExecution = [];
        try {
            this.storeInit = false;
            await this.loadTestCaseDictionary(),
            await this.loadTestRunExecution();
            this.storeInit = true;
        }
        catch { }
    }

    @action.bound
    async loadTestCaseDictionary() {
        try {
            this.dictionaryLoadingError = false;
            this.dictionaryLoading = true;
            const testSuitesURL = `${API_URL}/test-suite`;
            const [
                { status: testSuitesStatus, data: testSuiteData },
            ] = await Promise.all([
                axios.get(testSuitesURL)
            ]);
            if (testSuitesStatus != 200) {
                throw Error(`Fail status`);
            }
            this.testSuites = testSuiteData;
        }
        catch {
            this.dictionaryLoadingError = true;
        }
        finally {
            this.dictionaryLoading = false;
        }

    }

    @action.bound
    async loadTestRunExecution() {
        if (this.projectId != null && this.testRunExecutionId != null) {
            try {
                this.testRunExecutionLoadingError = false;
                this.testRunExecutionLoading = true;
                const testRunURL = `${API_URL}/project/${this.projectId}/test-run-execution/${this.testRunExecutionId}`;
                const { status, data } = await axios.get(testRunURL);
                if (status != 200) {
                    throw Error(`Fail status: ${status}`);
                }
                const { title, description, projectEnvironmentInfo: environment, startedByUser, startedBy, executorUser, executor, testRunInfo, startTime } = data;
                this.testRunExecution = {
                    title, description, environment,
                    startTime: moment(startTime),
                    executor: executor ? { id: executor, fullName: this.lang == 'en' ? executorUser.fullNameEn : executorUser.fullNameRu } : null,
                    startedBy: { id: startedBy, fullName: this.lang == 'en' ? startedByUser.fullNameEn : startedByUser.fullNameRu },
                    testPlan: testRunInfo,
                };
                this.testCasesExecution = data.testCaseExecutionData;
                this.testCases = data.testCaseExecutionData.map(ed => ed.testCaseInfo).filter(ed => ed != null);
            }
            catch {
                this.testRunExecutionLoadingError = true;
            }
            finally {
                this.testRunExecutionLoading = false;
            }
        } else {
            this.testRunExecution = { title: '', description: '', environment: null, executor: null, startedBy: null, testPlan: null, startTime: null };
            this.testCases = [];
        }
    }

    @computed
    public get usedTestSuites() {
        const set = new Set(this.testCases.map(tc => tc.testSuiteId));
        return this.testSuites.filter(ts => set.has(ts.id ?? null));
    }

    @computed
    public get testCasesCount() {
        return this.testCases.length;
    }

    @computed
    public get testCasesExecutionDict() {
        return this.testCasesExecution.reduce((p, v) => ({ ...p, [v.testCaseId]: v }), {});
    }

    @action.bound
    public async setTestCaseStatus(testCaseId: number, status: TestCasesExecutionStatus) {
        const testCasesExecution = this.testCasesExecution.find(tce => tce.testCaseId == testCaseId);
        if (testCasesExecution) {
            testCasesExecution.status = TestCasesExecutionStatus.LOADING;
            try {
                const testCasesExecutionURL = `${API_URL}/test-case-execution/${testCasesExecution.id}`;
                await axios.put(testCasesExecutionURL, { status });
            }
            catch { }
        }
        await this.loadTestRunExecution();
    }

    @computed({ keepAlive: true })
    public get testCasesExecutionStatus() {
        const counter = this.testCasesExecution.reduce((p, tce) => {
            if (tce.status == null) return { ...p, not_tested: p.not_tested + 1 };
            if (tce.status == TestCasesExecutionStatus.SKIPED) return { ...p, skiped: p.skiped + 1 };
            if (tce.status == TestCasesExecutionStatus.BLOCKED) return { ...p, blocked: p.blocked + 1 };
            if (tce.status == TestCasesExecutionStatus.FAIL) return { ...p, fail: p.fail + 1 };
            if (tce.status == TestCasesExecutionStatus.SUCCESS) return { ...p, success: p.success + 1 };
            return p;
        }, { not_tested: 0, fail: 0, success: 0, blocked: 0, skiped: 0 })
        let executionCount = this.testCasesExecution.length;
        if (executionCount == 0) executionCount = 1;
        const result = {
            fullProcent: 0,
            not_tested: {
                count: counter.not_tested + counter.skiped,
                percent: Math.round((counter.not_tested + counter.skiped) / executionCount * 100),
            },
            fail: {
                count: counter.fail,
                percent: Math.round(counter.fail / executionCount * 100),
            },
            success: {
                count: counter.success,
                percent: Math.round(counter.success / executionCount * 100),
            },
            blocked: {
                count: counter.blocked,
                percent: Math.round(counter.blocked / executionCount * 100),
            }
        };
        result.fullProcent = 100 - result.not_tested.percent;
        return result;
    }

    @action.bound
    async deleteTestRunExecution() {
        try {
            const URL = `${API_URL}/project/${this.projectId}/test-run-execution/${this.testRunExecutionId}`;
            const { status, data } = await axios.delete(URL);
            if (status != 200) {
                throw new Error("Delete error");
            }
        } catch {
        }
    }

    @observable testCaseInfo: any | null = null;
    @observable testCaseStepInfo: any[]  = [];
    @observable testCaseInfoShowActionPlace: boolean = false;

    @action.bound
    loadTestCaseInfo(testCaseId) {
        const testCasesExecutionData = this.testCasesExecutionDict[testCaseId];
        this.testCaseInfo = testCasesExecutionData.testCaseInfo;
        this.testCaseStepInfo = testCasesExecutionData.testStepExecutionData;
        this.testCaseInfoShowActionPlace = testCasesExecutionData.status == null || testCasesExecutionData.status == TestCasesExecutionStatus.SKIPED;
    }

}

export default createContext(new Store());