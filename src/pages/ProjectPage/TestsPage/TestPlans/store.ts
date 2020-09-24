import { action, computed, observable } from "mobx";
import { createContext } from "react";
import axios from 'axios';
import moment from "moment";
import { API_URL } from "~/constants/Settings";
import HttpError from "~/components/HttpError";

type TestRunDTO = {
  count: number,
  rows: TestsPlanDTO[]
}

export type TestsPlanDTO = {
    id: number,
    title: string,
    description: string,
    runtime: string,
    projectId: number,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    testRunTestCases: Array<{
        id: number,
        testRunId: number,
        testCaseId: number,
        assignedTo: number,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        deleted_at:  string | null,
        testCaseInfo: {
          id: number,
          title:  string,
          description:  string,
          statusId: number,
          severityId: null,
          priority: number,
          preConditions: string,
          postConditions: string,
          projectId: number,
          duration: string,
          testSuiteId: number | null,
          authorId: number,
          createdAt: string,
          updatedAt: string,
          deletedAt: null,
          authorInfo: {
            fullNameRu:  string | null,
            fullNameEn:  string | null,
          },
          testCaseSteps: Array<{
              id: number,
              testCaseId: number,
              action: string,
              expectedResult: string,
          }>,
          testCaseStatus: {
            id: number,
            name:  string,
            nameEn:  string,
          },
          testCaseSeverity: number | string | null // TODO: number | null
        },
        assignedUser: {
          fullNameRu:  string | null,
          fullNameEn:  string | null,
        }
    }>,
    testRunEnvironments: Array<{
      id: number,
      title: string,
      description?: string,
    }>
}

export type TestsPlan = {
  id: number,
  title: string,
  description?: string,
  createdAt: moment.Moment,
  caseCount: number,
  environmentsCount: number,
}

export class Store {

    @observable storeInit: boolean = false;
    @observable lang: 'ru' | 'en' = 'ru';
    @observable projectId: number = 0;

    @action
    initStore = (newLang: 'ru' | 'en', projectId: number) => {
      this.lang = newLang;
      this.projectId = projectId;
      this.storeInit = true;
    };

    @observable itemCount = 0;
    @observable activePage: number = 1;
    @observable testPlansLoading: boolean = false;
    @observable testPlansErrorLoading: boolean = false;
    @observable testPlans: TestsPlan[] = [];

    @computed
    public get pagesCount () {
      return Math.ceil(this.itemCount / 10);
    }

    @action
    loadTestPlans = async () => {
      try {
        this.testPlansLoading = true;
        const URL = `${API_URL}/project/${this.projectId}/test-run`;
        const { status, data } = await axios.get(URL, { params: { page: this.activePage, }});
        if (status != 200){
          throw Error(`Fail status: ${status}`);
        }
        const { count, rows} = data as TestRunDTO;
        this.itemCount = count;
        this.testPlans = rows.map((tp: TestsPlanDTO) : TestsPlan => ({
          id: tp.id,
          title: tp.title,
          description: tp.description,
          createdAt: moment(tp.createdAt),
          caseCount: tp.testRunTestCases.length,
          environmentsCount: tp.testRunEnvironments?.length ?? 0,
        }));
      }
      catch {
        this.testPlansErrorLoading = true;
      }
      finally {
        this.testPlansLoading = false;
      }
    }

    setPage = async (newPage: number) => {
      this.activePage = newPage;
      await this.loadTestPlans();
    }

}

export default createContext(new Store());