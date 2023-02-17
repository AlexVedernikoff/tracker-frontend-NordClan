import { action, observable } from 'mobx';
import { createContext } from 'react';
import { UserGuides, loadUserGuides } from '~/api/UserGuide';

export class Store {
    @observable guides: UserGuides = {} as UserGuides;

    @action
    loadUserGuides = async () => {
        this.guides = await loadUserGuides();
    }
}

export default createContext(new Store());
