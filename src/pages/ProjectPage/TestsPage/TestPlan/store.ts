import { createContext } from "react";
import { action, computed, observable } from "mobx";
import axios from 'axios';
import moment from "moment";
import { API_URL } from "~/constants/Settings";
import { TestCaseInfoDTO, TestRunTestCasesDTO, TestsPlanDTO, TestSuiteInfoDTO } from "../TestPlans/TypesDTO";

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
      }
    };

    @computed
    public get creating () {
        return this.testRunId === 'create';
    }

    @observable testPlanErrorLoading: boolean = false;
    @observable testPlanLoading: boolean = false;
    @observable title: string = '';
    @observable description: string = '';
    @observable testRunTestCases: TestRunTestCasesDTO[] = [];
    @observable testSuites: TestSuiteInfoDTO[] = [];
    @observable allTestCases: TestCaseInfoDTO[] = [];

    @action
    loadTestRun = async () => {
      try {
        this.testPlanLoading = true;
        const testRunURL = `${API_URL}/test-run/${this.testRunId}`;
        const testSuitesURL = `${API_URL}/test-suite`;
        const allTestCasesURL = `${API_URL}/test-case`;
        const s = await Promise.all([
          axios.get(testRunURL),
          axios.get(testSuitesURL),
          axios.get(allTestCasesURL),
        ]);
        const [
          {status: testRunStatus, data: testRunData},
          {status: testSuitesStatus, data: testSuitesData},
          {status: allTestCasesStatus, data: allTestCasesData},
        ] = s;
        if (testRunStatus != 200 || testSuitesStatus != 200 || allTestCasesStatus != 200) {
          throw Error(`Fail status: ${status}`);
        }

        const {title, description, testRunTestCases} = testRunData as TestsPlanDTO;
        this.title = title;
        this.description = description;
        this.testRunTestCases = testRunTestCases;
        this.testSuites = testSuitesData;
        this.allTestCases = [...allTestCasesData.withoutTestSuite, ...allTestCasesData.withTestSuite];
      }
      catch {
        this.testPlanErrorLoading = true;
      }
      finally {
        this.testPlanLoading = false;
      }
    };



    @computed
    public get testCases() {
      return this.testRunTestCases.map(tr => tr.testCaseInfo);
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
      // TODO: Проверка на добавленные case
      return true;
    }

    @action
    setTitle = (e: React.ChangeEvent<HTMLInputElement>) => this.title = e.target.value;

    @action
    setDescription = (e: React.ChangeEvent<HTMLInputElement>) => this.description = e.target.value;


    @observable
    isAddToPlan: boolean = false;

    @action
    addToPlan = () => this.isAddToPlan = true;

    @action
    closeAddToPlan = () => this.isAddToPlan = false;

}

export default createContext(new Store());