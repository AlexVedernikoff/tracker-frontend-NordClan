import { createContext } from 'react';
import { observable, action, computed } from 'mobx'

export class Store {

  @observable langInit: boolean = false;
  @observable lang: 'ru' | 'en' = 'ru';

  @observable pagesCount: number = 1;
  @observable activePage: number = 1;
  @observable runTestsLoading: boolean = false;
  @observable runTests: any[] = [ ];

  @action
  setLang = (newLang: 'ru' | 'en') => {
    this.langInit = true;
    this.lang = newLang;
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
    this.runTestsLoading = true;
    await new Promise((r) => setTimeout(r, 700));
    this.runTests = [
      {
        id: 0,
        name: "Test run 1",
        state: 0,
        start_time: {
          date: Date.parse('Mon Dec 09 2019 02:20:37 GMT+0300 (Moscow Standard Time)'),
          who: "User 1"
        },
        environment: '',
        run_time: 564,
        test_status: {
            error: 3,
            success: 20,
            not_tested: 20,
            blocked: 156,
        }
      },
      {
        id: 1,
        name: "Test run 2",
        state: 1,
        start_time: {
          date: Date.parse('Mon Mar 16 2020 00:09:13 GMT+0300 (Moscow Standard Time)'),
          who: "User 2"
        },
        environment: '',
        run_time: 15,
        test_status: {
            error: 20,
            success: 0,
            not_tested: 0,
            blocked: 300,
        }
      },
      {
        id: 2,
        name: "Test run 3",
        state: 2,
        start_time: {
          date: Date.parse('Mon Sep 30 2019 17:31:17 GMT+0300 (Moscow Standard Time)'),
          who: "User 1"
        },
        environment: '',
        run_time: 564,
        test_status: {
            error: 1,
            success: 12,
            not_tested: 40,
            blocked: 40,
        }
      }
    ];
    this.runTestsLoading = false;
  };

}

export default createContext(new Store());