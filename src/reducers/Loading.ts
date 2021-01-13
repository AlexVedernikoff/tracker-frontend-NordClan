import { ILoadingStore } from '~/store/store.type';
import * as LoadingActions from '../constants/Loading';

const InitialState: ILoadingStore = {
  loading: 0
};

export default function Loading(state = InitialState, action): ILoadingStore {
  switch (action.type) {
    case LoadingActions.LOADING_START:
      return {
        loading: state.loading + 1
      };

    case LoadingActions.LOADING_FINISH:
      return {
        ...state,
        loading: state.loading - 1
      };

    default:
      return {
        ...state
      };
  }
}
