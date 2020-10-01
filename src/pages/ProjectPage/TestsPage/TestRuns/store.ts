import { ChangeEventHandler, createContext } from 'react';
import { observable, action, computed } from 'mobx';
import { API_URL } from '~/constants/Settings';
import localize from './testRuns.json';
import axios from 'axios';
import moment from 'moment';

export const enum TestRunExecutionStatusDTO {
  running = -1,
  success = 0,
  error = 1,
}

export const enum TestRunExecutionCaseStatusDTO {
  error = 0,
  success = 1,
  running = -1,
  blocked = 2,
}

type TestRunExecutionDTO = {
  count: number;
  rows: Array<{
    id: number,
    title: string,
    description?: string,
    testRunId: number,
    projectId: number,
    projectEnvironmentId: number | null,
    startedBy: number,
    startTime: string,
    finishTime: number | null,
    status: number | null,
    createdAt: string,
    updatedAt: string | null,
    testRunInfo?: {
      id: number,
      title: string,
      description?: string,
      runtime: string,
      projectId: number,
      createdAt: string,
      updatedAt: string | null,
    },
    projectEnvironmentInfo? : {
      id: number,
      title: string,
      description?: string,
      projectId: number,
      createdAt: string,
      updatedAt?: string | null,
    },
    startedByUser: {
      fullNameRu: string,
      fullNameEn: string,
    },
    testCaseExecutionData: Array<{
        id: number,
        testRunExecutionId: number,
        testCaseId: number,
        status: number | null,
        description: string | null,
        isIssueCreated: boolean,
        createdAt: string,
        updatedAt: string | null,
    }>,
  }>
};

export type RunTestsExecution = {
  id: number,
  title: string,
  description: string,
  status: number | null,
  start_time: moment.Moment,
  start_who: {
    ru: string,
    en: string,
  }
  environment: {
    id: number,
    title: string,
    description?: string,
  },
  run_time: moment.Duration | null,
  test_status: {
    error: number,
    success: number,
    not_tested: number,
    blocked: number,
  }
}

export class Store {

  @observable storeInit: boolean = false;
  @observable projectId: number = 0;
  @observable lang: 'ru' | 'en' = 'ru';

  @observable itemCount = 0;
  @observable activePage: number = 1;
  @observable runTestsLoading: boolean = false;
  @observable runTestsErrorLoading: boolean = false;
  @observable runTests: RunTestsExecution[] = [];

  @observable runsFilterText: string = '';

  @computed
  public get pagesCount () {
    return Math.ceil(this.itemCount / 10);
  }

  @action
  initStore = (newLang: 'ru' | 'en', projectId: number) => {
    this.lang = newLang;
    this.projectId = projectId;
    this.storeInit = true;
  };

  @action
  setPage = (page: {activePage: number}) => {
    const activePage = page.activePage;
    if (activePage > 0 && this.pagesCount >= activePage ) {
      this.activePage = activePage;
    }
  };

  @action
  loadRuns = async () => {
    try {
      this.runTestsLoading = true;
      const URL = `${API_URL}/project/${this.projectId}/test-run-execution`;
      const { status, data } = await axios.get(URL, { params: {
          page: 1,
        }}
      );

      if (status != 200){
        this.runTestsErrorLoading = true;
      }
      const {count, rows} = data as TestRunExecutionDTO;
      this.itemCount = count;

      this.runTests = rows.map((row): RunTestsExecution => {
        const result: RunTestsExecution = {
          id: row.id,
          title: row.title ?? '',
          description: row.description ?? '',
          status: row.status,
          start_time: moment(row.startTime),
          start_who: {
            ru: row.startedByUser.fullNameRu || localize.ru.UNKNOWN_USER,
            en: row.startedByUser.fullNameEn || localize.en.UNKNOWN_USER,
          },
          environment: {
            id: row.projectEnvironmentInfo?.id ?? 0,
            title: row.projectEnvironmentInfo?.title ?? '',
            description: row.projectEnvironmentInfo?.description ?? '',
          },
          run_time: null,
          test_status: {
            error: 0,
            success: 0,
            not_tested: 0,
            blocked: 0,
          },
        };
        if (row.startTime != null && row.finishTime != null) {
          const startTime = moment(row.startTime);
          const finishTime = moment(row.finishTime);
          result.run_time = moment.duration(finishTime.diff(startTime));
        }
        row.testCaseExecutionData.forEach(({status = -1}, idx) => {
          if (status == null || status == TestRunExecutionCaseStatusDTO.running) result.test_status.not_tested++;
          if (status == TestRunExecutionCaseStatusDTO.error) result.test_status.error++;
          if (status == TestRunExecutionCaseStatusDTO.success) result.test_status.success++;
          if (status == TestRunExecutionCaseStatusDTO.blocked) result.test_status.blocked++;
        });
        return result;
      });
    } catch (error) {
        this.runTestsErrorLoading = true;
    }
    finally {
      this.runTestsLoading = false;
    }
  };

  @action
  changeRunsFilterText = (value: string) => {
    this.runsFilterText = value;
    this.loadRuns();
  }

  @action
  deleteTestRun = async (id: number) => {
    try {
      this.runTestsLoading = true;
      const URL = `${API_URL}/project/${this.projectId}/test-run-execution/${id}`;
      const { status, data } = await axios.delete(URL);
      if (status != 200){
        throw new Error("Delete error");
      }
    } catch {
      this.runTestsErrorLoading = true;
    }
    if (!this.runTestsErrorLoading) {
      this.loadRuns();
    }
  }

}

export default createContext(new Store());