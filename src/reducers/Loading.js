import * as LoadingActions from '../constants/Loading';

const InitialState = {
  loading: 0
};

export default function Loading(state = InitialState, action) {
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
