import axios from 'axios';
import { createContext } from "react";
import { action, observable, computed, reaction } from "mobx";
import { API_URL } from "~/constants/Settings";
import { TestCaseInfo, TestSuiteInfo } from '~/components/TestingCaseReference/Types';

export const RULES = {
  MIN_TITLE_LENGTH: 4,
  MAX_TITLE_LENGTH: 255,
  MAX_TEXT_LENGTH: 5000
};

export type UserInfo = {
  id: number,
  fullNameRu: string,
  fullNameEn: string,
  firstNameRu: string,
  firstNameEn: string,
  lastNameRu: string,
  lastNameEn: string,
}

export type EnvironmentInfo = {
  id: number,
  title: string,
  description?: string,
}

export type Option = {
  label: string;
  value: number;
  className?: string;
}


type InitStoreType = {lang: 'ru' | 'en', projectId: number, testRunExecutionId: number | 'start'};

export class Store {

  public constructor(){
  }

  @observable storeInit: boolean = false;
  @observable projectId: number = 0;
  @observable testRunExecutionId: number | null = null;
  @observable lang: 'ru' | 'en' = 'ru';
  @observable users: UserInfo[] = [];
  @observable environments: EnvironmentInfo[] = [];

  @action.bound
  async initStore({lang, projectId, testRunExecutionId}: InitStoreType ) {
    this.lang = lang;
    this.projectId = projectId;
    this.testRunExecutionId = testRunExecutionId == 'start' ? null : testRunExecutionId;

    this.testPlansLoadingError = false;
    this.testRunSavingError = false;
    this.testCasesDataErrorLoading = false;
    this.testRunLoadingError = false;

    await this.loadTestPlans(),
    await this.loadTestCaseDictionary(),
    await this.loadTestRun(),
    this.storeInit = true;
  };

  @computed
  public get isNewTestRun(): boolean {
    return this.testRunExecutionId == null;
  }

  @action.bound
  setUsers(users: UserInfo[]) {
    this.users = users;
  }

  @action.bound
  setEnvironments(environments: EnvironmentInfo[]) {
    this.environments = environments;
  }

  @computed
  public get usersOption(): Option[] {
    return this.users.map(user => ({
      label: this.lang == 'ru' ? user.fullNameRu : user.fullNameEn,
      value: user.id,
    }));
  }

  @computed
  public get environmentsOption(): Option[] {
    return this.environments.map(environment => ({
      label: environment.title,
      value: environment.id,
    }));
  }

  @observable testRunLoading: boolean = false;
  @observable testRunLoadingError: boolean = false;

  @action.bound
  async loadTestRun() {
    this.title = '';
    this.description = '';
    this.selectedTestPlan = undefined;
    this.selectedEnvironment = undefined;
    this.selectedExecutor = undefined;
    this.testCases = [];

    if (!this.isNewTestRun) {
      try {
        this.testRunLoadingError = false;
        this.testRunLoading = true;
        const testRunURL = `${API_URL}/project/${this.projectId}/test-run-execution/${this.testRunExecutionId}`;
        const {status, data} = await axios.get(testRunURL);
        if (status != 200) {
          throw Error(`Fail status: ${status}`);
        }
        const {title, description, projectEnvironmentInfo: environment, startedByUser, startedBy, testRunInfo} = data;
        this.title = title;
        this.description = description
        this.selectedEnvironment = {value: environment.id, label: environment.title };
        this.selectedExecutor = {value: startedBy, label: this.lang == 'en' ? startedByUser.fullNameEn : startedByUser.fullNameRu };
        this.selectedTestPlan = testRunInfo ? {value: testRunInfo.id, label: testRunInfo.title } : undefined;
        this.testCases = data.testCaseExecutionData.map(ed => ed.testCaseInfo);
      }
      catch {
        this.testRunLoadingError = true;
      }
      finally {
        this.testRunLoading = false;
      }

    }
  }


  @observable testPlansLoading: boolean = false;
  @observable testPlansLoadingError: boolean = false;
  @observable testPlans: {id: number, title: string}[] = [];

  @action.bound
  async loadTestPlans() {
    try {
      this.testPlansLoading = true;
      const testPlansURL = `${API_URL}/project/${this.projectId}/test-run/dict`;
      const {status, data} = await axios.get(testPlansURL);
      if (status != 200) {
        throw Error(`Fail status: ${status}`);
      }
      this.testPlans = data.map(({ id, title }) => ({ id, title }));
    }
    catch {
      this.testPlansLoadingError = true;
    }
    finally {
      this.testPlansLoading = false;
    }
  }

  @computed
  public get testPlansOption(): Option[] {
    return this.testPlans.map(testPlan => ({
      label: testPlan.title,
      value: testPlan.id,
    }));
  }

  @observable title: string = '';
  @observable description: string = '';
  @observable selectedTestPlan: {label: string, value: number} | undefined = undefined;
  @observable selectedEnvironment: {label: string, value: number} | undefined = undefined;
  @observable selectedExecutor: {label: string, value: number} | undefined = undefined;

  @action.bound
  setTitle(newTitle: string) {
    this.title = newTitle;
  }

  @action.bound
  setDescription(newDescription) {
    this.description = newDescription;
  }

  @computed
  public get titleTooShort() {
    return this.title.length < RULES.MIN_TITLE_LENGTH;
  }

  @computed
  public get titleTooLong() {
    return this.title.length > RULES.MAX_TITLE_LENGTH;
  }

  @computed
  public get titleInvalidate() {
    return this.titleTooShort || this.titleTooLong;
  }

  @computed
  public get descriptionInvalidate() {
    return this.description.length > RULES.MAX_TEXT_LENGTH
  }

  @action.bound
  setSelectedTestPlan(id: number) {
    this.selectedTestPlan = this.testPlansOption.find((tp) => tp.value == id);
    if (this.selectedTestPlan) {
      this.loadTestCaseFromProject();
    }
  }

  @computed
  public get hasSave(){
    if (this.titleInvalidate || this.descriptionInvalidate) return false;
    if (this.selectedExecutor == undefined) return false;
    if (this.selectedEnvironment == undefined) return false;
    return this.casesCount > 0;
  }

  @action.bound
  setSelectedEnvironment(id: number){
    this.selectedEnvironment = this.environmentsOption.find((env) => env.value == id);
  }

  @action.bound
  setSelectedExecutor(id: number){
    this.selectedExecutor = this.usersOption.find((user) => user.value == id);
  }

  @observable testCasesDataLoading: boolean = false;
  @observable testCasesDataErrorLoading: boolean = false;
  @observable testCasesLoading: boolean = false;
  @observable testCases: TestCaseInfo[] = [];
  @observable testSuites: TestSuiteInfo[] = [];
  @observable allTestCases: TestCaseInfo[] = [];

  @action
  loadTestCaseDictionary = async () => {
    try {
      this.testCasesDataErrorLoading = false;
      this.testCasesDataLoading = true;
      const testSuitesURL = `${API_URL}/test-suite`;
      const allTestCasesURL = `${API_URL}/test-case?projectId=${this.projectId}`;
      const s = await Promise.all([
        axios.get(testSuitesURL),
        axios.get(allTestCasesURL),
      ]);
      const [
        {status: testSuitesStatus, data: testSuitesData},
        {status: allTestCasesStatus, data: allTestCasesData},
      ] = s;
      if (testSuitesStatus != 200 || allTestCasesStatus != 200) {
        throw Error(`Fail status: ${status}`);
      }
      this.testSuites = testSuitesData;
      this.allTestCases = [...allTestCasesData.withoutTestSuite, ...allTestCasesData.withTestSuite];
    }
    catch {
      this.testCasesDataErrorLoading = true;
    }
    finally {
      this.testCasesDataLoading = false;
    }
  }

  @action
  loadTestCaseFromProject = async () => {
    try {
      this.testCasesDataErrorLoading = false;
      this.testCasesLoading = true;
      const testRunURL = `${API_URL}/test-run/${this.selectedTestPlan!.value}`;
      const {status, data} = await axios.get(testRunURL);
      if (status != 200) {
        throw Error(`Fail status: ${status}`);
      }
      this.testCases = data.testRunTestCases.map(tr => tr.testCaseInfo).filter(r => r!=null);

    }
    catch {
      this.testCasesDataErrorLoading = true;
    }
    finally {
      this.testCasesLoading = false;
    }
  }

  @computed
  public get usedTestSuites() {
    const set = new Set(this.allTestCases.map(tc => tc.testSuiteId));
    return this.testSuites.filter(ts => set.has(ts.id ?? null));
  }

  @computed
  public get casesCount() {
    return this.testCases.length;
  }

  @action.bound
  removeTestCasesFromRun(testCaseId) {
    this.testCases = [...this.testCases].filter(tc => tc.id != testCaseId);
    this.selectedTestPlan = undefined;
  }

  @action.bound
  removeTestSuiteFromRun(testSuiteId: number) {
    this.testCases = this.testCases.filter(tc => tc.testSuiteId != testSuiteId);
    this.selectedTestPlan = undefined;
  }

  @computed
  public get unusedTestCases() {
    const usedTestCasesId = new Set(this.testCases.map(tc => tc.id));
    return this.allTestCases.filter(tc => !usedTestCasesId.has(tc.id))
  }

  @action.bound
  addTestSuiteToRun(testSuiteId: number) {
    this.testCases = [ ...this.testCases, ...(this.unusedTestCases.filter(tc => tc.testSuiteId === testSuiteId )) ];
    this.selectedTestPlan = undefined;
  }

  @action.bound
  addTestCaseToRun(testCase: TestCaseInfo) {
    this.testCases = [ ...this.testCases, testCase ];
    this.selectedTestPlan = undefined;
  }

  @action.bound
  addManyTestCaseToRun(testCasesId: number[]) {
    const set = new Set(testCasesId)

    this.testRunSavingError = false;
    this.testCases = [ ...this.testCases, ...(this.unusedTestCases.filter(tc => set.has(tc.id) )) ];
    this.selectedTestPlan = undefined;
  }

  @observable testRunSaving: boolean = false;
  @observable testRunSavingError: boolean = false;

  @action.bound
  async saveTestRun(){
    try {
      this.testRunSaving = true;
      this.testRunSavingError = false;
      const data = {
        title: this.title,
        description: this.description,
        testRunId: this.selectedTestPlan?.value ?? null,
        projectId: this.projectId,
        projectEnvironmentId: this.selectedEnvironment!.value,
        startedBy: this.selectedExecutor!.value,
        testCasesIds: this.testCases.map(tc => tc.id)
      };

      if (this.isNewTestRun) {
        const createURL = `${API_URL}/project/${this.projectId}/test-run-execution`;
        const {status} = await axios.post(createURL, data);
        if (status != 200) {
          throw Error(`Fail status: ${status}`);
        }
      } else {
        const updateURL = `${API_URL}/project/${this.projectId}/test-run-execution/${this.testRunExecutionId}`;
        const {status} = await axios.put(updateURL, data);
        if (status != 200) {
          throw Error(`Fail status: ${status}`);
        }
      }
    }
    catch {
      this.testRunSavingError = true;
    }
    finally {
      this.testRunSaving = false;
    }

  }

}

export default createContext(new Store());