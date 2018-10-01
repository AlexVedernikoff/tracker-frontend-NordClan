import { clearCurrentProjectAndTasks } from '../actions/Tasks';
import { storageType } from '../components/FiltrersManager/helpers';

export const routerWithSession = store => next => action => {
  if (action.type === '@@router/LOCATION_CHANGE') {
    const {
      routing: { locationBeforeTransitions: location }
    } = store.getState();

    if (!location) {
      next(action);
      return;
    }

    const {
      payload: { pathname }
    } = action;
    const prevExec = /projects\/[0-9]+/g.exec(location.pathname);
    const nextExec = /projects\/[0-9]+/g.exec(pathname);

    if (!(prevExec && nextExec && nextExec[0] === prevExec[0]) && storageType) {
      const storage = storageType === 'local' ? localStorage : sessionStorage;

      if (storage.getItem('filtersData')) {
        storage.removeItem('filtersData');
        store.dispatch(clearCurrentProjectAndTasks());
      }
    }
  }
  next(action);
};
