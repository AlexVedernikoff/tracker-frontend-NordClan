import { createContext } from "react";
import { action, computed, observable } from "mobx";
import axios from 'axios';
import moment from "moment";
import { API_URL } from "~/constants/Settings";

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
    };

    @computed
    public get creating () {
        return this.testRunId === 'create';
    }


    @observable title: string = '';
    @observable description: string = '';

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