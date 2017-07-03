import * as LoadingActions from '../constants/Loading';

const StartLoading = () => {
  return {
    type: LoadingActions.LOADING_START
  };
};

const FinishLoading = () => {
  return {
    type: LoadingActions.LOADING_FINISH
  };
};

export { StartLoading, FinishLoading };
