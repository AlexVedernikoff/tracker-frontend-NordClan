import { createContext } from "react";
import { action, computed, observable } from "mobx";
import axios from 'axios';
import { API_URL } from "~/constants/Settings";
import { TestRunTestCasesDTO, TestsPlanDTO } from "../TestPlans/TypesDTO";
import { TestCaseInfo, TestSuiteInfo } from "~/components/TestingCaseReference/Types";

export const RULES = {
  MIN_TITLE_LENGTH: 4,
  MAX_TITLE_LENGTH: 255,
  MAX_TEXT_LENGTH: 5000
};

export class Store {

    @observable lang: 'ru' | 'en' = 'ru';
    @observable projectId: number = 0;
    @observable testRunId: number | 'create' = 'create';

    @action
    initStore = (newLang: 'ru' | 'en', projectId: number, testRunId: number | 'create') => {
      this.lang = newLang;
      this.projectId = projectId;
      this.testRunId = testRunId;

      if (this.testRunId !== 'create') {
        this.loadTestRun();
      } else {
        this.initTestRun()
      }
      this.loadTestCaseDictionary();
    };

    @computed
    public get creating () {
        return this.testRunId === 'create';
    }

    @observable testPlanErrorLoading: boolean = false;
    @observable testPlanDataErrorLoading: boolean = false;
    @observable testPlanLoading: boolean = false;
    @observable testPlanDataLoading: boolean = false;
    @observable title: string = '';
    @observable description: string = '';
    @observable testRunTestCases: TestRunTestCasesDTO[] = [];
    @observable testCases: TestCaseInfo[] = [];
    @observable testSuites: TestSuiteInfo[] = [];
    @observable allTestCases: TestCaseInfo[] = [];
    @observable projectEnvironments: any = [];

    @action
    loadTestRun = async () => {
      try {
        this.testPlanErrorLoading = false;
        this.testPlanLoading = true;
        const testRunURL = `${API_URL}/test-run/${this.testRunId}`;
        const {status: testRunStatus, data: testRunData} = await axios.get(testRunURL);
        if (testRunStatus != 200) {
          throw Error(`Fail status: ${status}`);
        }

        const {title, description, testRunTestCases} = testRunData as TestsPlanDTO;
        this.title = title;
        this.description = description;
        this.testRunTestCases = testRunTestCases;
        this.testCases = testRunTestCases.map(tr => tr.testCaseInfo).filter(r => r!=null);
      }
      catch {
        this.testPlanErrorLoading = true;
      }
      finally {
        this.testPlanLoading = false;
      }
    };

    @action
    initTestRun = async () => {
      this.title = '';
      this.description = '';
      this.testRunTestCases = [];
      this.testCases = [];
  }

    @action
    loadTestCaseDictionary = async () => {
      try {
        this.testPlanDataErrorLoading = false;
        this.testPlanDataLoading = true;
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
        this.testPlanDataErrorLoading = true;
      }
      finally {
        this.testPlanDataLoading = false;
      }
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

    @computed
    public get hasSave() {
      if  (this.titleInvalidate || this.descriptionInvalidate) return false;
      if (this.testCases.length == 0) return false;
      return true;
    }

    @computed
    public get casesCount() {
      return this.testCases.length;
    }

    @computed
    public get unusedTestCases(): TestCaseInfo[] {
      const selectedCasesId = this.testCases.map(ts => ts.id);
      return this.allTestCases.filter(ts => !selectedCasesId.includes(ts.id))
    }

    @computed
    public get unusedTestCasesCount(): number {
      return this.unusedTestCases.length;
    }


    @action
    setTitle = (e: React.ChangeEvent<HTMLInputElement>) => this.title = e.target.value;

    @action
    setDescription = (e: React.ChangeEvent<HTMLInputElement>) => this.description = e.target.value;

    @action
    addTestCasesToPlan = (...testCases: TestCaseInfo[]) => {
      this.testCases = [...this.testCases, ...testCases];
    }

    @action
    removeTstCasesToPlan = (...testCasesId: number[]) => {
      this.testCases = this.testCases.filter(tc => !testCasesId.includes(tc.id));
    }

    @observable
    isAddToPlan: boolean = false;

    @action
    addToPlan = () => this.isAddToPlan = true;

    @action
    closeAddToPlan = () => this.isAddToPlan = false;

    private generateSaveData(){

      const testCasesData = this.testCases.map(
        (tc) => ({
          testCaseId: tc.id,
          assignedTo: null
        })
      )

      return {
        title: this.title,
        description: this.description,
        projectId: this.projectId,
        runtime: "0:00:00",
        testCasesData,
        projectEnvironments: [1]
      }
    }

    @observable isSaveData = false;

    @action
    saveTestPlan = async () => {
      try {
        this.isSaveData = true;
        const saveURL = `${API_URL}/test-run/${this.testRunId}`;
        await axios.put(saveURL, this.generateSaveData());
      }
      catch {
        this.testPlanDataErrorLoading = true;
      }
      finally {
        this.isSaveData = false;
      }
    }

    @action
    createTestPlan= async () => {
      try {
        this.isSaveData = true;
        const createURL = `${API_URL}/test-run`;
        await axios.post(createURL, this.generateSaveData());
      }
      catch {
        this.testPlanDataErrorLoading = true;
      }
      finally {
        this.isSaveData = false;
      }
    }
}

export default createContext(new Store());