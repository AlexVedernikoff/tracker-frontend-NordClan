import * as LoadingActions from '../constants/Loading';

const StartLoading = () => ({
  type: LoadingActions.LOADING_START
});

const FinishLoading = () => ({
  type: LoadingActions.LOADING_FINISH
});

export { StartLoading, FinishLoading };
